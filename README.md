# cloudhub-ev — CloudHub EV Central System SDK

A small, typed TypeScript/JavaScript SDK for the **CloudHub EV Central System** public REST API — EV charging parks, stations, connectors, charging sessions, and invoice payments.

> npm package: `cloudhub-ev`
> Transport: REST over HTTPS (built on `axios` / `axios-master`)

---

## Installation

```bash
npm install cloudhub-ev
# or
yarn add cloudhub-ev
```

---

## Quick start

### TypeScript / ESM

```ts
import { CloudEv } from "cloudhub-ev";

const cloud = new CloudEv({
  HOST: "https://YOUR_CLOUDHUB_HOST", // API base URL (placeholder)
  API_KEY: "YOUR_API_KEY",            // placeholder — keep out of source control
  MERCHANT_ID: "YOUR_MERCHANT_ID",    // placeholder
  LOGGER: false                       // optional, default false
});

async function main() {
  const parks = await cloud.info.list();
  console.log(parks); // { success, message, data }
}

main();
```

### JavaScript (CommonJS)

```js
const { CloudEv } = require("cloudhub-ev");

const cloud = new CloudEv({
  HOST: "https://YOUR_CLOUDHUB_HOST",
  API_KEY: "YOUR_API_KEY",
  MERCHANT_ID: "YOUR_MERCHANT_ID"
});

cloud.info
  .list()
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
```

Every method returns a promise that resolves to a uniform envelope (`CloudEvResult<T>`):

```ts
{
  success: boolean;
  message: string;
  code?: string; // server code, e.g. "CAR_NOT_ALLOWED" — use it to branch on errors
  data?: <method-specific payload>;
}
```

Network/HTTP errors are caught internally and returned as `{ success: false, message }` — methods do not throw.

---

## Configuration

`new CloudEv(config)` accepts (`CloudEvConfig`):

| Field         | Type      | Required | Notes                                      |
| ------------- | --------- | -------- | ------------------------------------------ |
| `HOST`        | `string`  | yes      | API base URL (no trailing slash)           |
| `API_KEY`     | `string`  | yes      | Sent as the `x-api-key` request header     |
| `MERCHANT_ID` | `string`  | yes      | Stored on the client                       |
| `LOGGER`      | `boolean` | no       | When `true`, logs each request/response    |

Authentication is sent on every request as:

```http
x-api-key: YOUR_API_KEY
```

---

## API

The client exposes three groups: `info`, `session`, and `invoice`.

### `cloud.info`

```ts
// GET /parks — list parks (with nested stations + connectors)
await cloud.info.list();

// GET /park — list parks (flat, no nesting)
await cloud.info.parkList();

// GET /park/:id — full park detail (park → stations → connectors)
await cloud.info.park("PARK_ID");

// POST /connector — resolve a connector from a scanned QR value
await cloud.info.connectorByQR("110A43120069=1");
// data: { park, station, connector }

// POST /price — estimate charging price (time-of-use tariff aware)
await cloud.info.price({
  connector_id: "CONNECTOR_ID",
  kWh: 16.3,          // either kWh …
  // amount: 20000,   // … or amount (₮)
  // power_kw: 60,    // optional — default: connector power_kw
  // start_at: "2026-11-15T21:30:00+08:00" // optional — default: now
});
// data: { amount, kwh, time, max_amount, breakdown, tariff, price_now, price_min, price_max, … }
```

#### Tariffs (time-of-use pricing)

Charging is billed by the connector's **tariff** — a list of daily periods, each with its own price per kWh
(Mongolia time, UTC+8). A session that crosses a period boundary is split at that boundary and each part is
billed at its own price.

- `connector.tariff_id`, `connector.price_now` — the tariff that applies and its current price.
- `connector.kw_price` — a general **display** price only; it is not used for billing.
- `park.tariffs` (from `list()` / `park()`) and `connectorByQR(...).data.tariff` — full tariff definitions.
- `price().data.max_amount` — the amount to hold when pre-authorising a `kWh`-based charge (kWh × highest tariff price).

### `cloud.session`

```ts
// POST /session/start — start a charging session
const start = await cloud.session.start({
  connector_id: "CONNECTOR_ID",
  stop_price: 20000,    // optional — stop at this amount (₮); recommended for prepaid flows
  // stop_kw: 20,       // optional — stop at this energy (kWh); not together with stop_price
  id_tag: "ID_TAG",     // optional
  note: "optional note",// optional
  is_white_list: false, // optional
  info: {               // optional — required plate_number on fixed-car parks
    plate_number: "1234УБА",
    user_id: "U123",
    phone: "99112233",
    email: "user@example.com"
  }
});
if (!start.success) console.log(start.code, start.message); // e.g. "CAR_NOT_ALLOWED"

// GET /session/info/:id — status, live meter info and price breakdown
const info = await cloud.session.info("SESSION_ID");
info.data?.price_breakdown; // [{ from, to, period, kw_price, kwh, amount }]

// POST /session/stop — stop a running session
await cloud.session.stop("SESSION_ID");
```

`session.start`, `session.info`, and `session.stop` resolve with `data` typed as the session info object (id, park/station/connector, status, invoice, meter readings, tariff, price breakdown, etc.).

**Billing with limits.** When a session auto-stops at its limit, the final bill equals the limit exactly:
`stop_price` → `total_amount === stop_price`; `stop_kw` → `total_kwh === stop_kw`. The real measured values are in
`price_adjusted`. If charging ends before the limit (car full, user stopped), the real amount is billed — refund the
difference to the user.

**`session.start` error codes** (`result.code` when `success === false`; `message` can be shown to the user):

| code | meaning |
| --- | --- |
| `PLATE_REQUIRED` | Fixed-car park — `info.plate_number` is required |
| `VEHICLE_NOT_FOUND` | No vehicle found for the plate number |
| `CAR_NOT_ALLOWED` | The car's make is not allowed at this park |
| `VEHICLE_CHECK_UNAVAILABLE` | Vehicle lookup service is temporarily unavailable |
| `PRICE_NOT_SET` | No tariff price — `stop_price` can't be used |
| `400` / `404` / `409` | Invalid input, not plugged / not found / charger offline or busy |

### `cloud.invoice`

```ts
// POST /invoice/pay — confirm an invoice payment
await cloud.invoice.pay({
  session_id: "SESSION_ID",
  invoice_id: "INVOICE_ID",
  paid_amount: 12500,
  tra_id: "TRX-12345678"
});
```

---

## Full example

```ts
import { CloudEv } from "cloudhub-ev";

const cloud = new CloudEv({
  HOST: "https://YOUR_CLOUDHUB_HOST",
  API_KEY: "YOUR_API_KEY",
  MERCHANT_ID: "YOUR_MERCHANT_ID"
});

async function run() {
  // Resolve a connector from its QR code
  const connector = await cloud.info.connectorByQR("110A43120069=1");
  const connectorId = connector.data?.connector.id;
  if (!connectorId) return;

  // Start a session
  const start = await cloud.session.start({ connector_id: connectorId });
  const sessionId = start.data?.id;
  if (!sessionId) return;

  // Check status
  console.log(await cloud.session.info(sessionId));

  // Stop it
  console.log(await cloud.session.stop(sessionId));

  // Confirm invoice payment
  console.log(
    await cloud.invoice.pay({
      session_id: sessionId,
      invoice_id: "INV-2025-0001",
      paid_amount: 12500,
      tra_id: "TRX-12345"
    })
  );
}

run();
```

---

## Exports

The package root exports:

- `CloudEv` — main client class (also the default export)
- `CloudEvConfig` — config interface
- `parseErr(error)` — helper that extracts a message from an error/axios error
- `parseErrCode(error)` — helper that extracts the server `code` (or HTTP status)
- `logAxios(enabled, name)` — logger factory used internally
- All types from `src/types.ts` — e.g. `CloudEvResult`, `ParkType`, `ConnectorT`, `TariffT`, `PriceParams`,
  `PriceResultT`, `PriceBreakdownRowT`, `SessionStartParams`, `SessionInfoType`, `SessionStartErrorCode`

---

## Project structure

```
src/
 ├─ index.ts    # CloudEv class + config, parseErr, logAxios
 ├─ info.ts     # park / station / connector / price APIs
 ├─ session.ts  # charging session APIs
 ├─ invoice.ts  # invoice payment API
 ├─ types.ts    # TypeScript types
```

---

## Support

**Github:** https://github.com/togtokh-dev/cloud-ev

---

## License

ISC
