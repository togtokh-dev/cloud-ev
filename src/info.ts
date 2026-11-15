// src/info.ts
import { axiosMasterLogger } from "axios-master";
import type { CloudEvResult, ConnectorT, ParkT, ParkType, PriceParams, PriceResultT, StationT, TariffT } from "./types";
import { logAxios, parseErr, parseErrCode } from ".";

/* ----------------------------- /parks ----------------------------- */
// GET /parks — зогсоол → станц → хушуу (+ tariffs)
export const PARK_LIST = async (HOST: string, API_KEY: string, LOGGER = false): Promise<CloudEvResult<ParkType[]>> => {
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
      return { success: true, message: res.message, code: res.code, data: res.data };
    }

    return { success: false, message: res?.message || "failed", code: res?.code, data: [] };
  } catch (error) {
    return { success: false, message: parseErr(error), code: parseErrCode(error), data: [] };
  }
};

/* ----------------------------- /park ----------------------------- */
// GET /park — зогсоолууд (станц / хушуугүй)
export const PARK_INFO_LIST = async (HOST: string, API_KEY: string, LOGGER = false): Promise<CloudEvResult<ParkT[]>> => {
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
      return { success: true, message: res.message, code: res.code, data: res.data };
    }

    return { success: false, message: res?.message || "failed", code: res?.code, data: [] };
  } catch (error) {
    return { success: false, message: parseErr(error), code: parseErrCode(error), data: [] };
  }
};

/* ----------------------------- /park/:id ----------------------------- */
// GET /park/:id — зогсоол → станц → хушуу (+ tariffs)
export const PARK_INFO = async (HOST: string, API_KEY: string, LOGGER = false, park_id: string): Promise<CloudEvResult<ParkType>> => {
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
      return { success: true, message: res.message, code: res.code, data: res.data };
    }

    return { success: false, message: res?.message || "failed", code: res?.code };
  } catch (error) {
    return { success: false, message: parseErr(error), code: parseErrCode(error) };
  }
};

/* ----------------------------- /connector ----------------------------- */
// POST /connector — QR-аас хушуу (+ тариф)
export const CONNECTOR_BY_QR = async (
  HOST: string,
  API_KEY: string,
  LOGGER = false,
  qr_value: string
): Promise<
  CloudEvResult<{
    park: ParkT;
    station: StationT;
    connector: ConnectorT;
    /** Хушуунд үйлчлэх тариф */
    tariff: TariffT | null;
  }>
> => {
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
      return { success: true, message: res.message, code: res.code, data: res.data };
    }

    return { success: false, message: res?.message || "failed", code: res?.code };
  } catch (error) {
    return { success: false, message: parseErr(error), code: parseErrCode(error) };
  }
};

/* ----------------------------- /price ----------------------------- */
// POST /price — урьдчилсан үнэ (цагийн тарифын хилийг тооцсон)
export const PRICE = async (HOST: string, API_KEY: string, LOGGER = false, params: PriceParams): Promise<CloudEvResult<PriceResultT>> => {
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
      return { success: true, message: res.message, code: res.code, data: res.data };
    }

    return { success: false, message: res?.message || "failed", code: res?.code };
  } catch (error) {
    return { success: false, message: parseErr(error), code: parseErrCode(error) };
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
