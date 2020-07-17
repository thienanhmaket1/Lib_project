import * as moment from 'moment-timezone'
import { office, qc, dropdownsettings } from './constants'

export const createMiddleFakeColumns = (properties = [], currentLang) => {
    return properties.map((e) => {
        return `column_*_${e.property_name}`
    })
}

export const createMiddleRealColumns = (flagColumnName = '') => {
    return flagColumnName.split('_*_')[1]
}

export const createLeftRealColumns = (flagColumnName) => {
    return office.file.leftRealColumns[office.file.leftFakeColumns.indexOf(flagColumnName)]
}

export const createRightRealColumns = (flagColumnName) => {
    return office.file.rightRealColumns[office.file.rightFakeColumns.indexOf(flagColumnName)]
}

export const createFixedRealColumns = (flagColumnName) => {
    return office.folder.fixedRealColumns[office.folder.fixedFakeColumns.indexOf(flagColumnName)]
}

export const getFixedColumnsWidth = (flagColumnName) => {
    return office.folder.fixedColumnsWidth[office.folder.fixedFakeColumns.indexOf(flagColumnName)]
}

export const createCustomRealColumns = (flagColumnName) => {
    return office.folder.customRealColumns[office.folder.customFakeColumns.indexOf(flagColumnName)]
}

export const getCustomColumnsWidth = (flagColumnName) => {
    return office.folder.fixedColumnsWidth[office.folder.customFakeColumns.indexOf(flagColumnName)]
}

/** QC */

export const createDrawingMiddleFakeColumns = (properties = []) => {
    return properties.map((e) => `column_*_${e.property_name}`)
}

export const createDrawingMiddleRealColumns = (flagColumnName = '') => {
    return qc.drawing.middleRealColumns[qc.drawing.middleFakeColumns.indexOf(flagColumnName)]
}

export const createDrawingLeftRealColumns = (flagColumnName) => {
    return qc.drawing.leftRealColumns[qc.drawing.leftFakeColumns.indexOf(flagColumnName)]
}

export const createDrawingRightRealColumns = (flagColumnName) => {
    return qc.drawing.rightRealColumns[qc.drawing.rightFakeColumns.indexOf(flagColumnName)]
}

/** DROPDOWN */
export const createdDropdownMiddleFakeColumns = (properties = []) => {
    return properties.map((e) => `column_*_${e.property_name}`)
}

export const createDropdownMiddleRealColumns = (flagColumnName = '') => {
    return flagColumnName.split('_*_')[1]
}

export const createDropdownLeftRealColumns = (flagColumnName) => {
    return dropdownsettings.dropdown.leftRealColumns[dropdownsettings.dropdown.leftFakeColumns.indexOf(flagColumnName)]
}

export const createDropdownRightRealColumns = (flagColumnName) => {
    return dropdownsettings.dropdown.rightRealColumns[dropdownsettings.dropdown.rightFakeColumns.indexOf(flagColumnName)]
}

export const dateTimeInString = (date, format = null) => {
    if (moment(date).isValid()) {
        return moment(date).format(format || 'MMMM. DD, YYYY')
    } else {
        return date
    }
}

export const displayIsDeleted = (isDeleted) => {
    const isDeletedInBoolean = /true/i.test(isDeleted)
    return isDeletedInBoolean ? 'Deactivated' : 'Activated'
}

export const convertStringBooleanToBoolean = (booleanInString) => {
    return /true/i.test(booleanInString)
}

export const isValidExtension = (fileName = '', expectedExtensions = []) => {
    const extensions = fileName.split('.')

    return expectedExtensions.includes(extensions[extensions.length - 1])
}
