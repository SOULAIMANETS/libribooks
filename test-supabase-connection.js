import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Client } = require('pg');
require('dotenv').config();

async function test() {
    console.log('Testing IPv6 connection...');

    const client = new Client({
        user: process.env.POSTGRES_USER,
        host: '2a05:d018:135e:1663:2d:3223:451a:597e', // IPv6
        database: process.env.POSTGRES_DATABASE,
        password: process.env.POSTGRES_PASSWORD,
        port: parseInt(process.env.POSTGRES_PORT || '5432'),
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('Connecting...');
        await client.connect();
        console.log('Successfully connected!');
        const res = await client.query('SELECT NOW()');
        console.log('Query result:', res.rows[0]);
        await client.end();
    } catch (err) {
        console.error('Connection error:', err);
    }
}

test();
