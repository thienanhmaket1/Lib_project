const fs = require('fs')
const path = require('path')
const commonService = require('./common')
const db = require('./db')

const recFindFileByFileName = (base, filename, files, result) => {
    const newFiles = files || fs.readdirSync(base)
    let newResult = result || []

    newFiles.forEach((file) => {
        const newBase = path.join(base, file)
        if (fs.statSync(newBase).isDirectory()) {
            newResult = recFindFileByFileName(newBase, filename, fs.readdirSync(newBase), newResult)
        } else if (file === filename) {
            newResult.push(path.basename(path.dirname(newBase)))
        }
    })

    return newResult
}

const uploadFile = async (relativePath, bkFolderName, originalName, fileName, type = 'office') => {
    try {
        const query = `
            SELECT *
            FROM tbl_settings
            LIMIT 1;
        `
        const result = await db.postgre.run(query).catch(() => null)

        if (result) {
            const { rows } = result
            if (rows.length !== 0) {
                const { qc_path_value, office_path_value } = rows[0]
                if (!qc_path_value || !office_path_value) {
                    return {
                        result: false,
                    }
                }
                const tempPath = `${type === 'qc' ? qc_path_value : office_path_value}/${relativePath}`
                const newPath = path.join(path.dirname(qc_path_value), `garbage_${type}`)
                const fullPath = `${tempPath}/${originalName}`
                if (!fs.existsSync(tempPath)) {
                    fs.mkdirSync(tempPath, { recursive: true })
                }
                if (fs.existsSync(fullPath)) {
                    const newFileName = `${
                        originalName.split(path.extname(originalName))[0]
                    }_${relativePath}_${commonService.dateFormatYYYYMMDDHHMMSS()}${path.extname(originalName)}`
                    fs.mkdirSync(newPath, { recursive: true })
                    fs.renameSync(fullPath, `${newPath}/${newFileName}`)
                }

                const temp = `uploads/${fileName}`
                fs.renameSync(temp, fullPath)

                return {
                    result: true,
                    rollBack: () => {
                        fs.unlinkSync(fullPath)
                    },
                }
            }
        }

        return {
            result: false,
        }
    } catch (error) {
        return {
            result: false,
        }
    }
}

const deleteFile = async (relativePath, originalName, type = 'office') => {
    try {
        const query = `
            SELECT *
            FROM tbl_settings
            LIMIT 1;
        `
        const result = await db.postgre.run(query).catch(() => null)

        if (result) {
            const { rows } = result
            if (rows.length !== 0) {
                const { qc_path_value, office_path_value } = rows[0]
                if (!qc_path_value || !office_path_value) {
                    return {
                        result: false,
                    }
                }
                const tempPath = `${type === 'qc' ? qc_path_value : office_path_value}/${relativePath}`
                const newPath = path.join(path.dirname(qc_path_value), `delete_${type}`)
                const fullPath = `${tempPath}/${originalName}`
                if (!fs.existsSync(tempPath)) {
                    fs.mkdirSync(tempPath, { recursive: true })
                }

                const newFileName = `${
                    originalName.split(path.extname(originalName))[0]
                }_${relativePath}_${commonService.dateFormatYYYYMMDDHHMMSS()}${path.extname(originalName)}`
                if (fs.existsSync(fullPath)) {
                    fs.mkdirSync(newPath, { recursive: true })
                    fs.renameSync(fullPath, `${newPath}/${newFileName}`)
                }

                // const temp = `uploads/${fileName}`
                // fs.renameSync(temp, fullPath)

                return {
                    result: true,
                    rollBack: () => {
                        fs.renameSync(`${newPath}/${newFileName}`, fullPath)
                        // fs.unlinkSync(fullPath)
                    },
                }
            }
        }

        return {
            result: false,
        }
    } catch (error) {
        return {
            result: false,
        }
    }
}
const checkExistFile = async (settings, drawing, type = 'office') => {
    try {
        const { qc_path_value, office_path_value } = settings
        if (!qc_path_value || !office_path_value) {
            return {
                ...drawing,
                drawing_is_exist_on_hardisk: false,
            }
        }
        const tempPath = `${type === 'qc' ? qc_path_value : office_path_value}/${drawing.drawing_relative_path}`
        if (!fs.existsSync(tempPath)) {
            fs.mkdirSync(tempPath, { recursive: true })
        }
        if (type === 'office') {
            const newArray = drawing.file_file_name.map((e) => {
                const officeFullPath = `${office_path_value}/${drawing.folder_name}/${e.file_name}`
                console.log()
                if (!fs.existsSync(officeFullPath) || e.file_name === '') {
                    return {
                        ...e,
                        drawing_is_exist_on_hardisk: false,
                    }
                }

                return {
                    ...e,
                    drawing_is_exist_on_hardisk: true,
                }
            })
            const newObj = {
                ...drawing,
            }

            newObj.file_file_name = newArray
            console.log(newObj)
            return {
                ...newObj,
            }
        }

        const fullPath = `${tempPath}/${drawing.drawing_file_name}.pdf`

        if (!fs.existsSync(fullPath)) {
            return {
                ...drawing,
                drawing_is_exist_on_hardisk: false,
            }
        }

        return {
            ...drawing,
            drawing_is_exist_on_hardisk: true,
        }
    } catch (error) {
        return {
            ...drawing,
            drawing_is_exist_on_hardisk: false,
        }
    }
}

module.exports = {
    recFindFileByFileName,
    uploadFile,
    deleteFile,
    checkExistFile,
}
