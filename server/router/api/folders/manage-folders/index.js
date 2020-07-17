const express = require('express')
const db = require('../../../../services/db')

const manageFoldersRouter = express.Router()

manageFoldersRouter.post('/create-higher-folder', async (req, res) => {
    try {
        const { folder_name } = req.body
        const { user_id } = req.user
        const arrCells = [folder_name, user_id]
        const query = `
            INSERT INTO tbl_folders(folder_name,
                folder_created_at,
                folder_created_by)
                VALUES($1, now(), $2)
            RETURNING *;
        `
        const result = await db.postgre.runWithPrepare(query, arrCells).catch((err) => {
            return err
        })

        if (result.rows) {
            const { rows } = result
            if (rows.length !== 0) {
                return res.status(200).json({
                    code: 0,
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
            code: 1,
        })
    } catch (error) {
        return res.status(500).json({
            code: 1,
        })
    }
})

manageFoldersRouter.post('/create-folder', async (req, res) => {
    try {
        const {
            folder_name,
            folder_document_no,
            folder_is_show_updated_count,
            folder_is_show_created_at,
            folder_is_show_updated_at,
            folder_properties,
            folder_created_by,
            folder_authorized_users,
            folder_short_name,
            folder_root_id,
        } = req.body
        const arrCells = [
            folder_name,
            folder_document_no,
            JSON.stringify(folder_properties),
            folder_created_by,
            folder_authorized_users,
            folder_is_show_updated_count,
            folder_is_show_created_at,
            folder_is_show_updated_at,
            folder_short_name,
            folder_root_id,
        ]
        const query = `
            INSERT INTO tbl_folders(folder_name
                , folder_document_no
                , folder_properties
                , folder_created_at
                , folder_created_by
                , folder_authorized_users
                , folder_is_show_updated_count
                , folder_is_show_created_at
                , folder_is_show_updated_at
                , folder_short_name
                , folder_root_id)
                VALUES($1, $2, $3, now(), $4, $5, $6, $7, $8, $9, $10)
            RETURNING *;
        `
        const result = await db.postgre.runWithPrepare(query, arrCells).catch((err) => {
            return err
        })

        if (result.rows) {
            const { rows } = result
            if (rows.length !== 0) {
                return res.status(200).json({
                    code: 0,
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
            code: 1,
        })
    } catch (error) {
        return res.status(500).json({
            code: 1,
        })
    }
})

manageFoldersRouter.post('/update-higher-folder', async (req, res) => {
    try {
        const { folder_id, folder_name } = req.body
        const { user_id } = req.user
        const arrCells = [folder_id, folder_name, user_id]
        const query = `
            UPDATE tbl_folders
            SET folder_name = $2,
                folder_updated_by = $3,
                folder_updated_at = now()
            WHERE folder_id = $1
            RETURNING *;
        `
        const result = await db.postgre.runWithPrepare(query, arrCells).catch((err) => {
            return err
        })

        if (result.rows) {
            const { rows } = result
            if (rows.length !== 0) {
                return res.status(200).json({
                    code: 0,
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
            code: 1,
        })
    } catch (error) {
        return res.status(500).json({
            code: 1,
        })
    }
})

manageFoldersRouter.post('/update-folder', async (req, res) => {
    try {
        const {
            folder_id,
            folder_name,
            folder_short_name,
            folder_document_no,
            folder_is_show_updated_count,
            folder_is_show_created_at,
            folder_is_show_updated_at,
            folder_properties,
            folder_updated_by,
            folder_authorized_users,
        } = req.body
        const arrCells = [
            folder_name,
            folder_document_no,
            JSON.stringify(folder_properties),
            folder_updated_by,
            folder_authorized_users,
            folder_is_show_updated_count,
            folder_is_show_created_at,
            folder_is_show_updated_at,
            folder_short_name,
            folder_id,
        ]
        const query = `
            UPDATE tbl_folders
            SET folder_name = $1,
            folder_document_no = $2,
                folder_properties = $3,
                folder_updated_by = now(),
                folder_created_by = $4,
                folder_authorized_users = $5,
                folder_is_show_updated_count = $6,
                folder_is_show_created_at = $7,
                folder_is_show_updated_at = $8,
                folder_short_name = $9
            WHERE folder_id = $10
            RETURNING *;
        `
        const result = await db.postgre.runWithPrepare(query, arrCells).catch((err) => {
            return err
        })

        if (result.rows) {
            const { rows } = result
            if (rows.length !== 0) {
                return res.status(200).json({
                    code: 0,
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
            code: 1,
        })
    } catch (error) {
        return res.status(500).json({
            code: 1,
        })
    }
})

manageFoldersRouter.post('/delete-folder', async (req, res) => {
    try {
        const { folder_id, status } = req.body
        const arrCells = [folder_id, !status]
        const query = `
            UPDATE tbl_folders
            SET folder_is_deleted = $2
            WHERE folder_id = $1;
        `
        const result = await db.postgre.runWithPrepare(query, arrCells).catch(() => {
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

manageFoldersRouter.post('/get-higher-folders', async (req, res) => {
    try {
        const { show_deactivate } = req.body
        const query = `
            SELECT folder_id
                , folder_name as higher_folder_name
                , folder_created_at
                , u.user_fullname as folder_created_by
                , folder_is_deleted
            FROM public.tbl_folders f
            LEFT JOIN tbl_users u ON u.user_id = f.folder_created_by
            WHERE ${show_deactivate ? 'TRUE' : 'f.folder_is_deleted = false'}
                AND folder_root_id IS NULL
            ORDER BY folder_name
        `
        const result = await db.postgre.run(query).catch((err) => {
            return null
        })

        if (result) {
            const { rows } = result
            return res.status(200).json({
                code: 0,
                data: rows,
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

manageFoldersRouter.post('/get-folders', async (req, res) => {
    try {
        const { folder_root_id, show_deactivate } = req.body
        const query = `
            SELECT f.folder_id
                , f.folder_name
                , f.folder_short_name
                , f.folder_document_no
                , f.folder_properties
                , f.folder_created_at
                , u.user_fullname as folder_created_by
                , f.folder_is_deleted
                , f.folder_authorized_users
                , f.folder_group
                , f.folder_is_show_updated_count
                , f.folder_is_show_created_at
                , f.folder_is_show_updated_at
                , f.folder_root_id
                , f2.folder_name as higher_folder_name
                , fi.file_latest_update
            FROM public.tbl_folders f
            LEFT JOIN tbl_folders f2 ON f2.folder_id = f.folder_root_id
            LEFT JOIN (
                SELECT folder_id, MAX(COALESCE (file_updated_at, file_created_at)) as file_latest_update
                FROM tbl_files
                GROUP BY folder_id) fi ON fi.folder_id = f.folder_id
            LEFT JOIN tbl_users u ON u.user_id = f.folder_created_by
            WHERE ${show_deactivate ? 'TRUE' : 'f.folder_is_deleted = false'}
                AND ${folder_root_id ? `f.folder_root_id = ${folder_root_id}` : 'TRUE'}
            ORDER BY f.folder_name
        `

        const result = await db.postgre.run(query).catch((err) => {
            console.log(err)
            return null
        })

        if (result) {
            const { rows } = result
            if (rows.length === 0) {
                const query2 = `
                SELECT f.folder_id, f.folder_name as higher_folder_name
                FROM tbl_folders f
                WHERE ${show_deactivate ? 'TRUE' : 'f.folder_is_deleted = false'}
                    AND ${folder_root_id ? `f.folder_id = ${folder_root_id}` : 'TRUE'}
                ORDER BY f.folder_name
                `
                const result2 = await db.postgre.run(query2).catch(() => {
                    return null
                })
                if (result2) {
                    return res.status(200).json({
                        code: 0,
                        data: result2.rows,
                    })
                }
            }
            return res.status(200).json({
                code: 0,
                data: rows,
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

manageFoldersRouter.post('/get-child-folders', async (req, res) => {
    try {
        const query = `
            SELECT f.folder_id
                , f.folder_name
            FROM public.tbl_folders f
            WHERE f.folder_is_deleted = false
                AND f.folder_root_id IS NOT NULL
            ORDER BY f.folder_name
        `

        const result = await db.postgre.run(query).catch((err) => {
            console.log(err)
            return null
        })

        if (result) {
            const { rows } = result
            return res.status(200).json({
                code: 0,
                data: rows,
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

manageFoldersRouter.post('/get-folder-detail', async (req, res) => {
    try {
        const { folder_id } = req.body
        const arrCells = [folder_id]
        const query = `
            SELECT f.folder_id
                , f.folder_name
                , f.folder_short_name
                , f.folder_document_no
                , f.folder_properties
                , f.folder_created_at
                , u.user_fullname as folder_created_by
                , f.folder_is_deleted
                , f.folder_authorized_users
                , f.folder_group
                , f.folder_is_show_updated_count
                , f.folder_is_show_created_at
                , f.folder_is_show_updated_at
                , f.folder_root_id
                , f2.folder_name as higher_folder_name
            FROM public.tbl_folders f
            LEFT JOIN tbl_folders f2 ON f2.folder_id = f.folder_root_id
            LEFT JOIN tbl_users u ON u.user_id = f.folder_created_by
            WHERE  f.folder_id = $1
            -- AND f.folder_is_deleted = false

        `

        const result = await db.postgre.runWithPrepare(query, arrCells).catch(() => {
            return null
        })

        if (result) {
            const { rows } = result
            return res.status(200).json({
                code: 0,
                data: rows,
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

module.exports = manageFoldersRouter
