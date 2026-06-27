import "server-only";

/**
 * Zarinpal payment gateway (REST API v4). Stripe/PayPal are sanctioned in Iran;
 * Zarinpal is the standard. CLAUDE.md §1.
 *
 * Prices are stored in TOMAN but Zarinpal expects RIAL → we multiply by 10.
 * The gateway stays dormant until ZARINPAL_MERCHANT_ID is set (the owner adds it
 * later); `isZarinpalEnabled()` gates the checkout UI/flow.
 *
 * Set ZARINPAL_SANDBOX=1 to use the sandbox endpoints for test payments.
 */

const MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID;
const SANDBOX = process.env.ZARINPAL_SANDBOX === "1";

const BASE = SANDBOX
  ? "https://sandbox.zarinpal.com/pg/v4/payment"
  : "https://payment.zarinpal.com/pg/v4/payment";
const STARTPAY = SANDBOX
  ? "https://sandbox.zarinpal.com/pg/StartPay"
  : "https://payment.zarinpal.com/pg/StartPay";

export function isZarinpalEnabled(): boolean {
  return Boolean(MERCHANT_ID);
}

function tomanToRial(toman: number): number {
  return toman * 10;
}

export interface RequestResult {
  ok: boolean;
  authority?: string;
  startPayUrl?: string;
  error?: string;
}

export async function requestPayment(params: {
  amountToman: number;
  description: string;
  callbackUrl: string;
  email?: string | null;
  mobile?: string | null;
}): Promise<RequestResult> {
  if (!MERCHANT_ID) return { ok: false, error: "gateway-disabled" };

  try {
    const res = await fetch(`${BASE}/request.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        merchant_id: MERCHANT_ID,
        amount: tomanToRial(params.amountToman),
        description: params.description,
        callback_url: params.callbackUrl,
        metadata: {
          ...(params.email ? { email: params.email } : {}),
          ...(params.mobile ? { mobile: params.mobile } : {}),
        },
      }),
    });
    const json = await res.json();
    const authority: string | undefined = json?.data?.authority;
    if (json?.data?.code === 100 && authority) {
      return { ok: true, authority, startPayUrl: `${STARTPAY}/${authority}` };
    }
    const error =
      json?.errors?.message ?? `request failed (code ${json?.data?.code})`;
    return { ok: false, error: String(error) };
  } catch (err) {
    console.error("[zarinpal] request error:", err);
    return { ok: false, error: "network" };
  }
}

export interface VerifyResult {
  ok: boolean;
  refId?: string;
  alreadyVerified?: boolean;
  error?: string;
}

export async function verifyPayment(params: {
  authority: string;
  amountToman: number;
}): Promise<VerifyResult> {
  if (!MERCHANT_ID) return { ok: false, error: "gateway-disabled" };

  try {
    const res = await fetch(`${BASE}/verify.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        merchant_id: MERCHANT_ID,
        amount: tomanToRial(params.amountToman),
        authority: params.authority,
      }),
    });
    const json = await res.json();
    const code: number | undefined = json?.data?.code;
    // 100 = verified now, 101 = already verified
    if (code === 100 || code === 101) {
      return {
        ok: true,
        refId: json?.data?.ref_id ? String(json.data.ref_id) : undefined,
        alreadyVerified: code === 101,
      };
    }
    const error = json?.errors?.message ?? `verify failed (code ${code})`;
    return { ok: false, error: String(error) };
  } catch (err) {
    console.error("[zarinpal] verify error:", err);
    return { ok: false, error: "network" };
  }
}
