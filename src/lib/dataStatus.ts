export type DataStatus =
  | "live"
  | "demo"
  | "hybrid"
  | "pending"
  | "missing_config"
  | "error"
  | "empty";

export type DataMode = "demo" | "live" | "hybrid";

export type AdapterResult<T> = {
  status: Exclude<DataStatus, "hybrid">;
  source: string;
  updatedAt?: string;
  data: T;
  error?: string;
};

export function isOkStatus(status: DataStatus) {
  return status === "live" || status === "demo";
}

