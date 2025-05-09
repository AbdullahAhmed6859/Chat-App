import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [socket, setSocket] = useState<WebSocket>();
  const inputRef = useRef<HTMLInputElement>(null);

  function sendMessage() {
    if (!socket) return;
    const message = inputRef.current?.value;
    socket.send(message ?? "");
  }
  function ping() {
    socket?.send("ping");
  }

  useEffect(function () {
    const ws = new WebSocket("ws:localhost:8000");
    setSocket(ws);

    // ws.onerror = () => {};

    // ws.onclose = () => {};

    // ws.onopen = () => {};

    ws.onmessage = (mEvent) => {
      alert(mEvent.data);
    };
  }, []);

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Message..." />
      <button onClick={sendMessage}>Send</button>
      <button onClick={ping}>ping</button>
    </div>
  );
}

export default App;
