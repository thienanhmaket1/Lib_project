const express = require('express')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const db = require('../../../services/db')

const settingsRouter = express.Router()

const adminSettingsRouter = require('./admin-settings')
const officeSettingsRouter = require('./office-settings')
const qcSettingsRouter = require('./qc-settings')
const commonService = require('../../../services/common')
const middleWares = require('../../../middlewares')

const diskStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const query = `
            SELECT * FROM tbl_settings LIMIT 1;
        `
        const result = await db.postgre.run(query).catch(() => { })
        const { rows } = result

        // if (!fs.existsSync(rows[0].temp_path)) {
        //     fs.mkdirSync(rows[0].temp_path, { recursive: true })
        // }
        // cb(null, 'uploads')
        cb(null, rows[0].temp_path)
    },
    filename: (req, file, callback) => {
        // const math = ['application/pdf']
        // if (math.indexOf(file.mimetype) === -1) {
        //      const errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`
        //      return callback(errorMess, null)
        // }
        // const name = file.originalname.split(path.extname(file.originalname))[0]
        // const filename = `${name}_${Date.now()}${path.extname(file.originalname)}`
        const filename = file.originalname
        return callback(null, filename)
    },
})

const uploadFile = multer({ storage: diskStorage }).array('file')

settingsRouter.post('/update-temp-path-by-authorized-user', async (req, res) => {
    try {
        const { tempPath, fileNames, bkFolderName } = req.body
        fileNames.forEach((element) => {
            if (element.file_name !== '') {
                const fullPath = `${tempPath}/${element.file_name}`
                if (!fs.existsSync(tempPath)) {
                    fs.mkdirSync(tempPath, { recursive: true })
                }
                if (fs.existsSync(fullPath)) {
                    const newPath = `${tempPath}/${bkFolderName}`
                    // const date = `${new Date().getFullYear()}${new Date().getMonth() + 1}${new Date().getDate()}${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}`
                    const newFileName = `${
                        element.file_name.split(path.extname(element.file_name))[0]
                        }_${commonService.dateFormatYYYYMMDDHHMMSS()}${path.extname(element.file_name)}`
                    fs.mkdirSync(newPath, { recursive: true })
                    fs.renameSync(fullPath, `${newPath}/${newFileName}`)
                }
            }
        })

        const query = `
            UPDATE tbl_settings
            SET temp_path = '${tempPath}'
            RETURNING *;
        `

        const result = await db.postgre.run(query).catch(() => {
            return null
        })

        if (result) {
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

settingsRouter.post('/copy-file-by-authorized-user', (req, res) => {
    uploadFile(req, res, (error) => {
        if (error) {
            return res.status(500).json({ code: 1 })
            // .send(`Error when trying to upload: ${error}`)
        }
        return res.status(200).json({ code: 0 })
        // .send(req.file)
    })
})

settingsRouter.post('/get-settings', async (req, res) => {
    try {
        const query = `
            SELECT * FROM tbl_settings LIMIT 1;
        `

        const result = await db.postgre.run(query).catch(() => {
            return null
        })

        if (result) {
            const { rows } = result
            if (rows.length === 0) {
                const queryInsert = `
                    INSERT INTO public.tbl_settings(theme_color)
                        VALUES ('default')
                    RETURNING *;
                `
                const resultInsert = await db.postgre.run(queryInsert).catch(() => {
                    return null
                })
                if (resultInsert) {
                    return res.status(200).json({
                        code: 0,
                        data: resultInsert.rows,
                    })
                }

                return res.status(500).json({
                    code: 1,
                })
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

settingsRouter.post('/get-drop-down', async (req, res) => {
    try {
        const { folder_id } = req.body
        const query = `
        SELECT drop_down_id,
            folder_id,
            drop_down_name,
            drop_down_data,
            drop_down_created_at,
            drop_down_created_by,
            drop_down_updated_at,
            drop_down_updated_by,
            drop_down_is_deleted
        FROM tbl_drop_down
        WHERE  ${folder_id === 0 ? 'TRUE' : ` folder_id = ${folder_id}`}
            --AND drop_down_is_deleted = false
        `

        const result = await db.postgre.run(query).catch(() => {
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
            code: 2,
        })
    }
})

settingsRouter.post('/get-department', async (req, res) => {
    try {
        const { folder_id } = req.body
        const query = `
        SELECT *
        FROM tbl_drop_down
        WHERE  drop_down_name = 'bumon'
        `

        const result = await db.postgre.run(query).catch(() => {
            return null
        })
        if (result) {
            const { rows } = result
            return res.status(200).json({
                code: 0,
                data: rows[0],
            })
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

settingsRouter.post('/get-department-en', async (req, res) => {
    try {
        const query = `
        SELECT *
        FROM tbl_drop_down
        WHERE  drop_down_name = 'bumon-en'
        `

        const result = await db.postgre.run(query).catch(() => {
            return null
        })
        if (result) {
            const { rows } = result
            return res.status(200).json({
                code: 0,
                data: rows[0],
            })
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

settingsRouter.use('/admin-settings', middleWares.permissionsMiddleWare.superAdminMiddleWare, adminSettingsRouter)
settingsRouter.use('/qc-settings', middleWares.permissionsMiddleWare.officeAdminMiddleware, qcSettingsRouter)
settingsRouter.use('/office-settings', middleWares.permissionsMiddleWare.officeAdminMiddleware, officeSettingsRouter)

module.exports = settingsRouter
