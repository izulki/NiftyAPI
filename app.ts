import express from 'express';
import cors from 'cors';
import {pool} from "./utils/db"
import routes from "./routes"
import {config} from "@onflow/config"

const app = express();
app.use(cors())
app.use('/api', routes);
app.listen(3000, function () {
    config().put("accessNode.api", "https://access-mainnet-beta.onflow.org")
    console.log('Example app listening on port 3000!');
});