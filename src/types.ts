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

// Park + түүний Station-ууд + Station бүрийн Connector-ууд
export type ParkType = ParkT & {
  stations: (StationT[] & {
    connectors: ConnectorT[];
  })[];
};
