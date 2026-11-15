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

// ------------ Response envelope ------------

/** Бүх method-ийн хариу. Алдаа гарвал success=false, code-оор ялгана (жишээ нь "CAR_NOT_ALLOWED"). */
export type CloudEvResult<T> = {
  success: boolean;
  message: string;
  /** Серверийн код: "SUCCESS", "200", "VALIDATION_ERROR", "CAR_NOT_ALLOWED" … */
  code?: string;
  data?: T;
};

/** session/start-ийн алдааны кодууд (message-ийг хэрэглэгчид шууд харуулж болно) */
export type SessionStartErrorCode =
  | "400" // оролт буруу / хушуу залгаагүй
  | "404" // хушуу / станц олдсонгүй
  | "409" // цэнэглэгч offline эсвэл хушуун дээр идэвхтэй цэнэглэлт байна
  | "PLATE_REQUIRED" // тогтмол машины зогсоол — info.plate_number заавал
  | "VEHICLE_NOT_FOUND" // улсын дугаараар машин олдсонгүй
  | "CAR_NOT_ALLOWED" // машины марк энэ зогсоолд зөвшөөрөгдөөгүй
  | "VEHICLE_CHECK_UNAVAILABLE" // машины мэдээлэл шалгах үйлчилгээ түр ажиллахгүй
  | "PRICE_NOT_SET"; // тариф тохируулаагүй тул stop_price ашиглах боломжгүй

// ------------ Tariff (цагийн тариф) ------------

/** Тарифын интервал: start–end хооронд 1 кВт·ц = kw_price₮. end < start бол шөнө дундыг давна, "24:00" = өдрийн төгсгөл. Монголын цаг (UTC+8). */
export type TariffPeriodT = {
  start: string; // "HH:mm"
  end: string; // "HH:mm" | "24:00"
  kw_price: number;
};

export type TariffT = {
  id: string;
  name: string;
  /** Байгууллагын үндсэн тариф */
  is_default: boolean;
  currency: string;
  periods: TariffPeriodT[];
  /** Одоогийн 1 кВт·ц-ын үнэ */
  price_now: number | null;
  price_min: number | null;
  price_max: number | null;
};

/** Цаг бүрийн задаргаа: from–to хооронд kwh кВт·ц, amount ₮ */
export type PriceBreakdownRowT = {
  from: string; // ISO
  to: string; // ISO
  /** Тарифын интервал, жишээ "22:00–07:00" */
  period: string;
  kw_price: number;
  kwh: number;
  amount: number;
};

// ------------ Base types (NOT literals!) ------------

export type CarMakeT = { id: number; slug: string; name: string };

export type ParkT = {
  id: string;
  merchant_id: string;
  name: string;
  location_text: string;
  image: string;
  contact_phonenumber: string;
  geo_lat: number;
  geo_lng: number;
  white_list: string[];
  active: boolean;
  /** Тогтмол машин цэнэглэх: зөвхөн allowed_makes маркийн машин. session.start-д info.plate_number заавал. */
  fixed_car_charge?: boolean;
  allowed_makes?: CarMakeT[];
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
  /** Нийтлэг (харуулах) үнэ — төлбөрийн тооцоонд ОРОХГҮЙ. Бодит үнэ: tariff_id / price_now. */
  kw_price: number;
  /** Энэ хушуунд үйлчлэх тариф (оноогоогүй бол байгууллагын үндсэн тариф) */
  tariff_id: string | null;
  /** Тарифаар одоогийн 1 кВт·ц-ын үнэ */
  price_now: number | null;
  status: ConnectorStatusType;
  last_status_at: string; // ISO datetime
  meta: any;
  qr_value: string;
  qr_fixed_value: string;
  active: boolean;
  is_test: boolean;
};

// ------------ Nested type ------------

export type StationWithConnectors = StationT & {
  connectors: ConnectorT[];
};

export type ParkType = ParkT & {
  stations: StationWithConnectors[];
  /** Энэ зогсоолын хушуунуудын тарифууд (connector.tariff_id-аар холбоно) */
  tariffs: TariffT[];
};

// ------------ Price (POST /price) ------------

/** kWh эсвэл amount-ийн аль нэг нь заавал */
export type PriceParams = {
  connector_id: string;
  /** Цэнэглэх кВт·ц */
  kWh?: number;
  /** Цэнэглэх дүн (₮) */
  amount?: number;
  /** Цэнэглэх хурд (кВт). Өгөөгүй бол хушууны power_kw */
  power_kw?: number;
  /** Эхлэх цаг (ISO). Өгөөгүй бол одоо */
  start_at?: string;
};

export type PriceResultT = {
  /** Тооцоолсон дүн (₮) — цагийн тарифын хилийг тооцсон */
  amount: number;
  kwh: number;
  /** Минут (хурд мэдэгдэхгүй бол null) */
  time: number | null;
  currency: string;
  start_at: string;
  end_at: string | null;
  power_kw: number | null;
  tariff: { id: string | null; name: string; periods: TariffPeriodT[] };
  price_now: number | null;
  price_min: number | null;
  price_max: number | null;
  /** Hold хийх дүн: kWh-ээр → kWh × хамгийн өндөр үнэ; amount-аар → amount */
  max_amount: number;
  /** amount-аар асуусан бол хамгийн муу тохиолдолд авах кВт·ц */
  min_kwh: number;
  breakdown: PriceBreakdownRowT[];
  /** true бол хурд мэдэгдэхгүй тул бүгдийг эхлэх үеийн үнээр тооцсон */
  assumed_start_price: boolean;
  /** true бол тооцооны хугацааны хязгаарт хүрсэн */
  truncated: boolean;
};

// ------------ Session ------------

export type ClientInfoT = {
  /** Улсын дугаар — fixed_car_charge зогсоолд заавал */
  plate_number?: string | null;
  user_id?: string | null;
  phone?: string | null;
  email?: string | null;
};

export type SessionStartParams = {
  connector_id: string;
  /** кВт·ц-д хүрэхэд зогсооно. stop_price-тэй хамт өгөхгүй. */
  stop_kw?: number;
  /**
   * Дүн (₮)-д хүрэхэд зогсооно — урьдчилж төлдөг урсгалд ЗӨВЛӨНӨ.
   * Цагийн тарифаар хуримтлагдсан дүнгээр шалгаж, эцсийн дүнг яг stop_price болгоно.
   */
  stop_price?: number;
  id_tag?: string;
  note?: string;
  is_white_list?: boolean;
  info?: ClientInfoT;
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
  /** Эцсийн төлөх дүн (₮). price_breakdown-ийн amount-уудын нийлбэртэй тэнцүү. */
  total_amount: number | null;

  stop_kw?: number | null;
  stop_price?: number | null;
  client_info?: (ClientInfoT & {
    vehicle?: { make: string | null; model: string | null; build_year: number | null; vin: string | null } | null;
  }) | null;
  /** Энэ session-д үйлчилсэн тариф (эхлэх үеийн хуулбар). Хуучин session-д null. */
  tariff?: { id: string | null; name: string; periods: TariffPeriodT[] } | null;
  /** Одоогийн 1 кВт·ц-ын үнэ */
  price_now?: number | null;
  /** Аль цагийн хооронд хэдэн кВт·ц, хэдэн ₮ */
  price_breakdown?: PriceBreakdownRowT[];
  /** Хязгаараар (stop_price / stop_kw) эсвэл эцсийн тоолуураар тааруулсан бол бодит утга */
  price_adjusted?: { by: "stop_price" | "stop_kw" | "meter"; real_kwh: number; real_amount: number } | null;

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
