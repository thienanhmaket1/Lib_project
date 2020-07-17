const express = require('express')
const db = require('../../../services/db')

const foldersRouter = express.Router()
const manageFoldersRouter = require('./manage-folders')

const middleWares = require('../../../middlewares')

foldersRouter.post('/get-folders', async (req, res) => {
    try {
        const { folder_root_id } = req.body
        const arrCell = [folder_root_id]
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
            WHERE f.folder_is_deleted = false
                AND ${folder_root_id ? 'f.folder_root_id = $1' : 'TRUE'}
            ORDER BY f.folder_name
        `

        const result = await db.postgre.runWithPrepare(query, arrCell).catch(() => {
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

foldersRouter.use('/manage-folders', middleWares.permissionsMiddleWare.officeAdminMiddleware, manageFoldersRouter)

module.exports = foldersRouter
