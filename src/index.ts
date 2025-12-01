// src/index.ts
import type { ParkT, ParkType, StationT, ConnectorT } from "./types";
import {
  PARK_LIST,
  PARK_INFO_LIST,
  PARK_INFO,
  CONNECTOR_BY_QR,
  PRICE
} from "./info";
import { INVOICE_PAY } from "./invoice";
import { SESSION_INFO, SESSION_START, SESSION_STOP } from "./session";

export interface CloudEvConfig {
  HOST: string;
  API_KEY: string;
  MERCHANT_ID: string;
}

/* ----------------------------- Helper error parser ----------------------------- */
export function parseErr(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as any).response === "object"
  ) {
    const err = error as any;
    return err.response?.data?.message || "error";
  }
  return "unexpected error";
}

/* ----------------------------- MAIN CLASS ----------------------------- */
export class CloudEv {
  private HOST: string;
  private API_KEY: string;
  private MERCHANT_ID: string;

  constructor(config: CloudEvConfig) {
    this.HOST = config.HOST;
    this.API_KEY = config.API_KEY;
    this.MERCHANT_ID = config.MERCHANT_ID;
  }

  /* -------------------------------- INFO APIs -------------------------------- */
  info = {
    // GET /parks
    list: (): Promise<{
      success: boolean;
      message: string;
      data?: ParkType[];
    }> => PARK_LIST(this.HOST, this.API_KEY),

    // GET /park
    parkList: (): Promise<{
      success: boolean;
      message: string;
      data?: ParkT[];
    }> => PARK_INFO_LIST(this.HOST, this.API_KEY),

    // GET /park/:id
    park: (
      park_id: string
    ): Promise<{
      success: boolean;
      message: string;
      data?: ParkType;
    }> => PARK_INFO(this.HOST, this.API_KEY, park_id),

    // POST /connector
    connectorByQR: (
      qr_value: string
    ): Promise<{
      success: boolean;
      message: string;
      data?: {
        park: ParkT;
        station: StationT;
        connector: ConnectorT;
      };
    }> => CONNECTOR_BY_QR(this.HOST, this.API_KEY, qr_value),

    // POST /price
    price: (params: {
      amount: number;
      kWh: number;
      connector_id: string;
    }): Promise<{
      success: boolean;
      message: string;
      data?: { amount: number; kwh: number; time: number };
    }> => PRICE(this.HOST, this.API_KEY, params)
  };
  session = {
    info: (session_id: string) =>
      SESSION_INFO(this.HOST, this.API_KEY, session_id),

    start: (connector_id: string, stop_kw?: number) =>
      SESSION_START(this.HOST, this.API_KEY, connector_id, stop_kw),

    stop: (session_id: string) =>
      SESSION_STOP(this.HOST, this.API_KEY, session_id)
  };
  invoice = {
    pay: (params: {
      session_id: string;
      invoice_id: string;
      paid_amount: number;
      tra_id: string;
    }) => INVOICE_PAY(this.HOST, this.API_KEY, params)
  };
}

export default CloudEv;
