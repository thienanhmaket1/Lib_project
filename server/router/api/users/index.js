const express = require('express')
const multer = require('multer')

const usersRouter = express.Router()
const manageUsersRouter = require('./manage-users')
const crypto = require('../../../services/crypto')
const db = require('../../../services/db')

usersRouter.use('/manage-users', manageUsersRouter)

const diskStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
        cb(null, 'public/images/avatars')
    },
    filename: (req, file, callback) => {
        const math = ['image/png', 'image/jpeg']
        if (math.indexOf(file.mimetype) === -1) {
            const errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`
            return callback(errorMess, null)
        }

        const filename = file.originalname
        return callback(null, filename)
    },
})

const uploadImage = multer({ storage: diskStorage }).single('file')

usersRouter.post('/change-picture', (req, res) => {
    uploadImage(req, res, (error) => {
        if (error) {
            return res.status(500).json({ code: 1 })
        }

        return res.status(200).json({ code: 0 })
    })
})

usersRouter.post('/edit-profile', async (req, res) => {
    try {
        const { user_email, user_fullname, user_id, user_phone, user_theme } = req.body
        let { user_password } = req.body
        if (user_password === null) user_password = ''
        const hashed = crypto.hash(user_password)
        const query = `
            UPDATE tbl_users
            SET user_email = $1,
                user_fullname = $2,
                user_phone = $3,
                user_theme = $4
                ${
                    user_password.trim() !== ''
                        ? `
                , user_password = '${hashed}'
                , user_authen_updated_at = now()`
                        : ``
                }
            WHERE user_id = $5
            RETURNING user_username, user_email, user_phone, user_group, user_id, user_is_deleted, user_permission_code, user_theme, user_fullname;
        `
        const arrCells = [user_email, user_fullname, user_phone, user_theme, user_id]
        const result = await db.postgre.runWithPrepare(query, arrCells).catch(() => {
            return null
        })
        if (result !== null) {
            const { rows } = result
            if (rows.length !== 0) {
                return res.status(200).json({
                    code: 0,
                    data: {
                        returnedData: rows,
                    },
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

usersRouter.post('/get-user', async (req, res) => {
    try {
        const { user_id } = req.body
        const query = `
        SELECT user_id
            , user_username
            , user_email
            , user_phone
            , user_theme
            , user_fullname
            , user_is_deleted
            , user_permission_code
            , user_group
        FROM public.tbl_users
        WHERE user_id = $1;
        `
        const arrCells = [user_id]
        const result = await db.postgre.runWithPrepare(query, arrCells).catch(() => {
            return null
        })
        if (result !== null) {
            const { rows } = result
            if (rows.length !== 0) {
                return res.status(200).json({
                    code: 0,
                    data: rows[0],
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

module.exports = usersRouter
