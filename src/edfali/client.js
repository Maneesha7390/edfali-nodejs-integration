import axios from "axios";
import { doPTransEnvelope, onlineConfEnvelope, soap11Headers } from "./envelopes.js";
import { parseSoapResult, decodeProviderString } from "./parse.js";
import { EdfaliHttpError } from "./errors.js";

const BASE_URL = process.env.EDFALI_BASE_URL;
const PW = process.env.EDFALI_APP_PASSWORD;
const TIMEOUT = Number(process.env.EDFALI_TIMEOUT_MS || 15000);

export class EdfaliClient {
  constructor({ baseUrl = BASE_URL, pw = PW, timeout = TIMEOUT } = {}) {
    this.baseUrl = baseUrl;
    this.pw = pw;
    this.http = axios.create({
      baseURL: baseUrl,
      timeout,
      validateStatus: () => true,
    });
  }

  async doPTrans({ Mobile, Pin, Cmobile, Amount }) {
    const xml = doPTransEnvelope({ Mobile, Pin, Cmobile, Amount, PW: this.pw });
    const headers = soap11Headers("DoPTrans");
    const resp = await this.http.post("", xml, { headers });

    if (resp.status !== 200) throw new EdfaliHttpError(resp.status, resp.statusText, resp.data);

    const resultStr = await parseSoapResult(resp.data, "DoPTrans");
    const decoded = decodeProviderString(resultStr, { op: "DoPTrans" });
    return decoded; // {status, session?, code?, raw}
  }

  async onlineConfTrans({ Mobile, Pin, sessionID }) {
    const xml = onlineConfEnvelope({ Mobile, Pin, sessionID, PW: this.pw });
    const headers = soap11Headers("OnlineConfTrans");
    const resp = await this.http.post("", xml, { headers });

    if (resp.status !== 200) throw new EdfaliHttpError(resp.status, resp.statusText, resp.data);

    const resultStr = await parseSoapResult(resp.data, "OnlineConfTrans");
    const decoded = decodeProviderString(resultStr, { op: "OnlineConfTrans" });
    return decoded; // {status, ok?, code?, raw}
  }
}
