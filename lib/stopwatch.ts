import { useState, useEffect } from "react";

export const useTimer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // This is a completely unnecessary feature
  const timeMultipliers = [1, 2, 5, 10, 0.5];
  const [timeScale, setTimeScale] = useState(timeMultipliers[0]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(
        () =>
          setElapsedTime(
            (prevElapsedTime) => prevElapsedTime + 0.1 * timeScale
          ),
        100
      );
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeScale]);

  // Max game length is 15 minutes. If the clock exceeds this, we should automatically clamp the value.
  // We might as well clamp the bottom too, to prevent a negative time value.
  useEffect(() => {
    // TODO: use game_length to clamp to elim game finish times, instead of assuming full 15 minutes.
    if (elapsedTime > 15 * 60) {
      setIsRunning(false);
      setElapsedTime(15 * 60);
    }
    if (elapsedTime < 0) {
      setElapsedTime(0);
    }
  }, [elapsedTime]);

  return {
    isRunning,
    setIsRunning,
    elapsedTime,
    setElapsedTime,
    timeScale,
    updateTimeScale: () =>
      setTimeScale((prev) => {
        const prevMultiplierIndex = timeMultipliers.indexOf(prev);
        const newMultiplierIndex =
          (prevMultiplierIndex + 1) % timeMultipliers.length;
        return timeMultipliers[newMultiplierIndex];
      }),
  };
};

export const useStopwatch = () => {
  const { isRunning, setIsRunning, elapsedTime, setElapsedTime } = useTimer();

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
  };

  return {
    elapsedTime: elapsedTime.toFixed(1),
    resetTimer: () => handleReset(),
    startTimer: () => setIsRunning(true),
    stopTimer: () => setIsRunning(false),
    isRunning,
  };
};
