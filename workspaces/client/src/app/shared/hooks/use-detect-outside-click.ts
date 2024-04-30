/**
 * @author Abhijit Baldawa
 */

import React, { useEffect, useState } from "react";

/**
 * This hook detects whether the user has clicked outside or inside
 * the observed DOM container.
 *
 * @param domElementRef
 */
export const useDetectOutsideClick = (
  domElementRef: React.RefObject<HTMLElement>
) => {
  const [clickedOutside, setClickedOutside] = useState<boolean>();

  useEffect(() => {
    const checkAndHandleOutsideClick = (e: MouseEvent) => {
      if (domElementRef.current?.contains(e.target as Node)) {
        setClickedOutside(false);
      } else {
        setClickedOutside(true);
      }
    };

    document.addEventListener("mousedown", checkAndHandleOutsideClick);
    return () =>
      document.removeEventListener("mousedown", checkAndHandleOutsideClick);
  }, [domElementRef]);

  return clickedOutside;
};
