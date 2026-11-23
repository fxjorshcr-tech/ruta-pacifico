// src/lib/powertranz.ts
// Server-only client for the Powertranz gateway (First Atlantic Commerce,
// the processor behind BAC Credomatic e-commerce in Costa Rica).
//
// Integration used: SPI (Simplified Payment Integration) + 3-D Secure 2.x +
// Hosted Payment Page (HPP). The card number never touches our servers:
//
//   1. POST /spi/sale  (ThreeDSecure: true, ExtendedData.HostedPage)
//        → IsoResponseCode "SP4", RedirectData (HTML) + SpiToken
//   2. The browser renders RedirectData inside an <iframe srcdoc>. Powertranz
//      shows its hosted card form there, runs 3-D Secure (frictionless or
//      challenge) and finally POSTs the result to our MerchantResponseUrl —
//      still inside the iframe, from the cardholder's browser.
//   3. Our callback decides whether to finalise and does
//      POST /spi/payment with the SpiToken (valid for only 5 minutes)
//        → Approved: true, IsoResponseCode "00", AuthorizationCode, RRN
//
// Docs: developer.powertranz.com → "3D-Secure con SPI", "SPI-3DS-HPP".
// Never import this file from a Client Component — it reads the gateway
// password from the environment.

// Server-only: never import from a Client Component (reads the gateway password).
// (The `server-only` guard package is not a dependency of this project.)

export type PowertranzEnvironment = 'staging' | 'production';

const STAGING_BASE = 'https://staging.ptranz.com/api';
const PRODUCTION_BASE = 'https://gateway.ptranz.com/api';

/** ISO 4217 numeric code for USD — every order on the site is priced in USD. */
export const CURRENCY_USD = '840';

export function getPowertranzEnvironment(): PowertranzEnvironment {
  // Tolerate "Production", "prod", stray spaces: anything else is staging.
  const v = (process.env.POWERTRANZ_ENVIRONMENT || '').trim().toLowerCase();
  return v === 'production' || v === 'prod' || v === 'live' ? 'production' : 'staging';
}

export function getPowertranzBaseUrl(): string {
  const override = process.env.POWERTRANZ_API_BASE_URL?.trim();
  if (override) return override.replace(/\/$/, '');
  return getPowertranzEnvironment() === 'production' ? PRODUCTION_BASE : STAGING_BASE;
}

interface PowertranzConfig {
  id: string;
  password: string;
  pageSet: string;
  pageName: string;
}

/**
 * True when every variable needed to open a hosted-page session is present.
 * The checkout uses this (through /api/powertranz/start) to fall back to the
 * "we'll email you a payment link" flow instead of showing a broken form.
 */
export function isPowertranzConfigured(): boolean {
  return !!(
    process.env.POWERTRANZ_ID &&
    process.env.POWERTRANZ_PASSWORD &&
    process.env.POWERTRANZ_PAGE_SET &&
    process.env.POWERTRANZ_PAGE_NAME
  );
}

function getConfig(): PowertranzConfig {
  const id = process.env.POWERTRANZ_ID;
  const password = process.env.POWERTRANZ_PASSWORD;
  const pageSet = process.env.POWERTRANZ_PAGE_SET;
  const pageName = process.env.POWERTRANZ_PAGE_NAME;
  const missing = [
    !id && 'POWERTRANZ_ID',
    !password && 'POWERTRANZ_PASSWORD',
    !pageSet && 'POWERTRANZ_PAGE_SET',
    !pageName && 'POWERTRANZ_PAGE_NAME',
  ].filter(Boolean);
  if (missing.length) {
    throw new Error(`Powertranz is not configured. Missing: ${missing.join(', ')}`);
  }
  return { id: id!, password: password!, pageSet: pageSet!, pageName: pageName! };
}

// ─── Response shape ────────────────────────────────────────────────────────

export interface PowertranzThreeDS {
  eci?: string;
  xid?: string;
  cavv?: string;
  authenticationStatus?: string;  // Y authenticated · A attempted · N failed · U unavailable · R rejected
  protocolVersion?: string;       // "2.1.0" | "2.2.0"
  fingerprintIndicator?: string;
  dsTransId?: string;
  responseCode?: string;
  cardholderInfo?: string;        // issuer message that must be shown to the cardholder when present
}

export interface PowertranzResponse {
  /** Gateway-level approval flag. Only true on a finalised /spi/payment. */
  approved: boolean;
  transactionType?: number;
  transactionIdentifier: string;
  totalAmount?: number;
  currencyCode?: string;
  /** "00" approved · "SP4" SPI preprocessing complete · "3D0" 3DS complete · "HP0" HPP complete · anything else = decline / error */
  isoResponseCode: string;
  responseMessage: string;
  orderIdentifier?: string;
  authorizationCode?: string;
  rrn?: string;
  cardBrand?: string;
  panToken?: string;
  spiToken?: string;
  /** HTML document to render in an iframe (only on the SP4 preprocessing answer). */
  redirectData?: string;
  threeDS?: PowertranzThreeDS;
  errors?: Array<{ code: string; message: string }>;
  /** HTTP status of the gateway answer (0 when the fetch itself failed). */
  httpStatus: number;
  /** Entire parsed body minus RedirectData — safe to persist for debugging. */
  raw: Record<string, unknown>;
}

function str(v: unknown): string | undefined {
  if (v == null) return undefined;
  const s = String(v);
  return s.length ? s : undefined;
}

export function parsePowertranzBody(body: unknown, httpStatus: number): PowertranzResponse {
  const obj = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  const rm = (obj.RiskManagement && typeof obj.RiskManagement === 'object'
    ? (obj.RiskManagement as Record<string, unknown>).ThreeDSecure
    : undefined) as Record<string, unknown> | undefined;
  const errorsRaw = Array.isArray(obj.Errors) ? (obj.Errors as Array<Record<string, unknown>>) : undefined;

  const raw: Record<string, unknown> = { ...obj };
  delete raw.RedirectData;

  return {
    approved: obj.Approved === true,
    transactionType: typeof obj.TransactionType === 'number' ? obj.TransactionType : undefined,
    transactionIdentifier: str(obj.TransactionIdentifier) || '',
    totalAmount: typeof obj.TotalAmount === 'number' ? obj.TotalAmount : undefined,
    currencyCode: str(obj.CurrencyCode),
    isoResponseCode: str(obj.IsoResponseCode) || '',
    responseMessage: str(obj.ResponseMessage) || (errorsRaw?.[0] ? str(errorsRaw[0].Message) || '' : ''),
    orderIdentifier: str(obj.OrderIdentifier),
    authorizationCode: str(obj.AuthorizationCode),
    rrn: str(obj.RRN),
    cardBrand: str(obj.CardBrand),
    panToken: str(obj.PanToken),
    spiToken: str(obj.SpiToken),
    redirectData: str(obj.RedirectData),
    threeDS: rm
      ? {
          eci: str(rm.Eci),
          xid: str(rm.Xid),
          cavv: str(rm.Cavv),
          authenticationStatus: str(rm.AuthenticationStatus),
          protocolVersion: str(rm.ProtocolVersion),
          fingerprintIndicator: str(rm.FingerprintIndicator),
          dsTransId: str(rm.DsTransId),
          responseCode: str(rm.ResponseCode),
          cardholderInfo: str(rm.CardholderInfo),
        }
      : undefined,
    errors: errorsRaw?.map((e) => ({ code: str(e.Code) || '', message: str(e.Message) || '' })),
    httpStatus,
    raw,
  };
}

// ─── HTTP ──────────────────────────────────────────────────────────────────

async function postJson(
  path: string,
  body: unknown,
  opts: { auth: boolean },
): Promise<PowertranzResponse> {
  const url = `${getPowertranzBaseUrl()}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (opts.auth) {
    const cfg = getConfig();
    headers['PowerTranz-PowerTranzId'] = cfg.id;
    headers['PowerTranz-PowerTranzPassword'] = cfg.password;
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      cache: 'no-store',
      signal: AbortSignal.timeout(30_000),
    });
  } catch (err) {
    return {
      approved: false,
      transactionIdentifier: '',
      isoResponseCode: '',
      responseMessage: `Gateway unreachable: ${err instanceof Error ? err.message : String(err)}`,
      httpStatus: 0,
      raw: { fetch_error: err instanceof Error ? err.message : String(err) },
    };
  }

  const text = await res.text();
  let parsed: unknown = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = null;
  }
  if (parsed == null) {
    return {
      approved: false,
      transactionIdentifier: '',
      isoResponseCode: '',
      responseMessage: `HTTP ${res.status}: ${text.slice(0, 200)}`,
      httpStatus: res.status,
      raw: { http_status: res.status, body: text.slice(0, 2000) },
    };
  }
  return parsePowertranzBody(parsed, res.status);
}

// ─── Public API ────────────────────────────────────────────────────────────

export interface HostedSaleInput {
  /** GUID we generate; Powertranz echoes it back in every later message. */
  transactionIdentifier: string;
  /** Merchant reference shown in the Powertranz portal (booking number + suffix). */
  orderIdentifier: string;
  amount: number;              // dollars, e.g. 123.45
  /** Absolute https URL Powertranz posts the 3DS/HPP result to (inside the iframe). */
  merchantResponseUrl: string;
  customer?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

function formatAmount(amount: number): number {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(`Invalid amount: ${amount}`);
  }
  return Math.round(amount * 100) / 100;
}

/**
 * Builds the /spi/sale body for a 3-D Secure + Hosted Payment Page session.
 * Exported so the route can persist exactly what was sent (minus secrets —
 * credentials travel in headers, never in the body).
 */
export function buildHostedSaleRequest(input: HostedSaleInput): Record<string, unknown> {
  const cfg = getConfig();
  const billing: Record<string, string> = {};
  if (input.customer?.firstName) billing.FirstName = input.customer.firstName.slice(0, 50);
  if (input.customer?.lastName) billing.LastName = input.customer.lastName.slice(0, 50);
  if (input.customer?.email) billing.EmailAddress = input.customer.email.slice(0, 100);

  return {
    TransactionIdentifier: input.transactionIdentifier,
    TotalAmount: formatAmount(input.amount),
    CurrencyCode: CURRENCY_USD,
    ThreeDSecure: true,
    OrderIdentifier: input.orderIdentifier,
    AddressMatch: false,
    ...(Object.keys(billing).length ? { BillingAddress: billing } : {}),
    ExtendedData: {
      ThreeDSecure: {
        // 5 = full-screen challenge window: the ACS challenge then fills our
        // iframe instead of a fixed 600x400 box, which is what phones need.
        ChallengeWindowSize: 5,
        // "01" = no preference (let the issuer decide frictionless vs challenge)
        ChallengeIndicator: '01',
      },
      HostedPage: {
        PageSet: cfg.pageSet,
        PageName: cfg.pageName,
      },
      MerchantResponseUrl: input.merchantResponseUrl,
    },
  };
}

/** Step 1 — open the SPI session. Expect isoResponseCode "SP4" + redirectData + spiToken. */
export async function startHostedSale(input: HostedSaleInput): Promise<PowertranzResponse> {
  const body = buildHostedSaleRequest(input);
  return postJson('/spi/sale', body, { auth: true });
}

/**
 * Step 3 — finalise the sale with the SPI token (after 3DS/HPP completed).
 * Per the docs this call carries NO PowerTranz-Id/Password headers and the
 * body is just the token as a JSON string.
 */
export async function completeSpiPayment(spiToken: string): Promise<PowertranzResponse> {
  return postJson('/spi/payment', spiToken, { auth: false });
}

/** Reverse an authorisation / same-day sale. */
export async function voidPowertranzTransaction(args: {
  transactionIdentifier: string;
  originalTransactionIdentifier: string;
}): Promise<PowertranzResponse> {
  return postJson('/void', {
    TransactionIdentifier: args.originalTransactionIdentifier,
    ExternalIdentifier: args.transactionIdentifier,
  }, { auth: true });
}

/** Refund a captured sale (full when amount is omitted). */
export async function refundPowertranzTransaction(args: {
  transactionIdentifier: string;
  originalTransactionIdentifier: string;
  amount: number;
}): Promise<PowertranzResponse> {
  return postJson('/refund', {
    TransactionIdentifier: args.transactionIdentifier,
    TotalAmount: formatAmount(args.amount),
    CurrencyCode: CURRENCY_USD,
    Refund: true,
    ExternalIdentifier: args.originalTransactionIdentifier,
  }, { auth: true });
}

// ─── Interpretation helpers ────────────────────────────────────────────────

/** The callback answers that mean "cardholder step done, you may finalise". */
export const CALLBACK_OK_CODES = new Set(['3D0', 'HP0']);

/**
 * "SP1": the card is not enrolled / not eligible for 3-D Secure. Powertranz
 * can still authorise it, but the liability shift is lost. Off by default;
 * opt in with POWERTRANZ_ALLOW_NON_3DS=true if BAC approves it.
 */
export function allowNon3DSCards(): boolean {
  return process.env.POWERTRANZ_ALLOW_NON_3DS === 'true';
}

export type CallbackDecision =
  | { proceed: true; reason: 'authenticated' | 'attempted' | 'hosted-page' | 'non-3ds-allowed' }
  | { proceed: false; reason: 'not-authenticated' | 'not-eligible' | 'error'; message: string };

/** Decide, from the MerchantResponseUrl payload, whether to call /spi/payment. */
export function decideFromCallback(cb: PowertranzResponse): CallbackDecision {
  const code = cb.isoResponseCode;
  const auth = cb.threeDS?.authenticationStatus;

  // Gateway-side errors (e.g. 757 "Hosted page not found", bad request
  // fields) arrive with an Errors[] block and a generic ISO code such as
  // "12 Invalid transaction". They are configuration problems on our side,
  // never a decline by the cardholder's bank — say so instead of blaming the card.
  // Exception: a failed 3-D Secure authentication (status N/U/R) can arrive
  // together with an Errors[] block (e.g. 510 "3DS invalid parameter:
  // authenticationValue"); the bank's verification failed, so tell the
  // traveller that rather than blaming the processor.
  const authFailed = code === '3D0' && (auth === 'N' || auth === 'U' || auth === 'R');
  if (cb.errors && cb.errors.length > 0 && !authFailed) {
    return { proceed: false, reason: 'error', message: friendlyMessage('', '', undefined) };
  }

  if (code === 'HP0') return { proceed: true, reason: 'hosted-page' };

  if (code === '3D0') {
    if (auth === 'Y') return { proceed: true, reason: 'authenticated' };
    if (auth === 'A') return { proceed: true, reason: 'attempted' };
    if (!auth) return { proceed: true, reason: 'authenticated' };
    return {
      proceed: false,
      reason: 'not-authenticated',
      message: friendlyMessage(code, cb.responseMessage, auth),
    };
  }

  if (code === 'SP1') {
    if (allowNon3DSCards()) return { proceed: true, reason: 'non-3ds-allowed' };
    return {
      proceed: false,
      reason: 'not-eligible',
      message: friendlyMessage(code, cb.responseMessage, auth),
    };
  }

  return {
    proceed: false,
    reason: code ? 'not-authenticated' : 'error',
    message: friendlyMessage(code, cb.responseMessage, auth),
  };
}

export type FriendlyLocale = 'en' | 'es';

/**
 * Turn an ISO response code into a sentence the traveller can act on. We never
 * leak the gateway wording ("DO NOT HONOR", "PICKUP CARD") to the UI.
 */
export function friendlyMessage(
  code: string | undefined,
  rawText: string | undefined,
  authStatus?: string,
  locale: FriendlyLocale = 'en',
): string {
  const es = locale === 'es';
  const c = (code || '').toUpperCase();
  const t = (rawText || '').toUpperCase();

  // 3-D Secure not completed / rejected by the issuer
  if (c.startsWith('3D') && c !== '3D0') {
    return es
      ? 'Tu banco no pudo verificar esta tarjeta. Intenta de nuevo o usa otra tarjeta.'
      : "Your bank couldn't verify this card. Please try again or use a different card.";
  }
  if (c === '3D0' && authStatus && authStatus !== 'Y' && authStatus !== 'A') {
    return es
      ? 'La verificación de tu banco no se completó. Intenta de nuevo o usa otra tarjeta.'
      : "Your bank's verification didn't complete. Please try again or use a different card.";
  }
  if (c === 'SP1') {
    return es
      ? 'Esta tarjeta no admite la verificación segura de tu banco. Por favor usa otra tarjeta.'
      : "This card doesn't support your bank's secure verification. Please use a different card.";
  }
  // Expired SPI token (customer took more than 5 minutes)
  if (c.startsWith('SP') || t.includes('TOKEN')) {
    return es
      ? 'La sesión de pago expiró. Vuelve a intentarlo.'
      : 'The payment session expired. Please try again.';
  }
  // Insufficient funds / limits
  if (c === '51' || c === '61' || c === '65') {
    return es
      ? 'Tu banco rechazó el cobro por fondos o límite insuficiente. Prueba con otra tarjeta.'
      : 'Your bank declined the charge for insufficient funds or limit. Please try a different card.';
  }
  // Expired / invalid card data
  if (c === '54' || c === '14' || c === 'N7' || c === '82' || t.includes('CVV') || t.includes('EXPIR')) {
    return es
      ? 'Los datos de la tarjeta parecen incorrectos. Revisa el número, vencimiento y CVV.'
      : 'The card details look incorrect. Please double-check the number, expiration and CVV.';
  }
  // Lost / stolen / restricted
  if (c === '41' || c === '43' || c === '04' || c === '07' || c === '62') {
    return es
      ? 'Tu banco bloqueó esta tarjeta. Por favor usa otra o contacta a tu banco.'
      : 'Your bank blocked this card. Please use a different card or contact your bank.';
  }
  // Generic issuer decline
  if (c === '05' || c === '01' || c === '02' || c === '12' || c === '57' || c === '58' || c === '59') {
    return es
      ? 'Tu banco rechazó este pago. Prueba con otra tarjeta o contacta a tu banco.'
      : 'Your bank declined this payment. Please try a different card or contact your bank.';
  }
  // Gateway / network trouble
  if (c === '91' || c === '96' || !c) {
    return es
      ? 'Hubo un problema temporal con el procesador de pagos. Intenta de nuevo en un momento.'
      : 'There was a temporary problem with the payment processor. Please try again in a moment.';
  }
  return es
    ? 'No se pudo procesar el pago. Intenta de nuevo o usa otra tarjeta.'
    : 'There was a problem processing the payment. Please try again or use a different card.';
}
