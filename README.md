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

Every method returns a promise that resolves to a uniform envelope:

```ts
{
  success: boolean;
  message: string;
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

// POST /price — estimate charging price
await cloud.info.price({
  amount: 0,
  kWh: 16.3,
  connector_id: "CONNECTOR_ID"
});
// data: { amount, kwh, time }
```

### `cloud.session`

```ts
// POST /session/start — start a charging session
const start = await cloud.session.start({
  connector_id: "CONNECTOR_ID",
  stop_kw: 20,          // optional
  id_tag: "ID_TAG",     // optional
  note: "optional note",// optional
  is_white_list: false  // optional
});

// GET /session/info/:id — session status + live meter info
await cloud.session.info("SESSION_ID");

// POST /session/stop — stop a running session
await cloud.session.stop("SESSION_ID");
```

`session.start`, `session.info`, and `session.stop` resolve with `data` typed as the session info object (id, park/station/connector, status, invoice, meter readings, etc.).

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
- `logAxios(enabled, name)` — logger factory used internally

Method parameters and `data` payloads are fully typed, so editors give autocomplete on results. (The underlying type aliases such as `ParkType` and `ConnectorT` live in `src/types.ts` and are used in the method signatures, but are not re-exported from the package root.)

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
