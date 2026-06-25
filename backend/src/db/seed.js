import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new pg.Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const moviesToSeed = [
    {
        id: 1,
        title: 'Dune: Part Two',
        rating: '4.9',
        genre: 'Sci-Fi/Action',
        duration_mins: 166,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVqX6733YMhMr5rCwF3Ak12nTTYuXPC4NHALyRdWzM2Mhoa4THSDe0LD1h1VBp3AX_C2-n0ao5VxGviwBKexDb0JrFJZ0TfUFwwB0_Dub-Os56rM-cftrWcMbyyKn-h05OpEQpxQ6CyJqcvTslIfIi5xLP1tkWT1futE9PSjIIrs9ycD3pgEuzrNAmJ47AX_s5etJtunmqf46FN3Xz3bpP9N0j27NgWIT-PqHbToeV_DQ2ZA5f0_IURaN4ELL0Q0EZkgv8BVbGdQ',
    },
    {
        id: 2,
        title: 'Neon Nights',
        rating: '4.5',
        genre: 'Thriller',
        duration_mins: 112,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEHW2G6hgkaS6CduVJV5yNtV0ViPzs-hsodN6jWyYdyZOyPN7nXiG-3fDGhBCFms_vVPxJ-PLvRVbihf9b45fK07dZHqRv3fJDz1c1gFhKA1271SUUC8cApS6Y_An24kuWhq6jOyZFXiQHOhV8VjMUNkGDspW1Ez2xMZC1AZkHiNQqhVg8zHcRfHGNwUUaFBWGJ5Q6fpFZvfAs2zTNPRnXDaV7CfcN7kAle1_IOQ6Yj9Rje733yNl6RMKOi8PX6yG5dP7bgLBzIQ',
    },
    {
        id: 3,
        title: 'Kingdom of Clouds',
        rating: '4.7',
        genre: 'Fantasy',
        duration_mins: 145,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd5_692HwzRdLycQai0sDFyCH8aHyDm9sbN08fVW_1u3BsBemnUBqtp00JeYE75a_c09_mM-wk3ZbB0EXDHP2lTU5gsolF96ibRXFuVYQCj7TBWDx2s65ud1W8go3Lq5cOysNeBCm2cw8AqWmWV-0VGn-ZPfVHqFnRJVzb5nGD6d1T6vL2tiPM4J7Az91l07GOZu10iQsXUS4dlKlWd8CFFHsHKde1b8XCdkSinAv38x68ocm2H4rew8aWIruWMsfoC3PeBKBITw',
    },
    {
        id: 4,
        title: 'Shards of Memory',
        rating: '4.2',
        genre: 'Drama',
        duration_mins: 98,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACVS9UZ1KQMHGvM-1eoN7U9Gh1UVAy9BisQ2M08CJEfGD8vvhuuqDvLC3FICmAqsRo4X8Lj4b7jbfAYLkC7V1BSexGlXXVkZMrWNP2uSM6ewEEWKiHJ6l8gX5jvEgtk5_9Y7xDq6hfCmNaec2QLgA7MufCP-H2y2URA_SD4hG5kdF1DenX4j_MM6lCQaGdv_rJq9jYRNiQkx9LQU4_Li3H8SWJDEFlwSGcfBhWXd2f1BLIhE9J2anvGMcV8T_xmV4fI8m0wEluQw',
    },
];

const seed = async () => {
    try {
        await client.connect();

        // 1. Clear old entries and reset IDs
        await client.query('TRUNCATE TABLE movies RESTART IDENTITY CASCADE');

        // 2. Insert movies
        for (const movie of moviesToSeed) {
            const sql = `
        INSERT INTO movies (title, rating, genre, duration_mins, image)
        VALUES ($1, $2, $3, $4, $5)
        `;
            await client.query(sql, [movie.title, movie.rating, movie.genre, movie.duration_mins, movie.image]);
        }
        console.log('🎉 Seeding completed successfully!');
    } catch (err) {
        console.error('❌ Seeding failed:', err.message);
    } finally {
        await client.end(); // ⬅️ Close connection
    }
};

seed();
