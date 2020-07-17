const express = require('express')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const db = require('../../../../services/db')
const environment = require('../../../../environments/index')
const fileService = require('../../../../services/file')

const manageSettingsRouter = express.Router()

const upload = multer({
    dest: 'uploads/',
})

/**
 * Lấy file QC hiển thị trên trình duyệt
 */
manageSettingsRouter.post('/get-qc-file/:filename', async (req, res) => {
    try {
        const query = `
            SELECT * FROM tbl_settings LIMIT 1;
        `

        const result = await db.postgre.run(query).catch(() => {
            return null
        })

        if (result) {
            const { rows } = result
            if (rows.length !== 0) {
                const { qc_path_value } = rows[0]
                if (qc_path_value) {
                    const filePath = rows[0].qc_path_value || `${environment.assetPath}/qc`
                    return res.sendFile(path.join(filePath, req.params.filename))
                }
            }
        }

        return res.status(500).json({
            code: 2,
        })
    } catch (error) {
        return res.status(500).json({
            code: 1,
        })
    }
})

/**
 * Tạo file cho QC
 */
manageSettingsRouter.post('/upload-file-qc', upload.single('file'), async (req, res) => {
    try {
        const { relativePath, bkFolderName, fileName } = JSON.parse(req.body.data)

        const resultUploadFileService = await fileService.uploadFile(relativePath, bkFolderName, fileName, req.file.filename, 'qc')

        if (resultUploadFileService.result) {
            return res.status(200).json({
                code: 0,
                data: {
                    returnedData: fileName,
                },
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

/**
 * Tạo folder/customer
 */
manageSettingsRouter.post('/upload-folder-qc', async (req, res) => {
    try {
        const { data } = req.body
        const { folderName } = data
        const query = `
            SELECT *
            FROM tbl_settings
            LIMIT 1;
        `
        const result = await db.postgre.run(query).catch(() => null)

        if (result) {
            const { rows } = result
            if (rows.length !== 0) {
                const { qc_path_value } = rows[0]
                if (!qc_path_value) {
                    return res.status(500).json({
                        code: 2,
                    })
                }
                const tempPath = `${qc_path_value}/${folderName}`
                if (!fs.existsSync(tempPath)) {
                    fs.mkdirSync(tempPath, { recursive: true })
                } else {
                    const now = new Date()
                    fs.mkdirSync(
                        `${tempPath} ${now.getFullYear()} ${now.getMonth() + 1} ${now.getDate()} ${now.getHours()} ${now.getMinutes()} ${now.getSeconds()}`,
                        { recursive: true }
                    )
                }

                return res.status(200).json({
                    code: 0,
                    data: {
                        returnedData: folderName,
                    },
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

/**
 * Đổi tên folder/customer
 */
manageSettingsRouter.post('/rename-folder-qc', async (req, res) => {
    try {
        const { data } = req.body
        const { oldFolderName, newFolderName } = data
        const query = `
            SELECT *
            FROM tbl_settings
            LIMIT 1;
        `
        const result = await db.postgre.run(query).catch(() => null)

        if (result) {
            const { rows } = result
            if (rows.length !== 0) {
                const { qc_path_value } = rows[0]
                if (!qc_path_value) {
                    return res.status(500).json({
                        code: 2,
                    })
                }
                const oldPath = `${qc_path_value}/${oldFolderName}`

                if (!fs.existsSync(oldPath)) {
                    return res.status(500).json({
                        code: 3,
                    })
                }

                const newPath = `${qc_path_value}/${newFolderName}`

                fs.renameSync(oldPath, newPath)

                const query1 = `
                    UPDATE tbl_drawings
                    SET drawing_relative_path = '${newFolderName}'
                    WHERE drawing_relative_path = '${oldFolderName}';
                `

                const result1 = await db.postgre.run(query1).catch(() => null)

                if (result1) {
                    return res.status(200).json({
                        code: 0,
                        data: {
                            returnedData: newFolderName,
                        },
                    })
                }

                fs.renameSync(newPath, oldPath)

                return res.status(500).json({
                    code: 2,
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

/**
 * Đổi tên folder/customer
 */
manageSettingsRouter.post('/delete-file-qc', async (req, res) => {
    try {
        const { data } = req.body
        const { folderName, fileName } = data
        const query = `
            SELECT *
            FROM tbl_settings
            LIMIT 1;
        `
        const result = await db.postgre.run(query).catch(() => null)

        if (result) {
            const { rows } = result
            if (rows.length !== 0) {
                const { qc_path_value } = rows[0]
                if (!qc_path_value) {
                    return res.status(500).json({
                        code: 2,
                    })
                }
                const oldPath = `${qc_path_value}/${folderName}/${fileName}`

                if (!fs.existsSync(oldPath)) {
                    return res.status(500).json({
                        code: 3,
                    })
                }

                // const newPath = `${qc_path_value}/${newFolderName}`

                // fs.renameSync(oldPath, newPath)
                fs.unlinkSync(oldPath)

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
