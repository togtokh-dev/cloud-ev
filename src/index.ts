// src/index.ts
import type {
  CloudEvResult,
  ConnectorT,
  ParkT,
  ParkType,
  PriceParams,
  PriceResultT,
  SessionInfoType,
  SessionStartParams,
  StationT,
  TariffT
} from "./types";
import { PARK_LIST, PARK_INFO_LIST, PARK_INFO, CONNECTOR_BY_QR, PRICE } from "./info";
import { INVOICE_PAY } from "./invoice";
import { SESSION_INFO, SESSION_START, SESSION_STOP } from "./session";
import { AxiosMasterLoggerType } from "axios-master";

export * from "./types";

export interface CloudEvConfig {
  HOST: string;
  API_KEY: string;
  MERCHANT_ID: string;
  LOGGER?: boolean; //default false
}

/* ----------------------------- Helper error parser ----------------------------- */
export function parseErr(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error && typeof (error as any).response === "object") {
    const err = error as any;
    return err.response?.data?.message || "error";
  }
  return "unexpected error";
}

/** Алдааны хариуны `code` (жишээ нь "CAR_NOT_ALLOWED"); байхгүй бол HTTP статус */
export function parseErrCode(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "response" in error && typeof (error as any).response === "object") {
    const r = (error as any).response;
    const code = r?.data?.code ?? r?.status;
    return code != null ? String(code) : undefined;
  }
  return undefined;
}

/* ----------------------------- Logger helper ----------------------------- */

export const logAxios = (enabled: boolean, name: string) => (data: AxiosMasterLoggerType) => {
  if (!enabled) return;

  console.log(
    `[${name}]`,
    JSON.stringify(
      {
        time: data?.json?.time,
        request: data?.json?.request,
        response: `${data?.json?.response ?? ""}`,
        responseBody: data?.json?.responseBody,
        statusCode: data?.json?.statusCode
      },
      null,
      2
    )
  );
};

/* ----------------------------- MAIN CLASS ----------------------------- */
export class CloudEv {
  private HOST: string;
  private API_KEY: string;
  private MERCHANT_ID: string;
  private LOGGER: boolean;

  constructor(config: CloudEvConfig) {
    this.HOST = config.HOST;
    this.API_KEY = config.API_KEY;
    this.MERCHANT_ID = config.MERCHANT_ID;
    this.LOGGER = config.LOGGER || false;
  }

  /* -------------------------------- INFO APIs -------------------------------- */
  info = {
    /** GET /parks — зогсоол → станц → хушуу. Хушуу бүр tariff_id, price_now; зогсоол бүр tariffs. */
    list: (): Promise<CloudEvResult<ParkType[]>> => PARK_LIST(this.HOST, this.API_KEY, this.LOGGER),

    /** GET /park — зогсоолууд (станц / хушуугүй) */
    parkList: (): Promise<CloudEvResult<ParkT[]>> => PARK_INFO_LIST(this.HOST, this.API_KEY, this.LOGGER),

    /** GET /park/:id — зогсоолын дэлгэрэнгүй (+ tariffs) */
    park: (park_id: string): Promise<CloudEvResult<ParkType>> => PARK_INFO(this.HOST, this.API_KEY, this.LOGGER, park_id),

    /** POST /connector — QR-аас хушуу (+ tariff) */
    connectorByQR: (
      qr_value: string
    ): Promise<
      CloudEvResult<{
        park: ParkT;
        station: StationT;
        connector: ConnectorT;
        tariff: TariffT | null;
      }>
    > => CONNECTOR_BY_QR(this.HOST, this.API_KEY, this.LOGGER, qr_value),

    /**
     * POST /price — урьдчилсан үнэ (цагийн тарифын хилийг тооцсон).
     * kWh эсвэл amount-ийн аль нэгийг өгнө. Hold хийх дүн: data.max_amount.
     */
    price: (params: PriceParams): Promise<CloudEvResult<PriceResultT>> => PRICE(this.HOST, this.API_KEY, this.LOGGER, params)
  };

  session = {
    /** GET /session/info/:id — төлөв, хэмжилт, үнийн задаргаа (price_breakdown) */
    info: (session_id: string): Promise<CloudEvResult<SessionInfoType>> =>
      SESSION_INFO(this.HOST, this.API_KEY, this.LOGGER, session_id),

    /**
     * POST /session/start
     * Урьдчилж төлдөг урсгалд stop_price (₮) ашиглахыг зөвлөнө — эцсийн дүн яг stop_price болно.
     * Тогтмол машины зогсоолд info.plate_number заавал (алдааны code: PLATE_REQUIRED / CAR_NOT_ALLOWED …).
     */
    start: (params: SessionStartParams): Promise<CloudEvResult<SessionInfoType>> =>
      SESSION_START(this.HOST, this.API_KEY, this.LOGGER, params),

    /** POST /session/stop */
    stop: (session_id: string, reason?: string): Promise<CloudEvResult<SessionInfoType>> =>
      SESSION_STOP(this.HOST, this.API_KEY, this.LOGGER, session_id, reason)
  };

  invoice = {
    pay: (params: { session_id: string; invoice_id: string; paid_amount: number; tra_id: string }) =>
      INVOICE_PAY(this.HOST, this.API_KEY, this.LOGGER, params)
  };
}

export default CloudEv;
