import { useCallback, useEffect, useState } from "react";

interface Timer {
  initLimit: number; // in sec
  initStart: boolean;
}

function useTimer({ initStart = false, initLimit }: Timer) {
  const [time, setTime] = useState<number>(initLimit);
  const [start, setStart] = useState<boolean>(initStart);

  const reset = useCallback(() => {
        setTime(initLimit);
        setStart(initStart);
  }, [initLimit, initStart]);

  const startTimer = useCallback(() => {
    setStart(true);
  }, []);

  const stopTimer = useCallback(() => {
    setStart(false);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (start) {
      if (time > 0) {
        interval = setInterval(() => {
          setTime((limit) => limit - 1);
        }, 1000);
      }
    }
    return () => {
      clearInterval(interval);
    };
  }, [time, start]);

  return {
    time,
    reset,
    startTimer,
    stopTimer,
  };
}
export default useTimer;
