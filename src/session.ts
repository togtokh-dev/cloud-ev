// src/session.ts
import { axiosMasterLogger } from "axios-master";
import { logAxios, parseErr } from ".";
import { SessionInfoType } from "./types";

/* ----------------------------- /session/info ----------------------------- */
/**
 * GET /ev-central-system/v1/public/session/info/:session_id
 */
export const SESSION_INFO = async (
  HOST: string,
  API_KEY: string,
  LOGGER = false,
  session_id: string
): Promise<{ success: boolean; message: string; data?: SessionInfoType }> => {
  try {
    const res = await axiosMasterLogger(
      {
        method: "GET",
        url: `${HOST}/ev-central-system/v1/public/session/info/${session_id}`,
        headers: {
          "x-api-key": API_KEY
        }
      },
      {
        name: "SESSION INFO",
        timeout: 20000,
        logger: logAxios(LOGGER, "SESSION INFO")
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

/* ----------------------------- /session/start ----------------------------- */
/**
 * POST /ev-central-system/v1/public/session/start
 */
export const SESSION_START = async (
  HOST: string,
  API_KEY: string,
  LOGGER = false,
  params: {
    connector_id: string;
    stop_kw?: number;
    id_tag?: string;
  }
): Promise<{ success: boolean; message: string; data?: SessionInfoType }> => {
  try {
    const res = await axiosMasterLogger(
      {
        method: "POST",
        url: `${HOST}/ev-central-system/v1/public/session/start`,
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json"
        },
        data: params
      },
      {
        name: "SESSION START",
        timeout: 20000,
        logger: logAxios(LOGGER, "SESSION START")
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

/* ----------------------------- /session/stop ----------------------------- */
/**
 * POST /ev-central-system/v1/public/session/stop
 */
export const SESSION_STOP = async (
  HOST: string,
  API_KEY: string,
  LOGGER = false,
  session_id: string
): Promise<{ success: boolean; message: string; data?: SessionInfoType }> => {
  try {
    const res = await axiosMasterLogger(
      {
        method: "POST",
        url: `${HOST}/ev-central-system/v1/public/session/stop`,
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json"
        },
        data: { session_id }
      },
      {
        name: "SESSION STOP",
        timeout: 20000,
        logger: logAxios(LOGGER, "SESSION STOP")
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
  SESSION_INFO,
  SESSION_START,
  SESSION_STOP
};
