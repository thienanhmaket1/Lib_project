const express = require('express')
const db = require('../../../../services/db')

const manageFoldersRouter = express.Router()

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
        ]
        const query = `
            INSERT INTO tbl_folders(folder_name,
                folder_document_no,
                folder_properties,
                folder_created_at,
                folder_created_by,
                folder_authorized_users,
                folder_is_show_updated_count,
                folder_is_show_created_at,
                folder_is_show_updated_at,
                folder_short_name)
                VALUES($1, $2, $3, now(), $4, $5, $6, $7, $8, $9)
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
            const { rowsCount } = result
            if (rowsCount !== 0) {
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

manageFoldersRouter.post('/get-folders', async (req, res) => {
    try {
        const { show_deactivate } = req.body
        const query = `
            SELECT folder_id
                , folder_name
                , folder_short_name
                , folder_document_no
                , folder_properties
                , folder_created_at
                , u.user_fullname as folder_created_by
                , folder_is_deleted
                , folder_authorized_users
                , folder_group
                , folder_is_show_updated_count
                , folder_is_show_created_at
                , folder_is_show_updated_at
            FROM public.tbl_folders f
            LEFT JOIN tbl_users u ON u.user_id = f.folder_created_by
            WHERE ${show_deactivate ? 'TRUE' : 'f.folder_is_deleted = false'}
            ORDER BY folder_name
        `

        const result = await db.postgre.run(query).catch(() => {
            return null
        })

        if (result) {
            const { rows } = result
            // if (rows.length !== 0) {
            return res.status(200).json({
                code: 0,
                data: rows,
            })
            // }
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
