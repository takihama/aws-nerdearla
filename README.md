# aws-nerdearla

AWS Lambda function that fetches FX rates from CriptoYa API and stores them in NeonDB.

## Features
- Fetches USD exchange rates (MEP AL30, USDT) from CriptoYa API
- Stores rates in PostgreSQL database with upsert logic
- Built with AWS SAM for easy deployment

## Setup

1. Install dependencies:
```bash
cd src && npm install
```

2. Create local environment file:
```bash
cp env.json.example env.json
# Edit env.json with your database URL
```

3. Deploy:
```bash
sam build
sam deploy --guided --parameter-overrides DatabaseUrl="your-db-url"
```

## Local Development

```bash
sam local invoke AwsNerdearlaFunction --env-vars env.json
```

## Testing

```bash
npm test
```
