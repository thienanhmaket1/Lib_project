const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const db = require('../../../../services/db')

const manageSettingsRouter = express.Router()
const uploadPath = path.join(__dirname, '../../../../uploads/')
const commonService = require('../../../../services/common')

const upload = multer({
    dest: uploadPath,
})

manageSettingsRouter.post('/save-path', async (req, res) => {
    try {
        const { user, officePath, qcPath } = req.body
        const arrCells = [officePath, qcPath, user]
        const query = `
            UPDATE tbl_settings
            SET office_path_value = $1,
                qc_path_value = $2,
                updated_by = $3,
                updated_date = now()
            RETURNING *
        `
        const result = await db.postgre.runWithPrepare(query, arrCells).catch(() => {
            return null
        })
        if (result) {
            const { rows } = result
            if (rows.length !== 0) {
                return res.status(200).json({
                    code: 0,
                })
            }
        }

        return res.status(500).json({
            code: 3,
        })
    } catch (error) {
        return res.status(500).json({
            code: 1,
        })
    }
})

manageSettingsRouter.post('/get-drop-down', async (req, res) => {
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

manageSettingsRouter.post('/create-drop-down', async (req, res) => {
    try {
        const { drop_down_data, folder_id, drop_down_name, user_id } = req.body
        const arrCells = [JSON.stringify(drop_down_data), folder_id, drop_down_name, user_id]
        const query = `
            INSERT INTO tbl_drop_down(drop_down_data, folder_id, drop_down_name, drop_down_created_at, drop_down_created_by)
            VALUES($1, $2, $3, now(), $4)
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

manageSettingsRouter.post('/edit-drop-down', async (req, res) => {
    try {
        const { user_id } = req.user
        const { drop_down_data, folder_id, drop_down_name, drop_down_id } = req.body
        const arrCells = [JSON.stringify(drop_down_data), folder_id, drop_down_name, user_id, drop_down_id]
        const query = `
            UPDATE tbl_drop_down
            SET drop_down_data = $1,
            folder_id = $2,
            drop_down_name = $3,
            drop_down_updated_at = now(),
            drop_down_updated_by = $4
            WHERE drop_down_id = $5
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

manageSettingsRouter.post('/delete-drop-down', async (req, res) => {
    try {
        const { drop_down_id, status } = req.body
        const arrCells = [drop_down_id, !status, req.user.user_id]
        const query = `
            UPDATE tbl_drop_down
            SET drop_down_is_deleted = $2,
                drop_down_updated_at = now(),
                drop_down_updated_by = $3
            WHERE drop_down_id = $1
        `
        const result = await db.postgre.runWithPrepare(query, arrCells).catch((err) => {
            console.log(err)
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

manageSettingsRouter.post('/save-common-settings', upload.array('file'), async (req, res) => {
    try {
        const { files } = req
        const { logo_title } = JSON.parse(req.body.data)

        const logoPath = `public/images/logo`
        const logoName = `logo`
        let extNameLogo = null
        const manualPath = `resources/manual`
        const manualName = `D-CUBE Manual`
        const query = `
            UPDATE tbl_settings
            SET logo_title = $1
        `
        const arrCells = [logo_title]

        const result = await db.postgre.runWithPrepare(query, arrCells).catch(() => {
            return null
        })
        if (result) {
            const { rowCount } = result
            if (rowCount === 0) {
                return res.status(500).json({
                    code: 1,
                })
            }
            if (!fs.existsSync(logoPath)) {
                fs.mkdirSync(logoPath, { recursive: true })
            }

            if (files) {
                files.forEach((element) => {
                    if (element.mimetype.includes('image')) {
                        const newFile = path.join(logoPath, `${logoName}${path.extname(element.originalname)}`)
                        if (fs.existsSync(newFile)) {
                            const backupPath = `${logoPath}/backup`
                            fs.mkdirSync(backupPath, { recursive: true })
                            const fileReplacement = `${logoName}_${commonService.dateFormatYYYYMMDDHHMMSS()}${path.extname(element.originalname)}`
                            fs.renameSync(newFile, `${backupPath}/${fileReplacement}`)
                        }
                        fs.renameSync(element.path, newFile)
                        extNameLogo = path.extname(element.originalname)
                    } else {
                        const newFile = path.join(manualPath, `${manualName}${path.extname(element.originalname)}`)
                        if (fs.existsSync(newFile)) {
                            const backupPath = `${manualPath}/backup`
                            fs.mkdirSync(backupPath, { recursive: true })
                            const fileReplacement = `${manualName}_${commonService.dateFormatYYYYMMDDHHMMSS()}${path.extname(element.originalname)}`
                            fs.renameSync(newFile, `${backupPath}/${fileReplacement}`)
                        }
                        fs.renameSync(element.path, newFile)
                    }
                })
            }
            return res.status(200).json({
                code: 0,
                file: extNameLogo,
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

module.exports = manageSettingsRouter
