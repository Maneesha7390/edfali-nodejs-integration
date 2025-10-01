import Joi from "joi";

const mobileMerchant = Joi.string()
  .pattern(/^9\d{8}$/) // 9xxxxxxxx (9 digits)
  .message("Mobile must be 9 digits starting with 9")
  .required();

const cmobileLibya = Joi.string()
  .pattern(/^\+2189\d{8}$/) // +2189xxxxxxxx (13 chars)
  .message("Cmobile must be +2189xxxxxxxx (13 chars)");

const cmobileService = Joi.string()
  .pattern(/^\d{3,15}$/) // service short/long numbers
  .message("Cmobile service number must be 3-15 digits");

export const initiateSchema = Joi.object({
  Mobile: mobileMerchant,
  // Step 1 PIN = merchant's 4-digit PIN provided by bank
  Pin: Joi.string().pattern(/^\d{4}$/).message("Pin must be 4 digits").required(),
  Cmobile: Joi.alternatives().try(cmobileLibya, cmobileService).required(),
  Amount: Joi.number().positive().precision(2).required(),
});

export const confirmSchema = Joi.object({
  Mobile: mobileMerchant,
  // Step 2 PIN = customer's 4-digit confirmation sent via SMS
  Pin: Joi.string().pattern(/^\d{4}$/).message("Pin must be 4 digits").required(),
  sessionID: Joi.string().min(1).max(128).required(),
});
