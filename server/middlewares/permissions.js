const jwt = require('jsonwebtoken')
const db = require('../services/db')

const environment = require('../environments/environment.dev')

const getUser = async (user_id, issuedAt) => {
    const user_query = `
        SELECT *
        FROM tbl_users
        WHERE user_id = '${user_id}'
        AND cast(extract(epoch from user_authen_updated_at) as integer) <= ${issuedAt}
    `

    const result = await db.postgre.run(user_query).catch(() => null)

    if (result) {
        const { rows } = result
        if (rows.length === 1) {
            return rows[0]
        }

        return null
    }

    return null
}

/**
 * Nhận vào authorization trong headers
 * Trong authorization có chứa token
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const authenMiddleware = (req, res, next) => {
    req.user = undefined
    if (!req.headers || !req.headers.authorization) {
        return res.status(401).json({
            err: 'Unauthorized User!',
            code: 7, //
        })
    }

    const token = req.headers.authorization

    /** Hàm verify sẽ dùng privateKey để trích ra thông tin cơ bản của user trong token */
    return jwt.verify(token, environment.privateKey, async (err, decode) => {
        if (err) {
            return res.status(401).json({
                err,
                code: 6,
            })
        }

        const user = {
            user_username: decode.user_username,
            user_id: decode.user_id,
            user_permission_code: '01',
        }

        /** Lấy toàn bộ thông tin user dựa trên user_id */
        const getUserResult = await getUser(user.user_id, decode.iat)
        if (getUserResult) {
            const { user_password, user_salt, user_iteration, ...newUser } = getUserResult
            if (newUser) {
                req.user = newUser
                return next()
            }
        }

        return res.status(401).json({
            err,
            code: 6,
        })
    })
}

const officeAdminMiddleware = (req, res, next) => {
    const { user } = req

    if (!user) {
        return res.status(401).json({
            err: 'Unauthorized User!',
            code: 7,
        })
    }

    const { user_permission_code } = user

    if (user_permission_code !== '09' && user_permission_code !== '99') {
        return res.status(401).json({
            err: 'Unauthorized User!',
            code: 7,
        })
    }

    return next()
}

const qcAdminMiddleware = (req, res, next) => {
    const { user } = req

    if (!user) {
        return res.status(401).json({
            err: 'Unauthorized User!',
            code: 7,
        })
    }

    const { user_permission_code } = user

    if (user_permission_code !== '19' && user_permission_code !== '99') {
        return res.status(401).json({
            err: 'Unauthorized User!',
            code: 7,
        })
    }

    return next()
}

const adminMiddleware = (req, res, next) => {
    const { user } = req

    if (!user) {
        return res.status(401).json({
            err: 'Unauthorized User!',
            code: 7,
        })
    }

    const { user_permission_code } = user

    if (user_permission_code !== '19' && user_permission_code !== '99' && user_permission_code !== '09') {
        return res.status(401).json({
            err: 'Unauthorized User!',
            code: 7,
        })
    }

    return next()
}

const superAdminMiddleWare = (req, res, next) => {
    const { user } = req

    if (!user) {
        return res.status(401).json({
            err: 'Unauthorized User!',
            code: 7,
        })
    }

    const { user_permission_code } = user

    if (user_permission_code !== '99') {
        return res.status(401).json({
            err: 'Unauthorized User!',
            code: 7,
        })
    }

    return next()
}

module.exports = {
    authenMiddleware,
    officeAdminMiddleware,
    qcAdminMiddleware,
    adminMiddleware,
    superAdminMiddleWare,
}
