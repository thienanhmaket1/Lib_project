const dateFormatYYYYMMDDHHMMSS = () => {
    const now = new Date()
    function pad2(n) {
        // always returns a string
        return (n < 10 ? '0' : '') + n
    }

    return now.getFullYear() + pad2(now.getMonth() + 1) + pad2(now.getDate()) + pad2(now.getHours()) + pad2(now.getMinutes()) + pad2(now.getSeconds())
}

const uuidv4 = () => {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8

        return v.toString(16)
    })
}

module.exports = { dateFormatYYYYMMDDHHMMSS, uuidv4 }
