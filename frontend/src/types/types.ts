export type AlertType = "error" | "success" | "info" | "warning";

export type AlertData = {
  text: string;
  type: AlertType;
};
