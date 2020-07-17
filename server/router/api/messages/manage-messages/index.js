const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const db = require('../../../../services/db')

const manageMessagesRouter = express.Router()

const uploadPath = path.join(__dirname, '../../../../uploads/')
const commonService = require('../../../../services/common')

const upload = multer({
    dest: uploadPath,
})

manageMessagesRouter.post('/create-message', upload.single('file'), async (req, res) => {
    try {
        const { file, user } = req
        const { message_content, message_group, message_title, message_attachment } = JSON.parse(req.body.data)
        const attachmentPath = path.join(__dirname, `../../../../resources/attachments/${message_group}/`)
        if (!fs.existsSync(attachmentPath)) {
            fs.mkdirSync(attachmentPath, { recursive: true })
        }
        const arrCells = [message_content, user.user_id, message_group, message_title, message_attachment]
        const query = `
            INSERT INTO tbl_messages(message_content, created_at, created_by, message_group, message_title, message_attachment_name)
            VALUES($1, now(), $2, $3, $4, $5)
            RETURNING *;
        `
        // Sau này nên sử dụng hàm runWithPrepare(string, array) này, để tránh SQL Injection
        const result = await db.postgre.runWithPrepare(query, arrCells).catch((err) => {
            console.log(err)
            return null
        })

        if (result) {
            if (file) {
                fs.renameSync(file.path, path.join(attachmentPath, file.originalname))
            }
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

manageMessagesRouter.post('/update-message', upload.single('file'), async (req, res) => {
    try {
        const { file, user } = req
        const { message_id, message_content, message_group, message_title, message_attachment, old_attachment } = JSON.parse(req.body.data)
        const attachmentPath = path.join(__dirname, `../../../../resources/attachments/${message_group}`)
        const attachmentBackupPath = path.join(__dirname, `../../../../resources/attachments/backup`)
        if (!fs.existsSync(attachmentPath)) {
            fs.mkdirSync(attachmentPath, { recursive: true })
        }
        const arrCells = [message_content, message_group, user.user_id, message_title, message_id, message_attachment]
        const query = `
            UPDATE tbl_messages
            SET message_content = $1,
                message_group = $2,
                updated_by = $3,
                updated_at = now(),
                message_title = $4,
                message_attachment_name = $6
            WHERE message_id = $5
        `
        const result = await db.postgre.runWithPrepare(query, arrCells).catch((err) => {
            console.log(err)
            return null
        })

        if (result) {
            if (file) {
                if (old_attachment) {
                    if (!fs.existsSync(attachmentBackupPath)) {
                        fs.mkdirSync(attachmentBackupPath, { recursive: true })
                    }
                    const newFileName = `${old_attachment.split(path.extname(old_attachment))[0]}_${commonService.dateFormatYYYYMMDDHHMMSS()}${path.extname(
                        old_attachment
                    )}`
                    fs.renameSync(path.join(attachmentPath, old_attachment), path.join(attachmentBackupPath, newFileName))
                }
                fs.renameSync(file.path, path.join(attachmentPath, file.originalname))
            }
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

module.exports = manageMessagesRouter
