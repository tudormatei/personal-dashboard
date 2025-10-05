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
