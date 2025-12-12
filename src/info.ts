// src/info.ts
import { axiosMasterLogger } from "axios-master";
import type { ConnectorT, ParkT, ParkType, StationT } from "./types";
import { logAxios, parseErr } from ".";

/* ----------------------------- /parks ----------------------------- */
// GET /parks
export const PARK_LIST = async (
  HOST: string,
  API_KEY: string,
  LOGGER = false
): Promise<{ success: boolean; message: string; data?: ParkType[] }> => {
  try {
    const res = await axiosMasterLogger(
      {
        method: "GET",
        url: `${HOST}/ev-central-system/v1/public/parks`,
        headers: {
          "x-api-key": API_KEY
        }
      },
      {
        name: "PARK LIST",
        timeout: 20000,
        logger: logAxios(LOGGER, "PARK LIST")
      }
    );

    if (res?.success && Array.isArray(res.data)) {
      return { success: true, message: res.message, data: res.data };
    }

    return { success: false, message: res?.message || "failed", data: [] };
  } catch (error) {
    return { success: false, message: parseErr(error), data: [] };
  }
};

/* ----------------------------- /park (list only) ----------------------------- */
// GET /park
export const PARK_INFO_LIST = async (
  HOST: string,
  API_KEY: string,
  LOGGER = false
): Promise<{ success: boolean; message: string; data?: ParkT[] }> => {
  try {
    const res = await axiosMasterLogger(
      {
        method: "GET",
        url: `${HOST}/ev-central-system/v1/public/park`,
        headers: {
          "x-api-key": API_KEY
        }
      },
      {
        name: "PARK INFO LIST",
        timeout: 20000,
        logger: logAxios(LOGGER, "PARK INFO LIST")
      }
    );

    if (res?.success && Array.isArray(res.data)) {
      return { success: true, message: res.message, data: res.data };
    }

    return { success: false, message: res?.message || "failed", data: [] };
  } catch (error) {
    return { success: false, message: parseErr(error), data: [] };
  }
};

/* ----------------------------- /park/:id ----------------------------- */
// GET /park/:id
export const PARK_INFO = async (
  HOST: string,
  API_KEY: string,
  LOGGER = false,
  park_id: string
): Promise<{ success: boolean; message: string; data?: ParkType }> => {
  try {
    const res = await axiosMasterLogger(
      {
        method: "GET",
        url: `${HOST}/ev-central-system/v1/public/park/${park_id}`,
        headers: {
          "x-api-key": API_KEY
        }
      },
      {
        name: "PARK INFO",
        timeout: 20000,
        logger: logAxios(LOGGER, "PARK INFO")
      }
    );

    if (res?.success) {
      return { success: true, message: res.message, data: res.data };
    }

    return { success: false, message: res?.message || "failed" };
  } catch (error) {
    return { success: false, message: parseErr(error) };
  }
};

/* ----------------------------- /connector ----------------------------- */
// POST /connector
export const CONNECTOR_BY_QR = async (
  HOST: string,
  API_KEY: string,
  LOGGER = false,
  qr_value: string
): Promise<{
  success: boolean;
  message: string;
  data?: {
    park: ParkT;
    station: StationT;
    connector: ConnectorT;
  };
}> => {
  try {
    const res = await axiosMasterLogger(
      {
        method: "POST",
        url: `${HOST}/ev-central-system/v1/public/connector`,
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json"
        },
        data: { qr_value }
      },
      {
        name: "CONNECTOR BY QR",
        timeout: 20000,
        logger: logAxios(LOGGER, "CONNECTOR BY QR")
      }
    );

    if (res?.success) {
      return { success: true, message: res.message, data: res.data };
    }

    return { success: false, message: res?.message || "failed" };
  } catch (error) {
    return { success: false, message: parseErr(error) };
  }
};

/* ----------------------------- /price ----------------------------- */
// POST /price
export const PRICE = async (
  HOST: string,
  API_KEY: string,
  LOGGER = false,
  params: { amount: number; kWh: number; connector_id: string }
): Promise<{
  success: boolean;
  message: string;
  data?: {
    amount: number;
    kwh: number;
    time: number;
  };
}> => {
  try {
    const res = await axiosMasterLogger(
      {
        method: "POST",
        url: `${HOST}/ev-central-system/v1/public/price`,
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json"
        },
        data: params
      },
      {
        name: "PRICE",
        timeout: 20000,
        logger: logAxios(LOGGER, "PRICE")
      }
    );

    if (res?.success) {
      return { success: true, message: res.message, data: res.data };
    }

    return { success: false, message: res?.message || "failed" };
  } catch (error) {
    return { success: false, message: parseErr(error) };
  }
};

/* ----------------------------- EXPORT ----------------------------- */
export default {
  PARK_LIST,
  PARK_INFO_LIST,
  PARK_INFO,
  CONNECTOR_BY_QR,
  PRICE
};
