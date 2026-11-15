// src/invoice.ts
import { axiosMasterLogger } from "axios-master";
import { logAxios, parseErr, parseErrCode } from ".";
import type { CloudEvResult } from "./types";

export const INVOICE_PAY = async (
  HOST: string,
  API_KEY: string,
  LOGGER = false,
  params: {
    session_id: string;
    invoice_id: string;
    paid_amount: number;
    tra_id: string;
  }
): Promise<CloudEvResult<{ id: string }>> => {
  try {
    const res = await axiosMasterLogger(
      {
        method: "POST",
        url: `${HOST}/ev-central-system/v1/public/invoice/pay`,
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json"
        },
        data: params
      },
      {
        name: "INVOICE PAY",
        timeout: 20000,
        logger: logAxios(LOGGER, "INVOICE PAY")
      }
    );

    if (res?.success) {
      return {
        success: true,
        message: res.message,
        code: res.code,
        data: res.data
      };
    }

    return {
      success: false,
      message: res?.message || "failed",
      code: res?.code
    };
  } catch (error) {
    return { success: false, message: parseErr(error), code: parseErrCode(error) };
  }
};

export default {
  INVOICE_PAY
};
