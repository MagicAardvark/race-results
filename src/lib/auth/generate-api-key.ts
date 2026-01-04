import { randomBytes } from "crypto";

export const API_KEY_PREFIX = "rr_api_key_";

export function generateApiKey(): string {
    // Format: rr_live_<32-char-hex>
    return `${API_KEY_PREFIX}${randomBytes(16).toString("hex")}`;
}
