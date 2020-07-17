const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const csv = require('fast-csv')
const db = require('../../../../services/db')
const fileService = require('../../../../services/file')
const drawingHistoryService = require('../../../../services/drawing-history')

const upload = multer({
    dest: path.join(__dirname, '../../../../uploads/'),
})
const manageDrawingsRouter = express.Router()

/**
 * Lấy drawings dựa trên ids và tên customer
 */
manageDrawingsRouter.post('/get-drawings', async (req, res) => {
    try {
        const { data } = req.body
        const { drawing_ids, drawing_relative_paths } = data

        let subQuery1 = ` TRUE `
        if (drawing_ids && drawing_ids.length !== 0) {
            subQuery1 = ` td.drawing_id IN (${drawing_ids.join(', ')}) `
        }

        let subQuery2 = ` TRUE `
        if (drawing_relative_paths && drawing_relative_paths.length !== 0) {
            subQuery2 = ` td.drawing_relative_path IN (${drawing_relative_paths.map((e) => `'${e}'`).join(', ')}) `
        }

        const query = `
            SELECT t_d.*, t_u.user_fullname as drawing_created_by_full_name, t_u_1.user_fullname as drawing_updated_by_full_name, count_drawings.count as drawing_updated_count
            FROM tbl_drawings t_d
            INNER JOIN (
                SELECT td.drawing_id, COUNT(tdh.drawing_id) as count
                FROM tbl_drawings td
                LEFT JOIN tbl_drawings_history tdh ON td.drawing_id = tdh.drawing_id
                WHERE ${subQuery1} AND ${subQuery2}
                GROUP BY td.drawing_id
            ) count_drawings ON count_drawings.drawing_id = t_d.drawing_id
            LEFT JOIN tbl_users t_u ON t_u.user_id = t_d.drawing_created_by
            LEFT JOIN tbl_users t_u_1 ON t_u_1.user_id = t_d.drawing_updated_by;
        `

        const result = await db.postgre.run(query).catch(() => {
            return null
        })

        if (result) {
            const { rows } = result
            let newRows = []
            /** Kiểm tra xem các drawing này có drawing file ở mức vật lý chưa */
            const settingQuery = `
                SELECT *
                FROM tbl_settings
                LIMIT 1;
            `
            const settingResult = await db.postgre.run(settingQuery).catch(() => null)

            if (settingResult) {
                const settings = settingResult.rows[0]
                const tasks = []
                rows.forEach((e) => {
                    tasks.push(fileService.checkExistFile(settings, e, 'qc'))
                })
                newRows = await Promise.all(
                    tasks.map((e) =>
                        e.catch((error1) => {
                            console.log(error1)
                        })
                    )
                )
            }

            return res.status(200).json({
                code: 0,
                data: {
                    returnedData: newRows,
                },
            })
        }

        return res.status(500).json({
            code: 1,
        })
    } catch (error) {
        return res.status(500).json({
            code: 1,
        })
    }
})

/**
 * Tạo drawing
 * Có file drawing thì upload file trước, upload file thất bại thì kết thúc => tạo drawing, nếu tạo thất bại thì rollback cái file đã upload
 */
manageDrawingsRouter.post('/create-drawing', upload.single('file'), async (req, res) => {
    try {
        const { file, user } = req

        const { drawing_customer, drawing_kouban, drawing_relative_path, drawing_part_name, bkFolderName } = JSON.parse(req.body.data)
        let drawing_file_name = ''

        let resultUploadFileService = {
            result: true,
            rollBack: () => {},
        }

        if (file) {
            const { originalname, filename } = file
            drawing_file_name = originalname
            resultUploadFileService = await fileService.uploadFile(drawing_relative_path, bkFolderName, originalname, filename, 'qc')
        }

        if (resultUploadFileService.result) {
            let formatFile = drawing_file_name
            if (drawing_file_name.substring(drawing_file_name.length, drawing_file_name.length - 4) === '.pdf') {
                formatFile = drawing_file_name.substring(0, drawing_file_name.length - 4)
            }
            const query = `
                INSERT INTO tbl_drawings (
                    drawing_customer,
                    drawing_kouban,
                    drawing_relative_path,
                    drawing_part_name,
                    drawing_file_name,
                    drawing_created_by
                ) VALUES (
                    ${drawing_customer ? `'${drawing_customer}'` : null},
                    ${drawing_kouban ? `'${drawing_kouban}'` : null},
                    ${drawing_relative_path ? `'${drawing_relative_path}'` : null},
                    ${drawing_part_name ? `'${drawing_part_name}'` : null},
                    ${drawing_file_name ? `'${formatFile}'` : null},
                    '${user.user_id}'
                )

                RETURNING *;
            `

            const result = await db.postgre.run(query).catch(() => null)

            if (result) {
                const { rows } = result

                return res.status(200).json({
                    code: 0,
                    rows,
                })
            }

            resultUploadFileService.rollBack()
        }

        return res.status(500).json({
            code: 1,
        })
    } catch (error) {
        return res.status(500).json({
            code: 1,
        })
    }
})

/** Cập nhật drawing, ghi lại lịch sử của nó và rollback nếu có lỗi
 * Nếu upload file thất bại thì kết thúc
 * => Nếu ghi lịch sử thất bại thì kết thúc và roll back lại file đã upload
 * => Nếu cập nhật drawing thất bại thì roll back lại lịch sử cập nhật và roll back lại file đã upload
 */
manageDrawingsRouter.post('/update-drawing', upload.single('file'), async (req, res) => {
    try {
        const { file, user } = req
        const { drawing_id, drawing_customer, drawing_kouban, drawing_relative_path, drawing_part_name, drawing_file_name, bkFolderName } = JSON.parse(
            req.body.data
        )

        const resultDrawingHistory = await drawingHistoryService.drawingHistory(drawing_id, user.user_id)
        if (resultDrawingHistory.result) {
            let new_drawing_file_name = drawing_file_name
            let resultUploadFileService = {
                result: true,
            }

            if (file) {
                const { originalname, filename } = file
                new_drawing_file_name = originalname
                resultUploadFileService = await fileService.uploadFile(drawing_relative_path, bkFolderName, originalname, filename, 'qc')
            }

            if (resultUploadFileService.result) {
                let formatFile = new_drawing_file_name
                if (new_drawing_file_name.substring(new_drawing_file_name.length, new_drawing_file_name.length - 4).toLowerCase() === '.pdf') {
                    formatFile = new_drawing_file_name.substring(0, new_drawing_file_name.length - 4)
                }

                const arrCells = [drawing_id, drawing_customer, drawing_kouban, drawing_relative_path, drawing_part_name, user.user_id]
                const query = `
                    UPDATE tbl_drawings
                    SET
                        drawing_customer = $2,
                        drawing_kouban = $3,
                        drawing_relative_path = $4,
                        drawing_part_name = $5,
                        drawing_updated_at = now(),
                        drawing_updated_by = $6,
                        drawing_file_name = ${new_drawing_file_name ? `'${formatFile}'` : null}
                    WHERE drawing_id = $1
                    RETURNING *;
                `

                const result = await db.postgre.runWithPrepare(query, arrCells).catch(() => null)

                if (result) {
                    const { rows } = result

                    if (result.rowCount !== 0) {
                        return res.status(200).json({
                            code: 0,
                            rows,
                        })
                    }
                    // return res.status(200).json({
                    //     code: 0,
                    //     rows,
                    // })
                }

                resultUploadFileService.rollBack()
            }

            resultDrawingHistory.rollBack()
        }

        return res.status(500).json({
            code: 1,
        })
    } catch (error) {
        return res.status(500).json({
            code: 1,
        })
    }
})

/**
 * Xóa drawing (deactive thôi hà)
 */
manageDrawingsRouter.post('/delete-drawing', async (req, res) => {
    try {
        const { data } = req.body
        const { drawing_id, drawing_relative_path, drawing_file_name, drawing_is_deleted } = data

        let resultDeleteFile = {
            result: true,
            rollBack: () => {},
        }

        if (drawing_file_name) {
            resultDeleteFile = await fileService.deleteFile(drawing_relative_path, drawing_file_name, 'qc')
        }

        if (resultDeleteFile.result) {
            const query = `
                UPDATE tbl_drawings
                SET drawing_is_deleted = ${!drawing_is_deleted}, drawing_file_name = null
                WHERE drawing_id = ${drawing_id}
                RETURNING *;
            `

            const result = await db.postgre.run(query).catch(() => null)

            if (result) {
                const { rows } = result
                return res.status(200).json({
                    code: 0,
                    rows,
                })
            }

            resultDeleteFile.rollBack()
        }

        return res.status(500).json({
            code: 1,
        })
    } catch (error) {
        return res.status(500).json({
            code: 1,
        })
    }
})

/**
 * Đồng bộ drawing trong một customer nào đó, hay thực chất là thêm nhiều drawings của một khách hàng vô database với drawing đó có các giá trị đều rỗng
 */
manageDrawingsRouter.post('/sync-drawings', async (req, res) => {
    try {
        const { needSyncDrawings, needSyncFolder } = req.body.data
        const { user } = req

        if (needSyncDrawings.length === 0 || !needSyncFolder) {
            return res.status(200).json({
                code: 1,
            })
        }

        let query = ''

        needSyncDrawings.forEach((e) => {
            let formatFile = e.relativePath

            if (e.relativePath.substring(e.relativePath.length, e.relativePath.length - 4) === '.pdf') {
                formatFile = e.relativePath.substring(0, e.relativePath.length - 4)
            }
            query += `
                INSERT INTO tbl_drawings (drawing_customer, drawing_kouban, drawing_file_name, drawing_relative_path, drawing_created_by, drawing_part_name)
                VALUES (null, null, ${e.relativePath ? `'${formatFile}'` : null}, '${needSyncFolder}', '${user.user_id}', null);
            `
        })

        const result = await db.postgre.run(query).catch((err) => {
            console.log(err)
            return null
        })

        if (result) {
            return res.status(200).json({
                code: 0,
            })
        }

        return res.status(500).json({
            code: 1,
        })
    } catch (error) {
        return res.status(500).json({
            code: 1,
        })
    }
})

/**
 * Cập nhật hoặc thêm drawing dựa trên file csv được truyền vào
 * File CSV: là file của khách hàng xuất ra từ một hệ thống khác, lấy cột fileName làm khóa để mà cập nhật (không có drawing id đâu)
 * Trả về yêu cầu phải có:
 * 1. Những drawing nào cập nhật thành công
 * 2. Những drawing nào không có trong database thì thêm vào database
 * 3. Những drawing nào cập nhật thất bại (phải rollback lại trong bảng lịch sử drawing)
 * 4. Những drawing nào không thể tạo được lịch sử (không tạo được lịch sử thì không cập nhật)
 * Summary: Kiểm tra những drawing nào có trong database
 * => trong đống này drawing nào có thể ghi lại được lịch sử
 * => đi cập nhật đống này
 * => cái nào cập nhật được thì trả về, cái nào không cập nhật được cũng trả về nhưng trước đó phải xóa nó ra khỏi bảng lịch sử
 */
manageDrawingsRouter.post('/search-file-by-csv', upload.single('file'), (req, res) => {
    try {
        const { user } = req
        const temp = path.join(__dirname, `../../../../uploads/${req.file.filename}`)
        const conditions = []
        return fs
            .createReadStream(temp)
            .pipe(csv.parse({ headers: ['file_name', 'customer', 'kouban', 'part_name'], renameHeaders: true }))
            .on('error', () => {
                fs.unlinkSync(temp)
                return res.status(500).json({
                    code: 1,
                })
            })
            .on('data', (row) => {
                if (row.file_name) {
                    conditions.push({
                        // file_name: `${row.file_name}.pdf`,
                        file_name: `${row.file_name}`,
                        customer: row.customer || '',
                        kouban: row.kouban || '',
                        part_name: row.part_name || '',
                    })
                }
            })
            .on('end', async () => {
                fs.unlinkSync(temp)
                const tasks = []
                const tasks1 = []
                const tasks2 = []
                const historyFails = []
                const missing = []
                const error = []
                const updating = []
                const creating = []
                if (conditions.length !== 0) {
                    conditions.forEach((e) => {
                        // tasks.push(drawingHistoryService.drawingHistoryCSV(e.file_name, user.user_id))
                        tasks.push(drawingHistoryService.drawingHistoryCSV(e, user.user_id))
                    })

                    const result = await Promise.all(
                        tasks.map((e) =>
                            e.catch((error1) => {
                                console.log(error1)
                            })
                        )
                    )

                    const rollBacks = []
                    if (result) {
                        result.forEach((e) => {
                            if (e.result === 2) {
                                missing.push(e.data)
                            } else if (e.result === 0) {
                                // error.push(e.data)
                                historyFails.push(e.data)
                            } else {
                                const updateDrawing = conditions.find((e1) => {
                                    return e1.file_name === e.data.file_name
                                })

                                if (updateDrawing) {
                                    const query1 = `
                                        UPDATE tbl_drawings
                                        SET drawing_customer = '${updateDrawing.customer}'
                                            , drawing_kouban = '${updateDrawing.kouban}'
                                            , drawing_part_name = '${updateDrawing.part_name}'
                                        WHERE drawing_file_name = '${updateDrawing.file_name}'
                                        RETURNING *;
                                    `

                                    tasks1.push(db.postgre.run(query1))
                                    rollBacks.push({
                                        rollBack: e.rollBack,
                                        file_name: updateDrawing.file_name,
                                    })
                                } else {
                                    missing.push(e.data)
                                }
                            }
                        })

                        const result1 = await Promise.all(
                            tasks1.map((e) =>
                                e.catch((error1) => {
                                    console.log(error1)
                                })
                            )
                        )

                        if (result1) {
                            for (let index = 0; index < result1.length; index += 1) {
                                const e = result1[index]
                                if (e) {
                                    const { rows } = e

                                    if (rows.length === 0) {
                                        missing.push(rollBacks[index].file_name)
                                    } else {
                                        updating.push(...rows)
                                    }
                                } else {
                                    rollBacks[index].rollBack()
                                    error.push(rollBacks[index].file_name)
                                }
                            }

                            missing.forEach((e) => {
                                const insertQuery = `
                                    INSERT INTO tbl_drawings (
                                        drawing_customer,
                                        drawing_kouban,
                                        drawing_relative_path,
                                        drawing_part_name,
                                        drawing_file_name,
                                        drawing_created_by
                                    ) VALUES (
                                        ${e.customer ? `'${e.customer}'` : null},
                                        ${e.kouban ? `'${e.kouban}'` : null},
                                        ${e.customer ? `'${e.customer}'` : null},
                                        ${e.part_name ? `'${e.part_name}'` : null},
                                        ${e.file_name ? `'${e.file_name}'` : null},
                                        '${user.user_id}'
                                    )

                                    RETURNING *;
                                `

                                tasks2.push(db.postgre.run(insertQuery))
                            })

                            const resultInsert = await Promise.all(
                                tasks2.map((e) =>
                                    e.catch((error1) => {
                                        console.log(error1)
                                    })
                                )
                            )

                            resultInsert.forEach((e) => {
                                creating.push(e.rows[0])
                            })

                            return res.status(200).json({
                                code: 0,
                                data: {
                                    updating,
                                    error,
                                    historyFails,
                                    creating,
                                },
                            })
                        }
                    }

                    return res.status(500).json({
                        code: 1,
                    })
                }

                return res.status(200).json({
                    code: 0,
                    data: {
                        returnedData: [],
                    },
                })
            })
    } catch (error) {
        return res.status(500).json({
            code: 1,
        })
    }
})

/**
 * Kiểm tra xem trong ổ cứng có drawing nào mà trong database lại không có ấy mà
 */
manageDrawingsRouter.post('/check-async-drawings', async (req, res) => {
    try {
        const { data } = req.body
        const { drawing_relative_path, drawing_file_names } = data

        const query = `
            SELECT *
            FROM tbl_drawings
            WHERE drawing_relative_path = '${drawing_relative_path}' AND drawing_is_deleted = FALSE;
        `

        const result = await db.postgre.run(query).catch(() => null)

        if (result) {
            const { rows } = result
            const needSyncDrawings = []
            const needSyncFolder = drawing_relative_path

            for (let index = 0; index < drawing_file_names.length; index += 1) {
                const e1 = drawing_file_names[index]
                const drawing = rows.find((e2) => `${e2.drawing_file_name}.pdf` === e1.relativePath)

                if (!drawing) {
                    needSyncDrawings.push(e1)
                }
            }

            return res.status(200).json({
                code: 0,
                data: {
                    needSyncDrawings,
                    needSyncFolder,
                },
            })
        }

        return res.status(500).json({
            code: 1,
        })
    } catch (error) {
        return res.status(500).json({
            code: 1,
        })
    }
})

/**
 * Mở một file drawing nào đó trên trình duyệt (hông phải download đâu nghen)
 */
manageDrawingsRouter.get('/open-drawing:relativePath', async (req, res) => {
    try {
        const query = `
            SELECT * FROM tbl_settings LIMIT 1;
        `

        const result = await db.postgre.run(query).catch(() => {
            return null
        })

        if (result) {
            const { rows } = result
            if (rows.length !== 0) {
                const { qc_path_value } = rows[0]
                if (qc_path_value) {
                    return res.sendFile(path.join(qc_path_value, req.params.relativePath))
                }
            }
        }

        return res.status(500).json({
            code: 2,
        })
    } catch (error) {
        return res.status(500).json({
            code: 1,
        })
    }
})

/**
 * Lấy danh sách files và directories tại một đường dẫn truyền vào (với base là QC Path hoặc Office Path)
 */
manageDrawingsRouter.post('/get-directory', async (req, res) => {
    try {
        const { type, arrRelativePath } = req.body
        const relativePath = arrRelativePath.join('/')
        const query = `
            SELECT office_path_value, qc_path_value
            FROM tbl_settings
        `
        const result = await db.postgre.run(query).catch(() => {
            return null
        })

        if (result) {
            const { rows } = result
            if (rows.length !== 0) {
                const { qc_path_value, office_path_value } = rows[0]
                let source = ``
                let baseSource = ''
                /**
                 * Là QC Path
                 */
                if (type === 'qc') {
                    if (!qc_path_value) {
                        return res.status(500).json({
                            code: 2,
                            files: [],
                            directories: [],
                        })
                    }
                    source = `${qc_path_value}/${relativePath}`
                    baseSource = qc_path_value
                    /**
                     * Là Office Path
                     */
                } else {
                    if (!office_path_value) {
                        return res.status(500).json({
                            code: 2,
                            files: [],
                            directories: [],
                        })
                    }
                    source = `${office_path_value}/${relativePath}`
                    baseSource = office_path_value
                }
                /**
                 * Nếu đường dẫn không tồn tại thì lỗi bạn nhé
                 */
                if (!fs.existsSync(source)) {
                    return res.status(500).json({
                        code: 3,
                        files: [],
                        directories: [],
                    })
                }

                const files = []
                const directories = []
                const baseFiles = []
                const baseDirectories = []

                const data = fs.readdirSync(source, { withFileTypes: true }).map((dirent) => dirent.name)
                const dataBase = fs.readdirSync(baseSource, { withFileTypes: true }).map((dirent) => dirent.name)

                data.forEach((element) => {
                    const stat = fs.statSync(path.join(source, element))
                    if (stat.isDirectory()) {
                        directories.push(element)
                    } else {
                        const objFiles = {
                            relativePath: element,
                        }
                        files.push(objFiles)
                    }
                })

                dataBase.forEach((element) => {
                    const stat = fs.statSync(path.join(baseSource, element))
                    if (stat.isDirectory()) {
                        baseDirectories.push(element)
                    } else {
                        const objFiles = {
                            relativePath: element,
                        }
                        baseFiles.push(objFiles)
                    }
                })

                return res.status(200).json({
                    code: 0,
                    files,
                    directories,
                    baseDirectories,
                    baseFiles,
                })
            }
        }

        return res.status(500).json({
            code: 1,
        })
    } catch (error) {
        return res.status(500).json({
            code: 1,
        })
    }
})

/**
 * Lấy lịch sử cập nhật của một drawing
 */
manageDrawingsRouter.post('/get-drawing-history', async (req, res) => {
    try {
        const { data } = req.body
        const { drawing_id } = data

        const query = `
            SELECT t_d_h.*, t_d_h.drawing_history_created_at as drawing_updated_at, t_u.user_fullname as drawing_updated_by_full_name, t_d_h.drawing_history_created_by as drawing_updated_by
            FROM tbl_drawings_history t_d_h
            LEFT JOIN tbl_users t_u ON t_u.user_id = t_d_h.drawing_history_created_by
            WHERE t_d_h.drawing_id = ${drawing_id};
        `

        const result = await db.postgre.run(query).catch(() => null)

        if (result) {
            const { rows } = result
            return res.status(200).json({
                code: 0,
                data: {
                    returnedData: rows,
                },
            })
        }

        return res.status(500).json({
            code: 1,
        })
    } catch (error) {
        return res.status(500).json({
            code: 1,
        })
    }
})

module.exports = manageDrawingsRouter
