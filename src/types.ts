// ------------ Status types ------------
export type StationStatusType = "Offline" | "Available";

export type ConnectorStatusType =
  | "Available"
  | "Preparing"
  | "Charging"
  | "SuspendedEV"
  | "SuspendedEVSE"
  | "Finishing"
  | "Reserved"
  | "Unavailable"
  | "Faulted"
  | "Offline";

export type SessionStatusType =
  | "created"
  | "running"
  | "stopping"
  | "stopped"
  | "invoiced"
  | "paid"
  | "failed"
  | "done";

// ------------ Base types (NOT literals!) ------------

export type ParkT = {
  id: string;
  merchant_id: string;
  name: string;
  location_text: string;
  image: string;
  contact_phonenumber: string;
  geo_lat: number;
  geo_lng: number;
  active: boolean;
};

export type StationT = {
  id: string;
  cp_id: string;
  park_id: string;
  merchant_id: string;
  name: string;
  charge_point_vendor: string;
  charge_point_model: string;
  serial_number: string;
  firmware_version: string;
  ocpp_protocol: string;
  endpoint_path: string;
  last_heartbeat_at: string; // ISO datetime
  status: StationStatusType;
  meta: any;
};

export type ConnectorT = {
  id: string;
  merchant_id: string;
  park_id: string;
  station_id: string;
  connector_id: number;
  connector_type:
    | "Type 1 J1772"
    | "Type 2 Mennekes"
    | "CHAdeMO"
    | "CCS Combo Type 1"
    | "CCS Combo Type 2"
    | "GB/T"
    | "Tesla Supercharger";
  format: "Socket" | "Cable";
  current_type: "AC" | "DC";
  power_kw: number;
  kw_price: number;
  status: ConnectorStatusType;
  last_status_at: string; // ISO datetime
  meta: any;
  qr_value: string;
  active: boolean;
};

// ------------ Nested type ------------

export type StationWithConnectors = StationT & {
  connectors: ConnectorT[];
};

export type ParkType = ParkT & {
  stations: StationWithConnectors[];
};
export type SessionInfoType = {
  id: string;
  tag_id: string | null;
  txn_id: number | null;
  park: {
    id: string;
    name: string;
    station: {
      id: string;
      name: string;
      connector: {
        id: string;
        number: number;
      };
    };
  };
  status:
    | "created" // invoice үүссэн
    | "running" // цэнэглэж байна
    | "stopping" // цэнэглэлт зогсож байна
    | "stopped" // цэнэглэлт зогссон
    | "invoiced" // төлбөрийн нэхэмжилэл үүссэн
    | "paid" // төлбөн
    | "failed" // алдаа гарсан
    | "done"; // дууссан
  invoice: {
    invoice_id: string;
    method: string;
    amount: number;
  } | null;
  started_at: string | null;
  stopped_at: string | null;
  total_kwh: number | null;
  total_minutes: number | null;
  total_amount: number | null;
  info: {
    meter_start: number | null;
    meter_stop: number | null;
    energy_wh: number | null;
    last_meter_ts: string | null;
    last_import_wh: number | null;
    last_export_wh: number | null;
    last_import_interval_wh: number | null;
    last_export_interval_wh: number | null;
    last_power_w: number | null;
    last_power_offered_w: number | null;
    last_current_a: number | null;
    last_current_offered_a: number | null;
    last_voltage_v: number | null;
    last_frequency_hz: number | null;
    last_power_factor: number | null;
    phase: {
      v_l1n: number | null;
      v_l2n: number | null;
      v_l3n: number | null;
      i_l1: number | null;
      i_l2: number | null;
      i_l3: number | null;
    };
    last_soc_pct: number | null;
    last_temp_c: number | null;
    sample_counts: {
      total: number;
      clock: number;
      periodic: number;
      trigger: number;
      txn_begin: number;
      txn_end: number;
      interruption_begin: number;
      interruption_end: number;
    };
  };
};
