export const formatDate = (dateStr: string | undefined | null): string => {
  if (!dateStr) return "";

  const dateOnly = dateStr.split("T")[0].split(" ")[0];
  const clean = dateOnly.replace(/\D/g, "");

  const year = clean.slice(0, 4);
  const month = clean.slice(4, 6);
  const day = clean.slice(6, 8);

  return `${day}/${month}/${year}`;
};

export const formatDateDayMonth = (
  dateStr: string | undefined | null
): string => {
  if (!dateStr) return "";

  const dateOnly = dateStr.split("T")[0].split(" ")[0];
  const clean = dateOnly.replace(/\D/g, "");

  const month = clean.slice(4, 6);
  const day = clean.slice(6, 8);

  return `${day}/${month}`;
};

export const formatNumber = (
  num: number | undefined | null,
  round = false
): string => {
  if (!num) return "0";

  if (round) {
    num = parseFloat(num.toFixed(2));

    if (!num) return "0";
  }

  return num.toLocaleString("en-US");
};

export const formatDateReadable = (d: string | undefined) => {
  if (!d) return "";

  const clean = d.replace(/-/g, "");

  if (clean.length !== 8) return "";

  const year = parseInt(clean.slice(0, 4), 10);
  const month = parseInt(clean.slice(4, 6), 10) - 1;
  const day = parseInt(clean.slice(6, 8), 10);

  const date = new Date(year, month, day);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
