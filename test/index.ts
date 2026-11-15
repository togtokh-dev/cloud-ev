import { CloudEv } from "../src/index";

async function StartTest() {
  const cloud = new CloudEv({
    HOST: "https://api.cloudhub.mn",
    MERCHANT_ID: "_____",
    API_KEY: "_+_______"
  });

  console.log("====== 🌍 INFO LIST ======");
  const parks = await cloud.info.list();
  console.log(parks);
  // Хушуу бүр tariff_id / price_now, зогсоол бүр tariffs
  const c0 = parks.data?.[0]?.stations?.[0]?.connectors?.[0];
  console.log(c0?.tariff_id, c0?.price_now, parks.data?.[0]?.tariffs);

  console.log("====== 🏢 PARK DETAIL ======");
  const park = await cloud.info.park("29996bca-17bf-4694-b1d9-91a9ae5751ab");
  console.log(park);

  console.log("====== 🔌 CONNECTOR BY QR ======");
  const connector = await cloud.info.connectorByQR("110A43120069=1");
  console.log(connector, connector.data?.tariff);

  console.log("====== ⚡ PRICE CALCULATE ======");
  const price = await cloud.info.price({
    connector_id: "8daa0f30-97d4-4ac3-85e3-0a65915d3828",
    amount: 20000 // эсвэл kWh: 16.3
  });
  // data.amount — тооцоолсон дүн, data.max_amount — hold хийх дүн, data.breakdown — цагийн задаргаа
  console.log(price);

  console.log("====== ▶️ SESSION START ======");
  const start = await cloud.session.start({
    connector_id: "8daa0f30-97d4-4ac3-85e3-0a65915d3828",
    stop_price: 20000, // урьдчилж төлсөн дүн — эцсийн дүн яг үүнийг болно
    info: { plate_number: "1234УБА", phone: "99112233" }
  });
  if (!start.success && start.code === "CAR_NOT_ALLOWED") console.log("Энэ зогсоолд машин зөвшөөрөгдөөгүй:", start.message);
  console.log(start);

  // If start is OK, use returned session_id
  const sessionId = start?.data?.id || "9f7c7504-4c0f-4098-a33e-ba1b3b7bf25c";

  console.log("====== ℹ️ SESSION INFO ======");
  const sessionInfo = await cloud.session.info(sessionId);
  console.log(sessionInfo, sessionInfo.data?.price_breakdown);

  console.log("====== ⏹️ SESSION STOP ======");
  const stop = await cloud.session.stop(sessionId);
  console.log(stop);

  console.log("====== 💳 INVOICE PAY ======");
  const invoicePay = await cloud.invoice.pay({
    session_id: sessionId,
    invoice_id: "INV-20251017-0001",
    paid_amount: 12300,
    tra_id: "TRX-987654321"
  });
  console.log(invoicePay);

  console.log("====== ✅ ALL DONE ======");
}

StartTest();
