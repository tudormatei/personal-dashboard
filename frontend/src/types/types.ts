export type AlertType = "error" | "success" | "info" | "warning";

export type AlertData = {
  text: string;
  type: AlertType;
};

export type CategoryName =
  | "Food"
  | "Health & Fitness"
  | "Travel"
  | "Transport"
  | "Shopping"
  | "Entertainment"
  | "Career"
  | "Bills";
