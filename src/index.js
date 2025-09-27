const { Client } = require('pg');

exports.handler = async (event, context) => {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    
    try {
        const response = await fetch(`${process.env.CRIPTOYA_API_BASE_URL}/dolar`);
        const fxRates = await response.json();
        
        await client.connect();
        
        const today = new Date().toISOString().split('T')[0];
        const timestamp = Date.now();
        
        // Insert MEP AL30
        if (fxRates.mep?.al30?.ci) {
            const { ask, bid } = fxRates.mep.al30.ci;
            await client.query(
                'INSERT INTO fx_rate (id, name, currency, ask, bid, date) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO UPDATE SET ask = $4, bid = $5, updated_at = NOW()',
                [`mep_al30_${today}`, 'MEP AL30', 'USD', ask, bid, today]
            );
        }
        
        // Insert USDT
        if (fxRates.cripto?.usdt) {
            const { ask, bid } = fxRates.cripto.usdt;
            await client.query(
                'INSERT INTO fx_rate (id, name, currency, ask, bid, date) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO UPDATE SET ask = $4, bid = $5, updated_at = NOW()',
                [`usdt_${today}`, 'USDT', 'USD', ask, bid, today]
            );
        }
        
        await client.end();
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'FX rates inserted successfully'
            })
        };
    } catch (error) {
        console.error('Error:', error.message);
        await client.end();
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error.message
            })
        };
    }
};