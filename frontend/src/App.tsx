import { useEffect, useState } from "react";

function App() {
  const [socket, setSocket] = useState<WebSocket>();
  const [messages, setMessages] = useState<string[]>(["Hi there"]);
  const [message, setMessage] = useState<string>("");

  function sendMessage() {
    if (!socket) return;
    if (message === "") return;

    setMessages((m) => [...m, message]);

    socket.send(
      JSON.stringify({
        type: "chat",
        payload: {
          message,
        },
      })
    );
  }

  useEffect(function () {
    const ws = new WebSocket("ws:localhost:8000");
    setSocket(ws);

    // ws.onerror = () => {};

    // ws.onclose = () => {};

    // ws.onopen = () => {};

    ws.onmessage = (mEvent) => {
      setMessages((m) => [...m, mEvent.data]);
    };

    return () => {
      ws.close(); // 👈 ensures the duplicate is cleaned up
    };
  }, []);

  return (
    <div className="h-screen bg-black flex flex-col">
      <div className="h-[90vh] bg-white m-10 rounded-md p-5 overflow-y-scroll">
        <ul>
          {messages.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </div>
      <div className="flex gap-5 w-full px-10 py-5">
        <input
          className="rounded-lg w-[80%]"
          type="text"
          placeholder="Message..."
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="bg-purple-600 text-white rounded-lg w-[20%]"
          onClick={sendMessage}
        >
          Send Message
        </button>
      </div>
    </div>
  );
}

export default App;
