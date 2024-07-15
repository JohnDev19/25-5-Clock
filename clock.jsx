const Clock = () => {
  const [breakLength, setBreakLength] = React.useState(5);
  const [sessionLength, setSessionLength] = React.useState(25);
  const [timeLeft, setTimeLeft] = React.useState(25 * 60);
  const [timerLabel, setTimerLabel] = React.useState("Session");
  const [isRunning, setIsRunning] = React.useState(false);
  const [intervalId, setIntervalId] = React.useState(null);

  const audioElement = React.useRef(null);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleBreakDecrement = () => {
    if (breakLength > 1 && !isRunning) {
      setBreakLength(breakLength - 1);
    }
  };

  const handleBreakIncrement = () => {
    if (breakLength < 60 && !isRunning) {
      setBreakLength(breakLength + 1);
    }
  };

  const handleSessionDecrement = () => {
    if (sessionLength > 1 && !isRunning) {
      setSessionLength(sessionLength - 1);
      setTimeLeft((sessionLength - 1) * 60);
    }
  };

  const handleSessionIncrement = () => {
    if (sessionLength < 60 && !isRunning) {
      setSessionLength(sessionLength + 1);
      setTimeLeft((sessionLength + 1) * 60);
    }
  };

  const handleReset = () => {
    clearInterval(intervalId);
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setTimerLabel("Session");
    audioElement.current.pause();
    audioElement.current.currentTime = 0;
  };

  const handleStartStop = () => {
    if (!isRunning) {
      setIsRunning(true);
      setIntervalId(setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000));
    } else {
      clearInterval(intervalId);
      setIsRunning(false);
    }
  };

  React.useEffect(() => {
    if (timeLeft === 0) {
      audioElement.current.play();
      if (timerLabel === "Session") {
        setTimerLabel("Break");
        setTimeLeft(breakLength * 60);
      } else {
        setTimerLabel("Session");
        setTimeLeft(sessionLength * 60);
      }
    }
  }, [timeLeft, timerLabel, breakLength, sessionLength]);

  React.useEffect(() => {
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="clock-container">
      <h1 className="title">25 + 5 Clock</h1>
      <div className="length-controls">
        <div className="break-controls">
          <h2 id="break-label">Break Length</h2>
          <button id="break-decrement" onClick={handleBreakDecrement}>-</button>
          <span id="break-length">{breakLength}</span>
          <button id="break-increment" onClick={handleBreakIncrement}>+</button>
        </div>
        <div className="session-controls">
          <h2 id="session-label">Session Length</h2>
          <button id="session-decrement" onClick={handleSessionDecrement}>-</button>
          <span id="session-length">{sessionLength}</span>
          <button id="session-increment" onClick={handleSessionIncrement}>+</button>
        </div>
      </div>
      <div className="timer">
        <h2 id="timer-label">{timerLabel}</h2>
        <div id="time-left" className="time-display">{formatTime(timeLeft)}</div>
      </div>
      <div className="timer-controls">
        <button id="start_stop" onClick={handleStartStop}>{isRunning ? "Pause" : "Start"}</button>
        <button id="reset" onClick={handleReset}>Reset</button>
      </div>
      <audio 
        id="beep" 
        ref={audioElement}
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        preload="auto"
      />
    </div>
  );
};

ReactDOM.render(<Clock />, document.getElementById("root"));
