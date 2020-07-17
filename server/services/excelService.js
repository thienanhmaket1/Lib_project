/** From kensyuu project */

const OriginalWorkbook = require('exceljs').Workbook

class SuperWorkbook extends OriginalWorkbook {
    /**
     * @param option The Workbook Option - {Object}
     * @param option.active? Index or Name of Active sheet, default 1
     * @param option.style? Index or Name of Style sheet, default 'style'
     * @param option.col? Column range to copy style
     * @param option.col.s The first column to copy style, default 1
     * @param option.col.e The last column to copy style, default 1
     */
    constructor({
        style = 'style',
        active = 1,
        col = {
            s: 1,
            e: 1,
        },
    }) {
        super()
        this.option = {
            active,
            style,
            col: {
                s: (col && col.s) || 1,
                e: (col && col.e) || 1,
            },
        }
    }

    /**
     * @param {Number} start The first column index to copy style, default 1
     * @param {Number} end The last column index to copy style, default 1
     */
    setCol(start = 1, end = 1) {
        this.col.s = start
        this.col.e = end
    }

    /**
     * @param {Number|String} indexOrName Index or Name of Active sheet
     */
    setActive(indexOrName) {
        this.active = indexOrName
    }

    /**
     * @param {Number|String} indexOrName Index or Name of Style sheet
     */
    setStyle(indexOrName) {
        this.style = indexOrName
    }

    /**
     * Init and return active sheet
     */
    init() {
        this.active_sheet = this.getWorksheet(this.option.active)
        this.style_sheet = this.getWorksheet(this.option.style)
        if (!this.active_sheet) throw 'indexOrName of active sheet does not exist!'
        if (!this.style_sheet) throw 'indexOrName of style sheet does not exist!'
        this.setActive(this.option.active)
        return this.active_sheet
    }

    /**
     * Copy style
     *
     * @param {Number} fromRow Row of source in style sheet
     * @param {Number} toRow Row of detination in active sheet
     * @param {Number} fromCol Optional parameter Index of start column in range, default col.s
     * @param {Number} toCol Optional parameter Index of end column in range, default col.e
     */
    copyStyle(fromRow, toRow, col) {
        if (!this.style_sheet) throw 'Khong tim thay style sheet'
        col = col || this.option.col
        for (let column = col.s; column <= col.e; column++) {
            this.active_sheet.getCell(toRow, column).style = this.style_sheet.getCell(fromRow, column).style
        }
    }
    /**
     *
     * @param {string} styleCellLocation charCol and numRow of cell you wish to copy style located in style sheet
     * @param {Array} startCell [startColumn, startRow] of start cell
     * @param {Array} endCell [endColumn, endRow] of end cell
     */
    copyOneStyleToRectangularZone(styleCellLocation, startCell, endCell) {
        let styleToCopy = this.style_sheet.getCell(styleCellLocation).style
        if (startCell[1] === endCell[1]) endCell[1] += 1
        if ((startCell[0] > endCell[0] && startCell[1] > endCell[1] && true) || false) throw 'Invalid startCell and endCell'
        for (let rowIterator = startCell[1]; rowIterator < endCell[1]; rowIterator++) {
            for (let columnIterator = startCell[0]; columnIterator < endCell[0]; columnIterator++) {
                this.active_sheet.getRow(rowIterator).getCell(columnIterator).style = styleToCopy
            }
        }
    }

    /**
     * getWorksheet
     *
     * @param {Number|String} indexOrName [order index] or [name] of sheet
     */
    getWorksheet(indexOrName) {
        if (typeof indexOrName === 'string') return super.getWorksheet(indexOrName)
        if (Number.isInteger(indexOrName) && indexOrName < this.worksheets.length) return this.worksheets[indexOrName]
        return undefined
    }
}

class Workbook extends OriginalWorkbook {
    /**
     * getWorksheet
     *
     * @param {Number|String} indexOrName [order index] or [name] of sheet
     */
    getWorksheet(indexOrName) {
        if (typeof indexOrName === 'string') return super.getWorksheet(indexOrName)
        if (Number.isInteger(indexOrName) && indexOrName < this.worksheets.length) return this.worksheets[indexOrName]
        return undefined
    }
}
module.exports = {
    Workbook,
    SuperWorkbook,
}
