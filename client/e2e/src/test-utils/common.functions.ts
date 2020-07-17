import { Injectable } from '@angular/core'
// import { HttpClient } from 'protractor-http-client'
import { browser } from 'protractor'

const fs = require('fs')
const md5 = require('md5')
const Path = require('path');

@Injectable()
export class CommonFuncs {
    private api = browser.params.serverUrl
    private evidenceNameFolder = 'e2e\\evidence'
    // private http: HttpClient

    constructor() {
        // this.http = new HttpClient(this.api)
        if (fs.existsSync(this.evidenceNameFolder)) {
        } else {
            fs.mkdirSync(this.evidenceNameFolder)
        }
    }

    getRootEvidenceFolderName() {
        return this.evidenceNameFolder
    }

    initEvidenceFolder(folderName) {
        this.rmDir(folderName)
        fs.mkdirSync(folderName)
    }

    writeScreenShot(data, filename) {
        const stream = fs.createWriteStream(filename)
        stream.write(Buffer.from(data, 'base64'))
        stream.end()
    }

    getJsonDataFromJsonBodyOfResponsePromise(jsonBody) {
        return new Promise((resolve, reject) => {
            const result = Promise.resolve(jsonBody)
            result
                .then((value) => {
                    resolve(value)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }

    waitForASec() {
        browser.sleep(1000)
    }

    rmDir(dirPath) {
        try {
            const files = fs.readdirSync(dirPath)
            if (files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    const filePath = dirPath + '/' + files[i]
                    if (fs.statSync(filePath).isFile()) {
                        fs.unlinkSync(filePath)
                    } else {
                        this.rmDir(filePath)
                    }
                }
            }
            fs.rmdirSync(dirPath)
        } catch (e) {
            return
        }
    }

    /**
     *
     *
     * @param { string } rawPass - the password to be hashed
     * @param { object } [options={}] - object containing salt and rounds
     * @returns {string}
     */
    hash(rawPassword, options = { salt: '', rounds: '' }) {
        /**
         * salt is optional, if not provided it will be set to current timestamp
         */
        const salt = options.salt !== '' ? options.salt : new Date().getTime()

        /**
         * rounds is optional, if not provided it will be set to 10
         */
        const rounds = options.rounds !== '' ? options.rounds : 10

        let hashed = md5(rawPassword + salt)
        for (let i = 0; i <= rounds; i++) {
            hashed = md5(hashed)
        }
        return `${salt}$${rounds}$${hashed}`
    }
    /**
     *
     *
     * @param {string} rawPassword - the raw password
     * @param { string } hashedPassword - the hashed password
     * @returns
     */
    compare(rawPassword, hashedPassword) {
        try {
            const [salt, rounds] = hashedPassword.split('$')
            const hashedRawPassword = this.hash(rawPassword, { salt, rounds })
            return hashedPassword === hashedRawPassword
        } catch (error) {
            throw Error(error.message)
        }
    }
}
