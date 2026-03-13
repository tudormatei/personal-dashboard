import { useEffect, useState } from "react";
import { breakpoints } from "../constants/styling";
import { getMediaQuery } from "../utils/utils";

export const useIsPhone = () => {
  const query = getMediaQuery(breakpoints.phone);

  const [isPhone, setIsPhone] = useState(
    () => window.matchMedia(query).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(query);

    const handler = (e: MediaQueryListEvent) => {
      setIsPhone(e.matches);
    };

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [query]);

  return isPhone;
};
