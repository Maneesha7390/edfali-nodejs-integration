# Edfali Node + Swagger Starter

A minimal Node.js project to integrate with the Edfali SOAP `.asmx` API using:
- **axios** + **xml2js** for SOAP requests
- **Express** for REST endpoints
- **Swagger UI** for interactive API docs at `/docs`

> ⚠️ The sample endpoint is HTTP (not HTTPS). Because you'll send `Pin`/`PW`, use HTTPS or a private network/VPN in production.

## Quick Start

```bash
# 1) Extract and enter folder
npm install

# 2) Create .env
cp .env.example .env
# Edit EDFALI_APP_PASSWORD, and if you have an HTTPS endpoint, change EDFALI_BASE_URL

# 3) Run
npm start
# => API on http://localhost:3000
# => Swagger UI on http://localhost:3000/docs
```

## Endpoints

- `POST /payments/initiate` — Initiate payment (maps to SOAP `DoPTrans`)
- `POST /payments/confirm` — Confirm payment (maps to SOAP `OnlineConfTrans`)

See `docs/openapi.yaml` for request/response schemas.

## Project Structure

```
src/
  edfali/
    client.js        # EdfaliClient (axios + xml2js)
    envelopes.js     # SOAP 1.1 envelopes
    errors.js        # Custom error classes
    parse.js         # SOAP parsing + provider string decoding
  routes/
    payments.js      # Express routes
  validation/
    schemas.js       # Joi schemas
  server.js          # Express bootstrap + Swagger UI
docs/
  openapi.yaml
.env.example
package.json
```

## Notes
- Adjust `decodeProviderString` in `src/edfali/parse.js` to your provider's exact result format.
- Never log full PIN/PW in production.
