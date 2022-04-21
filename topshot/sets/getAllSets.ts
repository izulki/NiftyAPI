import { query } from "express";

var axios = require('axios');
import {pool} from '../../utils/db'

var pgp = require('pg-promise')({
    capSQL: true
});

export default async function allSets(req, res) {
    let queryText = `
        SELECT * FROM "TSSets"
    `
try {
    let dbResponse = await pool.query(queryText)
    res.send(JSON.stringify(dbResponse.rows))
} catch (err) {
    console.log(err)
    }
}
