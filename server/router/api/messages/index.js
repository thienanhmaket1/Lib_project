const express = require('express')
const fs = require('fs')
const path = require('path')

const pg = require('../../../services/db')
const manageMessagesRouter = require('./manage-messages')

const messagesRouter = express.Router()
const middleWares = require('../../../middlewares')

messagesRouter.post('/get-messages/:group', async (req, res) => {
    try {
        const { group } = req.params
        const query = `
            SELECT m.*,
                u.user_fullname as fullname_creator
                , CASE u2.user_fullname
                    WHEN ' ' THEN null
                    ELSE u2.user_fullname
                END fullname_updator
                , u.user_department_id
                , coalesce(u2.user_id, u.user_id) as user_id
            FROM tbl_messages m
            LEFT JOIN tbl_users u ON u.user_id = m.created_by
            LEFT JOIN tbl_users u2 ON u2.user_id = m.updated_by
            WHERE ${group !== 'admin' ? `message_group = '${group}' OR message_group ='admin'` : 'TRUE'}
            ORDER BY created_at DESC;
        `
        const result = await pg.postgre.run(query).catch((err) => {
            console.log(err)
            return null
        })

        if (result) {
            const { rows } = result
            if (rows.length === 0) {
                const query2 = `
                INSERT INTO public.tbl_messages(
                    message_content, created_at, message_group, message_title)
                    VALUES ('Welcome', now(), 'admin', 'Welcome')
                    RETURNING *;
                `
                const result2 = await pg.postgre.run(query2).catch(() => {
                    return null
                })
                if (result2) {
                    if (result2.rows) {
                        return res.status(200).json({
                            code: 0,
                            data: result2.rows || [],
                        })
                    }
                }
            }
            return res.status(200).json({
                code: 0,
                data: rows || [],
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

messagesRouter.post('/download-attachment', (req, res) => {
    try {
        const { filename, group } = req.body
        const attachmentPath = path.join(__dirname, `../../../resources/attachments/${group}/${filename}`)
        if (!fs.existsSync(attachmentPath)) {
            return res.status(500).json({
                code: 1,
            })
        }
        return res.download(attachmentPath)
    } catch (error) {
        return res.status(500).json({
            code: 2,
        })
    }
})

messagesRouter.get('/open-attachment/:filename', async (req, res) => {
    try {
        const { filename } = req.params
        const data = JSON.parse(filename)
        const query = `
            SELECT * FROM tbl_files
            WHERE file_file_name::text LIKE '%"${data.filename}"%';
        `

        const result = await pg.postgre.run(query).catch(() => {
            return null
        })

        if (result) {
            // const { rows } = result
            const filePath = path.join(__dirname, `/../../../resources/attachments/${data.group}`)
            return res.sendFile(path.join(filePath, data.filename))
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

messagesRouter.get('/open-manual', async (req, res) => {
    try {
        // const { rows } = result
        const filePath = path.join(__dirname, `/../../../resources/manual/D-CUBE Manual.pdf`)
        if (!fs.existsSync(filePath)) {
            return res.status(500).json({
                code: 2,
            })
        }
        return res.sendFile(filePath)
    } catch (error) {
        return res.status(500).json({
            code: 1,
        })
    }
})

messagesRouter.use('/manage-messages', middleWares.permissionsMiddleWare.adminMiddleware, manageMessagesRouter)

module.exports = messagesRouter
