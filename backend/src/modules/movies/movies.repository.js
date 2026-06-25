import { query } from "../../config/db.js";


const findAll = async ({ limit, offset, search }) => {
    let sql = "SELECT * FROM movies";
    const params = [];
    let paramIndex = 1;
    // 1. Build a dynamic WHERE clause based on the search parameter
    if (search) {
        sql += ` WHERE title ILIKE $${paramIndex} OR genre ILIKE $${paramIndex}`;
        params.push(`%${search}%`);
        paramIndex++;
    }
    // 2. Query both the paginated list of movies and the total count
    sql += ` ORDER BY id ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    const result = await query(sql, params);
    // 3. Return { movies, total }
    return result.rows;
};

const countAll = async ({ search }) => {
    let sql = "SELECT COUNT(*)::integer AS total FROM movies";
    const params = [];
    let paramIndex = 1;
    if (search) {
        sql += ` WHERE title ILIKE $${paramIndex} OR genre ILIKE $${paramIndex}`;
        params.push(`%${search}%`);
        paramIndex++;
    }
    const result = await query(sql, params);
    // 3. Return { movies, total }
    return result.rows[0].total;
};


const findById = async (id) => {
    const sql = `SELECT id, title, rating, genre, duration_mins, image FROM movies WHERE id = $1;`;
    const { rows } = await query(sql, [id]);
    return rows[0];
};


export default {
    findAll,
    findById,
    countAll,
};
