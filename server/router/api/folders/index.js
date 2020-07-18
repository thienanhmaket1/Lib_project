const express = require('express')
const db = require('../../../services/db')

const foldersRouter = express.Router()
const manageFoldersRouter = require('./manage-folders')

const middleWares = require('../../../middlewares')

foldersRouter.post('/get-folders', async (req, res) => {
    try {
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
            WHERE f.folder_is_deleted = false
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

foldersRouter.use('/manage-folders', middleWares.permissionsMiddleWare.officeAdminMiddleware, manageFoldersRouter)

module.exports = foldersRouter
