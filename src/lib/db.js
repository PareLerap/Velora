import { Pool } from "pg";

const pool = new Pool({
    host: "localhost",
    port: 5432,
    database: "velora_db",
    user: "postgres",
    password: "makanenak",
});

export default pool;