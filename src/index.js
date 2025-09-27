const { Client } = require('pg');
const https = require('https');

exports.handler = async (event, context) => {
    try {
        const response = await fetch(`${process.env.CRIPTOYA_API_BASE_URL}/dolar`);
        const fxRates = await response.json();
        
        console.log('FX Rates:', JSON.stringify(fxRates, null, 2));
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'FX rates fetched successfully',
                data: fxRates
            })
        };
    } catch (error) {
        console.error('Error:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error.message
            })
        };
    }
};