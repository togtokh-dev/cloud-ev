# CloudHub EV — Official EV Central System SDK

A simple and powerful TypeScript/JavaScript SDK for integrating with  
**CloudHub EV Central System APIs** — charging parks, stations, connectors, sessions, and invoice payments.

> npm package: https://www.npmjs.com/package/cloud-ev  
> API Host: `https://api.cloudhub.mn`  
> Protocol: REST API (Public)

---

## 📦 Installation

```bash
npm install cloud-ev
# or
yarn add cloud-ev
```

---

## 🚀 Quick Start

```ts
import { CloudEv } from "cloud-ev";

const cloud = new CloudEv({
  HOST: "https://api.cloudhub.mn",
  API_KEY: "YOUR_API_KEY",
  MERCHANT_ID: "YOUR_MERCHANT_ID"
});

async function main() {
  const parks = await cloud.info.list();
  console.log(parks);
}

main();
```

---

## 📘 API Overview

The SDK provides 3 main service groups:

| Group       | Description                          |
| ----------- | ------------------------------------ |
| **info**    | Park, station, connector, price info |
| **session** | Start/stop charging sessions         |
| **invoice** | Confirm invoice payments             |

---

# 📍 INFO API

### **List all EV parks**

```ts
await cloud.info.list();
```

---

### **Get full park details**

包含 Park → Stations → Connectors

```ts
await cloud.info.park("PARK_ID");
```

---

### **Find connector by QR**

```ts
await cloud.info.connectorByQR("110A43120069=1");
```

---

### **Calculate charging price**

```ts
await cloud.info.price({
  amount: 0,
  kWh: 16.3,
  connector_id: "CONNECTOR_ID"
});
```

---

# ⚡ SESSION API

### **Start session**

```ts
const start = await cloud.session.start("CONNECTOR_ID");
```

---

### **Get session info**

```ts
await cloud.session.info("SESSION_ID");
```

---

### **Stop session**

```ts
await cloud.session.stop("SESSION_ID");
```

---

# 💳 INVOICE API

### **Confirm invoice payment**

```ts
await cloud.invoice.pay({
  session_id: "SESSION_ID",
  invoice_id: "INVOICE_ID",
  paid_amount: 10000,
  tra_id: "TRX-12345678"
});
```

---

# 🧩 Full Example

```ts
import { CloudEv } from "cloud-ev";

const cloud = new CloudEv({
  HOST: "https://api.cloudhub.mn",
  API_KEY: "sk_live.xxxxx",
  MERCHANT_ID: "xxxxxx"
});

async function run() {
  // Park list
  console.log(await cloud.info.list());

  // Park detail
  console.log(await cloud.info.park("29996bca-..."));

  // Connector by QR
  console.log(await cloud.info.connectorByQR("110A43120069=1"));

  // Price calculate
  console.log(
    await cloud.info.price({
      amount: 0,
      kWh: 16.3,
      connector_id: "8daa0f30-..."
    })
  );

  // Start session
  const start = await cloud.session.start("8daa0f30-...");
  console.log(start);

  // Session info
  console.log(await cloud.session.info(start?.data?.session_id));

  // Stop session
  console.log(await cloud.session.stop(start?.data?.session_id));

  // Invoice pay
  console.log(
    await cloud.invoice.pay({
      session_id: "SESSION_ID",
      invoice_id: "INV-2025-0001",
      paid_amount: 12500,
      tra_id: "TRX-12345"
    })
  );
}

run();
```

---

# 📄 TypeScript Support

This package ships with **full TypeScript types**, including:

- `ParkType`
- `StationT`
- `ConnectorT`
- `SessionStatusType`
- `Invoice responses`

---

# 🏗 Project Structure

```
src/
 ├─ index.ts         # CloudEv Class
 ├─ info.ts          # Park/Station/Connector APIs
 ├─ session.ts       # Charging session APIs
 ├─ invoice.ts       # Invoice payment API
 ├─ types.ts         # TS types
```

---

# 🔐 Authentication

All requests use the same API key:

```http
x-api-key: YOUR_API_KEY
```

---

# 📮 Support

If you need help integrating CloudHub EV APIs:  
**Email:** engineering@cloudhub.mn  
**Github:** coming soon…

---

# 📜 License

MIT License (free to use)
