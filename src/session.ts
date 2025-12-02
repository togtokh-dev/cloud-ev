// src/session.ts
import { axiosMasterLogger } from "axios-master";
import { parseErr } from ".";
import { SessionInfoType } from "./types";

/**
 * GET /ev-central-system/v1/public/session/info/:session_id
 *
 * curl --location 'https://api.cloudhub.mn/ev-central-system/v1/public/session/info/9f7c7504-4c0f-4098-a33e-ba1b3b7bf25c' \
 * --header 'x-api-key: ...'
 */
export const SESSION_INFO = async (
  HOST: string,
  API_KEY: string,
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
      { name: "SESSION INFO", timeout: 20000 }
    );

    if (res?.success) {
      return { success: true, message: res.message, data: res.data };
    }

    return { success: false, message: res?.message || "failed" };
  } catch (error) {
    return { success: false, message: parseErr(error) };
  }
};

/**
 * POST /ev-central-system/v1/public/session/start
 *
 * curl --location 'https://api.cloudhub.mn/ev-central-system/v1/public/session/start' \
 * --header 'x-api-key: ...' \
 * --header 'Content-Type: application/json' \
 * --data '{ "connector_id": "8daa0f30-97d4-4ac3-85e3-0a65915d3828" }'
 */
export const SESSION_START = async (
  HOST: string,
  API_KEY: string,
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
      { name: "SESSION START", timeout: 20000 }
    );

    if (res?.success) {
      return { success: true, message: res.message, data: res.data };
    }

    return { success: false, message: res?.message || "failed" };
  } catch (error) {
    return { success: false, message: parseErr(error) };
  }
};

/**
 * POST /ev-central-system/v1/public/session/stop
 *
 * curl --location 'https://api.cloudhub.mn/ev-central-system/v1/public/session/stop' \
 * --header 'x-api-key: ...' \
 * --header 'Content-Type: application/json' \
 * --data '{ "session_id": "SESS-20251017-0001" }'
 */
export const SESSION_STOP = async (
  HOST: string,
  API_KEY: string,
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
      { name: "SESSION STOP", timeout: 20000 }
    );

    if (res?.success) {
      return { success: true, message: res.message, data: res.data };
    }

    return { success: false, message: res?.message || "failed" };
  } catch (error) {
    return { success: false, message: parseErr(error) };
  }
};

export default {
  SESSION_INFO,
  SESSION_START,
  SESSION_STOP
};
