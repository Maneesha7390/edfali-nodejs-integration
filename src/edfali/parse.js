import { parseStringPromise } from "xml2js";

export async function parseSoapResult(xml, opName) {
  const parsed = await parseStringPromise(xml, { explicitArray: false });
  const env = parsed["soap:Envelope"] || parsed["Envelope"];
  const body = env?.["soap:Body"] || env?.["Body"];
  const resp = body?.[`${opName}Response`];
  const result = resp?.[`${opName}Result`];
  if (typeof result === "undefined") {
    throw new Error(`Missing ${opName}Result in SOAP response`);
  }
  return String(result).trim();
}

export function decodeProviderString(raw, { op }) {
  const s = String(raw).trim();

  // Normalize known failure codes
  const failures = new Set(["PW1", "PW", "LIMIT", "ACC", "BAL"]);
  if (failures.has(s.toUpperCase())) {
    return { status: "FAILED", code: s.toUpperCase(), raw };
  }

  // Confirm call success
  if (op === "OnlineConfTrans" && /^OK$/i.test(s)) {
    return { status: "SUCCESS", ok: true, raw };
  }

  // Initiate call success should yield a session id
  if (op === "DoPTrans") {
    // Try SESSION=... format first
    const m = /SESSION\s*=\s*([A-Za-z0-9_\-:+/=]{4,})/i.exec(s);
    if (m) return { status: "PENDING", session: m[1], raw };

    // If the service returns the session id directly without labels,
    // accept a reasonably safe token (>=6 chars, not just "OK" or a known code)
    if (!/[\s|]/.test(s) && s.length >= 6 && !failures.has(s.toUpperCase())) {
      return { status: "PENDING", session: s, raw };
    }
  }

  // Generic fallbacks:
  if (/^SUCCESS$/i.test(s)) return { status: "SUCCESS", raw };
  if (/^PENDING$/i.test(s)) return { status: "PENDING", raw };

  // If nothing matched, mark unknown
  return { status: "UNKNOWN", raw };
}
