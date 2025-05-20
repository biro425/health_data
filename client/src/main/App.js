import "./App.css";
import axios from "axios";
import { useState } from "react";
import Routing from "./components/Routing";
function App() {
  const [chatLog, setChatLog] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  const askGpt = async (content) => {
    const apiKey = "API_KEY_HERE";

    try {
      setIsLoading(true);

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "너는 AI의사야. 환자가 입력한 증상에 대한 진단을 내려줘. 답변의 형식은 '그런 증상이 지속된다면'이라며 말을 시작하고, 병명과 증상을 알려줘. 너무 극단적이기 보단 증상에 걸치는 가벼운 병을 위주로 추천해줘. 정말 극단적이여야 할때는 제대로 말해줘.",
            },
            { role: "user", content },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const answer = response.data.choices[0].message.content;

      setChatLog((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch (error) {
      console.error("에러 발생:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setChatLog((prev) => [...prev, { role: "user", content: trimmed }]);
    askGpt(trimmed);
    setInput("");
  };

  return (
    <div className="main-container">
      <header className="main-header">
        <div className="logo">logo</div>
        <nav className="main-nav">
          <a href="/">홈</a>
          <a href="/hospital">주변 병원 찾기</a>
          <a href="/menu">메뉴</a>
          <a href="/profile">프로필</a>
          <a href="/help">도움말</a>
        </nav>
        <button className="login-btn">로그인</button>
      </header>

      <main className="chat-container">
        <div className="chat-box">
          {chatLog.length === 0 && <Routing />}
          {chatLog.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-bubble ${
                msg.role === "user" ? "user" : "assistant"
              }`}
            >
              {msg.content}
            </div>
          ))}
          {isLoading && (
            <div className="chat-bubble assistant">답변 생성 중...</div>
          )}
        </div>

        <div className="symptom-box">
          <input
            className="symptom-input"
            type="text"
            placeholder="자신의 증상을 입력해보세요."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            onKeyUp={(e) => {
              if (e.key === "Enter" && !isComposing) {
                handleSubmit();
              }
            }}
          />
          <button className="symptom-btn" onClick={handleSubmit} />
        </div>
      </main>
    </div>
  );
}

export default App;
