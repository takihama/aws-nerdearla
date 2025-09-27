const { Client } = require('pg');

exports.handler = async (event, context) => {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    
    try {
        await client.connect();
        
        const result = await client.query(
            'SELECT id, name, currency, ask, bid, date, updated_at FROM fx_rate ORDER BY updated_at DESC'
        );
        
        await client.end();
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                rates: result.rows
            })
        };
    } catch (error) {
        console.error('Error:', error.message);
        await client.end();
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: error.message
            })
        };
    }
};