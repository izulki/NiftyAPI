import {pool} from '../../utils/db'
export default async function specificSetPlay(req, res) {
    let queryText = `
    SELECT * FROM "TSEditions" as E
    LEFT JOIN "TSEditionMeta" M ON E.id = M.id
    WHERE E.id= '${req.params.id}'
    `
try {
    let dbResponse = await pool.query(queryText)
    res.send(JSON.stringify(dbResponse.rows))
} catch (err) {
    console.log(err)
    }
}
