const express = require('express')
const db = require('../../../../services/db')
const fileService = require('../../../../services/file')

const manageFilesRouter = express.Router()

manageFilesRouter.post('/get-files/:group', async (req, res) => {
    try {
        const { group } = req.params
        const query = `
            SELECT f.file_id
                , file_created_at
                , file_updated_at
                , file_updated_by
                , file_is_deleted
                , f.folder_id
                , file_rule_id
                , file_file_name
                , file_properties
                , file_authorized_users
                , u.user_fullname as file_created_by
                , tfh.file_updated_count
                , file_department_id
                , fo.folder_name
            FROM tbl_files f
            LEFT JOIN (
                    SELECT COUNT(file_id) as file_updated_count, file_id
                    FROM tbl_files_history
                    GROUP BY file_id
                ) tfh ON tfh.file_id = f.file_id
            LEFT JOIN tbl_users u ON u.user_id = f.file_created_by
            LEFT JOIN tbl_folders fo ON fo.folder_id = f.folder_id
            WHERE file_group = $1
            ORDER BY file_id
        `

        const result = await db.postgre.runWithPrepare(query, [group]).catch(() => {
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
                    tasks.push(fileService.checkExistFile(settings, e, 'office'))
                })
                newRows = await Promise.all(
                    tasks.map((e) =>
                        e.catch((error1) => {
                            console.log(error1)
                        })
                    )
                )
            }
            newRows.forEach((element) => {
                console.log(element.file_file_name)
            })
            return res.status(200).json({
                code: 0,
                files: newRows,
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

manageFilesRouter.post('/get-specific-files', async (req, res) => {
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

manageFilesRouter.post('/get-files-by-folder-id', async (req, res) => {
    try {
        const { folder_id } = req.body
        const query = `
            SELECT file_id,
                file_created_at,
                file_updated_at,
                file_updated_by,
                file_is_deleted,
                f.folder_id,
                file_rule_id,
                file_file_name,
                file_properties,
                file_authorized_users,
                u.user_fullname as file_created_by
            FROM tbl_files f
            LEFT JOIN tbl_users u ON u.user_id = f.file_created_by
            WHERE f.folder_id = $1
        `

        const result = await db.postgre.runWithPrepare(query, [folder_id]).catch(() => {
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

manageFilesRouter.post('/create-file', async (req, res) => {
    try {
        const { file_created_by, folder_id, file_properties, file_file_name, file_authorized_users, file_rule_id, file_department_id } = req.body
        const tasks = []
        const file_group = 'office'
        let arrCells = []
        let query = ``
        const listFileNameFromInput = []
        const listOfExistsingFile = []

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

        if (listOfExistsingFile.length === 0) {
            arrCells = [
                file_created_by,
                folder_id,
                JSON.stringify(file_properties),
                JSON.stringify(file_file_name),
                file_authorized_users,
                file_group,
                file_rule_id,
                Number(file_department_id),
            ]
            query = `
                    INSERT INTO tbl_files(file_created_by
                        , file_created_at
                        , folder_id
                        , file_properties
                        , file_file_name
                        , file_authorized_users
                        , file_group
                        , file_rule_id
                        , file_department_id)
                    VALUES($1, now(), $2, $3, $4, $5, $6, $7, $8)
                    RETURNING file_id;
                    `

            const result = await db.postgre.runWithPrepare(query, arrCells).catch((err) => {
                console.log(err)
                return err
            })
            if (result.rows) {
                const { rows } = result
                if (rows.length !== 0) {
                    return res.status(200).json({
                        code: 0,
                        data: rows[0],
                    })
                }
            }

            if (result.name === 'error') {
                return res.status(200).json({
                    code: 1,
                    detail: result.detail,
                })
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

manageFilesRouter.post('/update-file', async (req, res) => {
    try {
        // const { user_id } = req.user
        const {
            file_id,
            file_updated_by,
            file_properties,
            file_file_name,
            file_authorized_users,
            file_rule_id,
            folder_id,
            file_changed,
            file_department_id,
        } = req.body
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
            const resultToHistory = await db.postgre.runWithPrepare(queryInsertHistory, arrCellsToHistory).catch((err) => {
                return null
            })
            if (resultToHistory) {
                if (resultToHistory.rowCount !== 0) {
                    arrCells = [
                        file_updated_by,
                        JSON.stringify(file_properties),
                        JSON.stringify(file_file_name),
                        file_authorized_users,
                        file_rule_id,
                        file_id,
                        Number(file_department_id),
                    ]
                    const query = `
                        UPDATE tbl_files
                        SET file_updated_by = $1
                            , file_updated_at = now()
                            , file_properties = $2
                            , file_file_name = $3
                            , file_authorized_users = $4
                            , file_rule_id = $5
                            , file_department_id = $7
                        WHERE file_id = $6
                        --RETURNING *;
                    `
                    const result = await db.postgre.runWithPrepare(query, arrCells).catch((err) => {
                        console.log(err)
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

manageFilesRouter.post('/delete-file', async (req, res) => {
    try {
        const { file_id, status, file_file_name } = req.body
        const arrCells = [file_id, !status, JSON.stringify(file_file_name)]
        const query = `
            UPDATE tbl_files
            SET file_is_deleted = $2, file_file_name = $3
            WHERE file_id = $1;
        `
        const result = await db.postgre.runWithPrepare(query, arrCells).catch((err) => {
            console.log(err)
            return null
        })
        if (result) {
            const { rowCount } = result
            if (rowCount !== 0) {
                return res.status(200).json({
                    code: 0,
                })
            }
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

manageFilesRouter.post('/create-file-qc', async (req, res) => {
    try {
        const { file_created_by, folder_id, file_properties, file_file_name, file_authorized_users } = req.body
        const file_group = 'qc'
        let arrCells = []
        let query = ``
        const queryCheckFileExists = `
            SELECT * FROM tbl_files
            WHERE file_file_name = $1
                AND file_group = $2
        `
        const resultCheck = await db.postgre.runWithPrepare(queryCheckFileExists, [file_file_name, file_group]).catch(() => null)

        if (resultCheck) {
            const rowsCheck = resultCheck.rows
            if (rowsCheck.length !== 0) {
                arrCells = [file_created_by, folder_id, JSON.stringify(file_properties), file_authorized_users, rowsCheck[0].file_id]
                query = `
                    UPDATE tbl_files
                    SET file_updated_by = $1,
                        file_updated_at = now(),
                        folder_id = $2,
                        file_properties = $3,
                        file_authorized_users = $4
                    WHERE file_id = $5
                    RETURNING *;
                `
            } else {
                arrCells = [file_created_by, folder_id, JSON.stringify(file_properties), file_file_name, file_authorized_users, file_group]
                query = `
                    INSERT INTO tbl_files( file_created_by, folder_id, file_created_at, file_properties, file_file_name, file_authorized_users, file_group)
                    VALUES($1, $2, now(), $3, $4, $5, $6)
                    RETURNING *;
                `
            }
            const result = await db.postgre.runWithPrepare(query, arrCells).catch(() => null)

            if (result) {
                const { rows } = result
                if (rows.length !== 0) {
                    return res.status(200).json({
                        code: 0,
                    })
                }
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

manageFilesRouter.post('/update-file-qc', async (req, res) => {
    try {
        const { file_updated_by, file_properties, file_file_name, file_authorized_users, file_id } = req.body
        const arrCells = [file_updated_by, JSON.stringify(file_properties), file_file_name, file_authorized_users, file_id]
        const query = `
            UPDATE tbl_files
            SET file_updated_by = $1,
                file_updated_at = now(),
                file_properties = $2,
                file_file_name = $3,
                file_authorized_users = $4
            WHERE file_id = $5
            RETURNING *;
        `

        const result = await db.postgre.runWithPrepare(query, arrCells).catch(() => null)

        if (result) {
            if (result.rowCount !== 0) {
                return res.status(200).json({
                    code: 0,
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

manageFilesRouter.post('/reverse-created-file/:id', async (req, res) => {
    try {
        const { id } = req.params
        const arrCells = [id]
        const query = `
            DELETE FROM tbl_files
            WHERE file_id = $1;
        `
        const result = await db.postgre.runWithPrepare(query, arrCells).catch(() => null)

        if (result) {
            if (result.rowCount !== 0) {
                return res.status(200).json({
                    code: 0,
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

manageFilesRouter.post('/get-file-histories', async (req, res) => {
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

module.exports = manageFilesRouter
