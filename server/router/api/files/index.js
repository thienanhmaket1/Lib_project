const express = require('express')
const path = require('path')
const fs = require('fs')
const db = require('../../../services/db')
const environment = require('../../../environments/index')
const fileService = require('../../../services/file')

const filesRouter = express.Router()
const manageFilesRouter = require('./manage-files')
const middleWares = require('../../../middlewares')

/** Mở file thuộc Office */
filesRouter.get('/get-office-file/:filename', async (req, res) => {
    try {
        const query = `
            SELECT * FROM tbl_settings LIMIT 1;
        `

        const result = await db.postgre.run(query).catch(() => {
            return null
        })

        if (result) {
            /**
             * Trong tbl_settings có cột office_path_value chứa đường dẫn gốc của thư mục office
             * Cộng đường dẫn từ office_path_value và đường dẫn nhận vào từ client
             * Ta được 1 đường dẫn đầy đủ. Dùng hàm sendFile để mở file dựa trên đường dẫn
             */
            const { rows } = result
            const filePath = rows[0].office_path_value || `${environment.assetPath}/office`
            return res.sendFile(path.join(filePath, req.params.filename))
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

filesRouter.get('/get-qc-file/:filename', async (req, res) => {
    try {
        const query = `
            SELECT * FROM tbl_settings LIMIT 1;
        `

        const result = await db.postgre.run(query).catch(() => {
            return null
        })

        if (result) {
            /**
             * Trong tbl_settings có cột qc_path_value chứa đường dẫn gốc của thư mục qc
             * Cộng đường dẫn từ qc_path_value và đường dẫn nhận vào từ client
             * Ta được 1 đường dẫn đầy đủ. Dùng hàm sendFile để mở file dựa trên đường dẫn
             */
            const { rows } = result
            const filePath = rows[0].qc_path_value || `${environment.assetPath}/qc`

            if (!fs.existsSync(path.join(filePath, req.params.filename))) {
                return res.status(500).json({
                    code: 1,
                })
            }

            return res.sendFile(path.join(filePath, req.params.filename))
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

filesRouter.post('/get-parent-folders-by-file-name', async (req, res) => {
    try {
        const { data } = req.body
        const { filename } = data
        const query = `
            SELECT * FROM tbl_settings LIMIT 1;
        `

        const result = await db.postgre.run(query).catch(() => {
            return null
        })

        if (result) {
            const { rows } = result
            const filePath = rows[0].qc_path_value || `${environment.assetPath}/qc`

            const paths = fileService.recFindFileByFileName(filePath, filename)
            return res.status(200).json({
                code: 0,
                data: {
                    returnedData: paths,
                },
            })
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

filesRouter.get('/download-qc-file/:filename', async (req, res) => {
    try {
        const { filename } = req.params
        const query = `
            SELECT * FROM tbl_settings LIMIT 1;
        `

        const result = await db.postgre.run(query).catch(() => {
            return null
        })

        if (result) {
            const { rows } = result
            const filePath = rows[0].qc_path_value || `${environment.assetPath}/qc`

            if (!fs.existsSync(path.join(filePath, filename))) {
                return res.status(500).json({
                    code: 1,
                })
            }

            return res.download(path.join(filePath, filename))
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

filesRouter.post('/get-files/:group', async (req, res) => {
    try {
        const { group } = req.params
        const query = `
            SELECT f.file_id,
                file_created_at,
                file_updated_at,
                file_updated_by,
                file_is_deleted,
                folder_id,
                file_rule_id,
                file_file_name,
                file_properties,
                file_authorized_users,
                u.user_fullname as file_created_by,
                tfh.file_updated_count
            FROM tbl_files f
            LEFT JOIN (
                    SELECT COUNT(file_id) as file_updated_count, file_id
                    FROM tbl_files_history
                    GROUP BY file_id
                ) tfh ON tfh.file_id = f.file_id
            LEFT JOIN tbl_users u ON u.user_id = f.file_created_by
            WHERE file_group = $1 AND file_is_deleted = FALSE
            ORDER BY file_id
        `

        const result = await db.postgre.runWithPrepare(query, [group]).catch(() => {
            return null
        })

        if (result) {
            const { rows } = result
            return res.status(200).json({
                code: 0,
                files: rows,
            })
        }

        return res.status(500).json({
            code: 1,
        })
    } catch (error) {
        return res.status(500).json({
            code: 2,
        })
    }
})

filesRouter.post('/get-specific-files', async (req, res) => {
    try {
        const { file_id } = req.body
        const query = `
            SELECT file_id,
                file_created_at,
                file_updated_at,
                file_updated_by,
                file_is_deleted,
                folder_id,
                file_rule_id,
                file_file_name,
                file_properties,
                file_authorized_users,
                u.user_fullname as file_created_by
            FROM tbl_files f
            LEFT JOIN tbl_users u ON u.user_id = f.file_created_by
            --WHERE file_is_deleted = false
            AND file_id = $1
        `

        const result = await db.postgre.runWithPrepare(query, [file_id]).catch(() => {
            return null
        })

        if (result) {
            const { rows } = result
            return res.status(200).json({
                code: 0,
                data: rows[0],
            })
        }

        return res.status(500).json({
            code: 1,
        })
    } catch (error) {
        return res.status(500).json({
            code: 2,
        })
    }
})

filesRouter.post('/get-file-histories', async (req, res) => {
    try {
        const { file_id } = req.body
        const query = `
            SELECT t_f_h.*,
            t_f_h.file_updated_at as file_updated_at,
            t_u.user_fullname as file_updated_by_full_name
                FROM tbl_files_history t_f_h
                LEFT JOIN tbl_users t_u ON t_u.user_id = t_f_h.file_history_created_by
                WHERE t_f_h.file_id = ${file_id};
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

filesRouter.post('/update-file-by-authorized-user', async (req, res) => {
    try {
        const { user_id } = req.user
        const { file_id, file_updated_by, file_properties, file_file_name, file_authorized_users, file_rule_id, folder_id, file_changed } = req.body
        if (!file_authorized_users.includes(user_id)) {
            return res.status(401).json({
                code: 1,
            })
        }
        let arrCells = []
        const tasks = []
        const listFileNameFromInput = []
        const listOfExistsingFile = []

        if (file_changed.length !== 0) {
            file_file_name.forEach((element) => {
                if (element.file_name !== '') {
                    listFileNameFromInput.push(element.file_name)
                    const queryCheckFileExists = `
                    SELECT * FROM tbl_files
                    WHERE folder_id = ${folder_id}
                        AND file_file_name::text LIKE '%"${element.file_name}"%'
                        AND file_is_deleted = false;
                    `

                    tasks.push(db.postgre.run(queryCheckFileExists))
                }
            })

            const resultCheck = await Promise.all(
                tasks.map((e) =>
                    e.catch((error1) => {
                        console.log(error1)
                    })
                )
            )
            if (resultCheck) {
                for (let index = 0; index < resultCheck.length; index += 1) {
                    const e = resultCheck[index]
                    if (e.rowCount !== 0) {
                        const { rows } = e
                        if (rows[0].file_id !== file_id) {
                            rows[0].file_file_name.forEach((element) => {
                                if (listOfExistsingFile.indexOf(element.file_name) === -1) {
                                    const fileName = listFileNameFromInput.find((e2) => e2 === element.file_name)
                                    if (fileName) {
                                        listOfExistsingFile.push(fileName)
                                    }
                                }
                            })
                        }
                    }
                }
            }
        }

        if (listOfExistsingFile.length === 0) {
            const arrCellsToHistory = [file_updated_by, file_id]
            const queryInsertHistory = `
            INSERT INTO tbl_files_history (file_id
                , file_created_at
                , file_created_by
                , file_updated_at
                , file_updated_by
                , file_is_deleted
                , folder_id
                , file_properties
                , file_authorized_users
                , file_group
                , file_file_name
                , file_rule_id
                , file_history_created_at
                , file_history_created_by)
               (SELECT file_id
                , file_created_at
                , file_created_by
                , file_updated_at
                , file_updated_by
                , file_is_deleted
                , folder_id
                , file_properties
                , file_authorized_users
                , file_group
                , file_file_name
                , file_rule_id
                , now()
                , $1
                FROM tbl_files WHERE file_id = $2)
                RETURNING *;
            `
            const resultToHistory = await db.postgre.runWithPrepare(queryInsertHistory, arrCellsToHistory).catch(() => {
                return null
            })

            if (resultToHistory) {
                if (resultToHistory.rowCount !== 0) {
                    arrCells = [file_updated_by, JSON.stringify(file_properties), JSON.stringify(file_file_name), file_authorized_users, file_rule_id, file_id]
                    const query = `
                        UPDATE tbl_files
                        SET file_updated_by = $1,
                            file_updated_at = now(),
                            file_properties = $2,
                            file_file_name = $3,
                            file_authorized_users = $4,
                            file_rule_id = $5
                        WHERE file_id = $6
                    `
                    const result = await db.postgre.runWithPrepare(query, arrCells).catch(() => {
                        return null
                    })

                    if (result) {
                        if (result.rowCount !== 0) {
                            return res.status(200).json({
                                code: 0,
                            })
                        }
                    }
                }
            }

            return res.status(500).json({
                code: 2,
            })
        }

        return res.status(500).json({
            code: 3,
            data: listOfExistsingFile,
        })
    } catch (error) {
        return res.status(500).json({
            code: 2,
        })
    }
})

// filesRouter.use('/manage-files', middleWares.permissionsMiddleWare.officeAdminMiddleware, manageFilesRouter)
filesRouter.use('/manage-files', manageFilesRouter)
module.exports = filesRouter
