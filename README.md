# edfali-nodejs-integration
Simple and secure Node.js integration for Edfali bank payment service — wraps legacy SOAP APIs (DoPTrans and OnlineConfTrans) into clean JSON endpoints.

This repository provides a ready-to-use Node.js service for integrating the Edfali payment web service.
It hides SOAP complexity and exposes simple REST endpoints for initiating and confirming payments.

Initiate Payment (DoPTrans) — starts a payment and returns a session ID.
Confirm Payment (OnlineConfTrans) — confirms the payment with the OTP sent to the customer.
Handles bank-specific error codes (PW1, PW, ACC, LIMIT, BAL).
Validates inputs (merchant number, customer number, amount).
Keeps sensitive credentials safe in .env.
