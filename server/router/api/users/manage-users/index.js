const express = require('express')

const router = express.Router()
const crypto = require('../../../../services/crypto')
const db = require('../../../../services/db')

router.post('/list', (req, res) => {
    const user_username = req.body.user_username || []
    const { showDeletedUser } = req.body
    const query = `
        SELECT user_username
        , user_fullname
        , user_email
        , user_phone
        , user_permission_code
        , user_group
        , user_is_deleted
        , user_theme
        , user_department_id
        FROM tbl_users
        WHERE ${user_username.length > 0 ? `user_username IN (${user_username.join(', ')})` : 'TRUE'}
        ${!showDeletedUser ? `AND user_is_deleted = false` : ``}
        ORDER BY user_salt DESC
    `

    return db.postgre
        .run(query)
        .then((result) => {
            return res.status(200).json({
                code: 0,
                data: result.rowCount > 0 ? result.rows : [],
            })
        })
        .catch((error) => {
            return res.status(500).json({
                code: 1,
                data: [],
                error,
            })
        })
})

router.post('/list-specific-group', (req, res) => {
    const { group } = req.body
    const query = `
        SELECT user_id, user_username, user_fullname as fullname, user_email, user_phone, user_permission_code, user_group
        FROM tbl_users
        WHERE user_group = '${group}'
            AND user_is_deleted = false
    `

    return db.postgre
        .run(query)
        .then((result) => {
            return res.status(200).json({
                code: 0,
                data: result.rowCount > 0 ? result.rows : [],
            })
        })
        .catch((error) => {
            return res.status(500).json({
                code: 1,
                data: [],
                error,
            })
        })
})

router.post('/create-user', async (req, res) => {
    try {
        const { input } = req.body
        const {
            column_username,
            column_password,
            column_fullname,
            column_email,
            column_phone,
            column_permission_code,
            column_group,
            column_theme,
            column_department_id,
        } = input
        const hashed = crypto.hash(column_password)
        const arrCells = [
            column_username.toLowerCase(),
            column_fullname,
            column_email,
            column_phone,
            column_permission_code,
            hashed.split('$')[0],
            hashed.split('$')[1],
            hashed,
            column_group,
            column_theme,
            column_department_id,
        ]
        const query = `
            INSERT INTO tbl_users (
                user_username
                , user_fullname
                , user_email
                , user_phone
                , user_permission_code
                , user_salt
                , user_iteration
                , user_password
                , user_group
                , user_theme
                , user_authen_updated_at
                , user_department_id)
            VAlUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, now(), $11)
            RETURNING *;
        `

        const result = await db.postgre.runWithPrepare(query, arrCells).catch((error) => {
            return error
        })
        if (result.rows) {
            const { rows } = result
            return res.status(201).json({
                code: 0,
                data: rows[0],
            })
        }
        if (result.constraint === 'unique_user_username') {
            return res.status(200).json({
                code: 5,
                data: {},
            })
        }
        // if (result.constraint === 'unique_user_email') {
        //     return res.status(200).json({
        //         code: 6,
        //         data: {},
        //     })
        // }
        return res.status(500).json({
            code: 2,
            data: {},
        })
    } catch (error) {
        return res.status(500).json({
            code: 1,
            data: {},
        })
    }
})

router.post('/delete-user', async (req, res) => {
    try {
        const { user_username, status } = req.body
        const arrCells = [user_username, !status]
        const query = `
            UPDATE tbl_users
            SET user_is_deleted = $2
            WHERE user_username = $1
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

router.post('/edit-user', async (req, res) => {
    try {
        const { input } = req.body
        const {
            column_username,
            column_fullname,
            column_email,
            column_phone,
            column_permission_code,
            column_is_deleted,
            column_group,
            column_theme,
            column_department_id,
        } = input
        let { column_password } = input
        if (column_password === null) column_password = ''
        const hashed = crypto.hash(column_password)
        const arrCells = [
            column_username,
            column_fullname,
            column_email,
            column_phone,
            column_permission_code,
            column_is_deleted,
            column_group,
            column_theme,
            column_department_id,
        ]
        const query = `
            UPDATE tbl_users
            SET
              user_fullname = $2
            , user_email = $3
            , user_phone = $4
            , user_permission_code = $5
            , user_is_deleted = $6
            , user_group = $7
            , user_theme = $8
            , user_department_id = $9
            ${
                column_password.trim() !== ''
                    ? `
            , user_salt = '${hashed.split('$')[0]}'
            , user_iteration = ${hashed.split('$')[1]}
            , user_password = '${hashed}'
            , user_authen_updated_at = now()`
                    : ``
            }
            WHERE user_username = $1
            RETURNING *;
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

        return res.status(500).json({
            code: 1,
        })
    } catch (error) {
        return res.status(500).json({
            code: 2,
        })
    }
})

module.exports = router
