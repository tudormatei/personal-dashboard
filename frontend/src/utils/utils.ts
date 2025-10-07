export const formatDate = (dateStr: string | undefined | null): string => {
  if (!dateStr) return "";

  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);

  return `${month}/${day}/${year}`;
};

export const formatNumber = (num: number | undefined | null): string => {
  if (!num) return "";

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
