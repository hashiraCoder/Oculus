import {Client} from pg
import dotenv from dotenv
const client = new Client({
    host:localhost,
    user:postgres,
    port:6359,
    dbname:Oculus,
    password:process.env.db_password
})
client.connect()