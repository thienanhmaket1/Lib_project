const express = require('express')
const jwt = require('jsonwebtoken')
const db = require('../../../services/db')
const crypto = require('../../../services/crypto')
const environment = require('../../../environments')
const permissionsMiddleWare = require('../../../middlewares/permissions')

const authenRouter = express.Router()

authenRouter.post('/login', async (req, res) => {
    try {
        // const { user_username, user_password } = req.body.data.user
        const user_username_param = req.body.user_username
        const user_password_param = req.body.user_password
        const arrCells = [user_username_param.toLowerCase()]
        console.log(arrCells)
        const query = `
            SELECT *
            FROM tbl_users
            WHERE user_username = $1
            AND user_is_deleted = false;
        `

        const result = await db.postgre.runWithPrepare(query, arrCells).catch(() => {
            return null
        })
        if (result) {
            const { rows } = result
            if (rows.length === 1) {
                /** Kiểm tra xem password nhập từ client có giống với password trên database không */
                const compare = rows.length !== 0 ? crypto.compare(user_password_param, rows[0].user_password) : false
                /** Tạo token */
                const token = jwt.sign(
                    { user_username: rows[0].user_username, user_id: rows[0].user_id },
                    environment.privateKey,
                    { algorithm: 'HS256' },
                    { expiresIn: '24h' }
                )
                /** Nếu kết quả kiểm tra là đúng thì trả về client 1 chuỗi json như dưới
                 * Chuỗi JSON bao gồm:
                 * code: 0
                 * data: chứa đầy đủ thông tin user + token
                 */
                if (compare) {
                    const { user_password, user_salt, user_iteration, ...user } = rows[0]
                    return res.status(200).json({
                        code: 0,
                        data: {
                            user,
                            token,
                        },
                    })
                }
                /** Trường hợp user có tồn tại nhưng kết quả kiểm tra password không khớp
                 * Trả về code: 1
                 */
                return res.status(200).json({
                    code: 1,
                    data: {
                        user: rows[0] || {},
                        token,
                    },
                    // user: rows[0] || {},
                })
            }
            /** Trường hợp user bị deactivate hoặc không tồn tại */
            return res.status(401).json({
                code: 1,
            })
        }
        /** Trường hợp câu query bị lỗi */
        return res.status(500).json({
            code: 1,
        })
    } catch (error) {
        return res.status(500).json({
            code: 1,
        })
    }
})

/** Tham khảo hàm authenMiddleware */
authenRouter.post('/verify-token', permissionsMiddleWare.authenMiddleware, async (req, res) => {
    return res.status(200).json({
        code: 0,
        data: {
            user: req.user,
        },
    })
})

module.exports = authenRouter
