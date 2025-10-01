import express from "express";
import { EdfaliClient } from "../edfali/client.js";
import { initiateSchema, confirmSchema } from "../validation/schemas.js";

const router = express.Router();
const edfali = new EdfaliClient();

// Helper to convert provider code to API error
function codeToHttpAndMessage(code) {
  switch ((code || "").toUpperCase()) {
    case "PW1":
      return { status: 401, message: "Authentication failed (service password)." };
    case "PW":
      return { status: 401, message: "Authentication failed (PIN invalid)." };
    case "LIMIT":
      return { status: 400, message: "Amount is outside allowed limits." };
    case "ACC":
      return { status: 404, message: "Customer account not found." };
    case "BAL":
      // Mask the real reason per instruction
      return { status: 409, message: "Unable to process the request at this time." };
    default:
      return { status: 502, message: "Upstream returned an unknown response." };
  }
}

// Step 1: Initiate (DoPTrans)
/* {
  "Mobile": "SenderPhone" < our merchant phone number>, 
  "Pin": "****" <Your 4-digit merchant PIN>, 
  "Cmobile": "ReceiverPhone" < Customer’s mobile number> must starts with+2189 , 
  "Amount": 250
} */

router.post("/initiate", async (req, res) => {
  const { error, value } = initiateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  try {
    const result = await edfali.doPTrans(value);
    if (result.status === "FAILED") {
      const { status, message } = codeToHttpAndMessage(result.code);
      return res.status(status).json({ error: message, code: result.code });
    }
    if (result.status === "PENDING" && result.session) {
      return res.json({
        status: "PENDING",
        sessionID: result.session,
        provider: result.raw,
      });
    }
    return res.status(502).json({ error: "Unexpected initiate response", provider: result.raw });
  } catch (e) {
    return res.status(502).json({ error: e.message });
  }
});

// Step 2: Confirm (OnlineConfTrans)
/* {
  "Mobile": "SenderPhone" < merchant phone number>, 
  "Pin": "****" <4-digit PIN (OTP) that Edfali sent to the customer’s phone>, 
  "sessionID": "abc123" < From DoPTrans response> 
}*/
router.post("/confirm", async (req, res) => {
  const { error, value } = confirmSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  try {
    const result = await edfali.onlineConfTrans(value);
    if (result.status === "FAILED") {
      const { status, message } = codeToHttpAndMessage(result.code);
      return res.status(status).json({ error: message, code: result.code });
    }
    if (result.status === "SUCCESS" || result.ok === true || /^OK$/i.test(result.raw)) {
      return res.json({ status: "SUCCESS" });
    }
    return res.status(502).json({ error: "Unexpected confirm response", provider: result.raw });
  } catch (e) {
    return res.status(502).json({ error: e.message });
  }
});

export default router;
