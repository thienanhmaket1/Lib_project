const db = require('./db')

const drawingHistory = async (drawing_id, user_id) => {
    try {
        const query = `
            SELECT *
            FROM tbl_drawings
            WHERE drawing_id = ${drawing_id};
        `

        const result = await db.postgre.run(query).catch(() => ({ result: false }))

        if (result) {
            const { rows } = result
            const drawing = rows[0]
            if (rows.length !== 0) {
                const query1 = `
                    INSERT INTO tbl_drawings_history (
                        ${Object.keys(drawing).join(', ')}
                        , drawing_history_created_by
                    ) VALUES (
                        ${Object.values(rows[0])
                            .map((e) => (e !== null ? `'${e}'` : 'null'))
                            .join(', ')}
                        , '${user_id}'
                    )
                    RETURNING drawing_history_id;
                `

                const result1 = await db.postgre.run(query1).catch(() => null)

                if (result1) {
                    const rowsRollBack = result1.rows
                    return {
                        result: true,
                        rollBack: () => {
                            const rollBackQuery = `
                                DELETE FROM tbl_drawing_history
                                WHERE drawing_history_id = ${rowsRollBack[0]}
                            `

                            db.postgre.run(rollBackQuery).catch(() => null)
                        },
                    }
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

const drawingHistoryCSV = async (csvRow, user_id) => {
    try {
        const query = `
            SELECT *
            FROM tbl_drawings
            WHERE drawing_file_name = '${csvRow.file_name}';
        `

        const result = await db.postgre.run(query).catch(() => ({ result: false }))

        if (result) {
            const { rows } = result
            const drawing = rows[0]
            if (rows.length !== 0) {
                const query1 = `
                    INSERT INTO tbl_drawings_history (
                        ${Object.keys(drawing).join(', ')}
                        , drawing_history_created_by
                    ) VALUES (
                        ${Object.values(rows[0])
                            .map((e) => (e !== null ? `'${e}'` : 'null'))
                            .join(', ')}
                        , '${user_id}'
                    )
                    RETURNING *;
                `

                const result1 = await db.postgre.run(query1).catch(() => null)

                if (result1) {
                    const rowsRollBack = result1.rows
                    return {
                        result: 1,
                        data: csvRow,
                        rollBack: () => {
                            const rollBackQuery = `
                                DELETE FROM tbl_drawing_history
                                WHERE drawing_history_id = ${rowsRollBack[0]}
                            `

                            db.postgre.run(rollBackQuery).catch(() => null)
                        },
                    }
                }
            }

            return {
                result: 2,
                data: csvRow,
            }
        }

        return {
            result: 0,
            data: csvRow,
        }
    } catch (error) {
        return {
            result: 0,
            data: csvRow,
        }
    }
}

module.exports = {
    drawingHistory,
    drawingHistoryCSV,
}
