import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const DATA_DIR = path.dirname(fileURLToPath(import.meta.url));

export async function sendSMS(to: string, message: string) {
  if (!to) return false;

  // If Twilio env vars are provided, try sending via Twilio
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;

  try {
    if (accountSid && authToken && from) {
      // dynamic require to avoid hard dependency during dev if not installed
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const twilio = require("twilio")(accountSid, authToken);
      await twilio.messages.create({ body: message, from, to });
      return true;
    }

    // Fallback: write to a local sms.log for inspection
    const logLine = `${new Date().toISOString()} | TO: ${to} | MSG: ${message}\n`;
    await fs.appendFile(path.join(DATA_DIR, "sms.log"), logLine, "utf-8");
    return false;
  } catch (err) {
    const errLine = `${new Date().toISOString()} | ERROR sending to ${to} | ${String(err)}\n`;
    await fs.appendFile(path.join(DATA_DIR, "sms.log"), errLine, "utf-8");
    return false;
  }
}
