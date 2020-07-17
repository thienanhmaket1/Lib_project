const express = require('express')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const db = require('../../../../services/db')
const environment = require('../../../../environments/index')
const commonService = require('../../../../services/common')

const manageSettingsRouter = express.Router()

const diskStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const query = `
            SELECT * FROM tbl_settings LIMIT 1;
        `
        const result = await db.postgre.run(query).catch(() => {})
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

const upload = multer({
    dest: 'uploads/',
})

const uploadFile = multer({ storage: diskStorage }).array('file')

manageSettingsRouter.post('/update-temp-path', async (req, res) => {
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

manageSettingsRouter.post('/copy-file', (req, res) => {
    uploadFile(req, res, (error) => {
        if (error) {
            return res.status(500).json({ code: 1 })
            // .send(`Error when trying to upload: ${error}`)
        }
        return res.status(200).json({ code: 0 })
        // .send(req.file)
    })
})

manageSettingsRouter.post('/get-office-file/:filename', async (req, res) => {
    try {
        const query = `
            SELECT * FROM tbl_settings LIMIT 1;
        `

        const result = await db.postgre.run(query).catch(() => {
            return null
        })

        if (result) {
            const { rows } = result
            const filePath = rows[0].office_path_value || `${environment.assetPath}/office`
            return res.sendFile(path.join(filePath, req.params.filename))
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

manageSettingsRouter.post('/upload-file-office', upload.single('file'), async (req, res) => {
    try {
        const { relativePath, bkFolderName, fileName } = JSON.parse(req.body.data)
        const query = `
            SELECT *
            FROM tbl_settings
            LIMIT 1;
        `
        const result = await db.postgre.run(query).catch(() => null)

        if (result) {
            const { rows } = result
            if (rows.length !== 0) {
                const { office_path_value } = rows[0]
                if (!office_path_value) {
                    return res.status(500).json({
                        code: 2,
                    })
                }
                const tempPath = `${office_path_value}/${relativePath}`
                const fullPath = `${tempPath}/${fileName}`
                if (!fs.existsSync(tempPath)) {
                    fs.mkdirSync(tempPath, { recursive: true })
                }
                if (fs.existsSync(fullPath)) {
                    const newPath = `${tempPath}/${bkFolderName}`
                    // const date = `${new Date().getFullYear()}${new Date().getMonth() + 1}${new Date().getDate()}${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}`
                    const newFileName = `${fileName.split(path.extname(fileName))[0]}_${commonService.dateFormatYYYYMMDDHHMMSS()}${path.extname(fileName)}`
                    fs.mkdirSync(newPath, { recursive: true })
                    fs.renameSync(fullPath, `${newPath}/${newFileName}`)
                }

                const temp = path.join(__dirname, `../../../uploads/${req.file.filename}`)
                fs.renameSync(temp, fullPath)

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
            code: 1,
        })
    }
})

module.exports = manageSettingsRouter
