import { useCallback, useEffect, useLayoutEffect, useState } from "react";

const useKeyDownAndUpListener = (shouldRun: boolean = true, length: number) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    if (shouldRun) {
      setActiveIndex(0);
    }
  }, [shouldRun]);

  const eventHandler = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        setActiveIndex((activeIndex - 1 + length) % length);
        event.preventDefault();
      } else if (event.key === "ArrowDown") {
        setActiveIndex((activeIndex + 1) % length);
        event.preventDefault();
      }
    },
    [activeIndex, length]
  );

  useEffect(() => {
    if (shouldRun) {
      window.addEventListener("keydown", eventHandler);
      return () => window.removeEventListener("keydown", eventHandler);
    }
  }, [eventHandler, shouldRun]);

  return { activeIndex };
};

export default useKeyDownAndUpListener;
