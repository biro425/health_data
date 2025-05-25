import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Hospital from "../hospital/hospital";
import Profile from "../profile/Profile";
import Help from "../help/Help";
import Routing from "./components/Routing";

function App() {
  let disease1 = "",
    disease2 = "",
    disease3 = "";
  let treatment1 = "",
    treatment2 = "",
    treatment3 = "";

  let hosp1 = "",
    hosp2 = "",
    hosp3 = "";

  // 상태 관리

  const [hospitals, setHospitals] = useState([]);
  const [chatLog, setChatLog] = useState([]);
  const [input, setInput] = useState("");
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [isLoading, setIsLoading] = useState(false);
  const API_KEY = "HOSPITAL_API"; // 병원 찾는거 API 키
  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }, []);

  const findHospital = async () => {
    console.log("병원 찾기 시작");
    try {
      const response = await axios.get(
        `https://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList?ServiceKey=${API_KEY}&pageNo=1&numOfRows=5&yPos=${location.latitude}&xPos=${location.longitude}&radius=10000`
      );
      console.log("병원 정보:", response.data.response.body.items.item);
      setHospitals(response.data.response.body.items.item);
      console.log(hospitals);
    } catch (error) {
      console.error("병원 찾기 에러:", error);
    }
  };

  const askGpt = async (content) => {
    const apiKey = "CHATGPT_API";

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
                '당신은 AI의사입니다. 사용자의 증상이 입력될 경우, JSON 형식으로 가장 가능성이 높은 세 가지 질병과 치료법등(예: 물을 많이 마시고 병원을 방문해 보세요.)을 { "diseases": ["Disease1", "Disease2", "Disease3"], "treatment": ["treatment1", "treatment2", "treatment3"] }로 반환합니다. 그리고 위 질환이 있을때 가야하는 진료과를 [ 일반의, 내과, 신경과, 정신건강의학과, 외과, 정형외과, 신경외과, 심장혈관흉부외과, 성형외과, 마취통증의학과, 산부인과, 소아청소년과, 안과, 이비인후과, 피부과, 비뇨의학과, 영상의학과, 방사선종양학과, 병리과, 진단검사의학과, 결핵과, 재활의학과, 핵의학과, 가정의학과, 응급의학과, 직업환경의학과 ] 중에서 증상에 맞는 가야할 과를 배열속에 있는거로만 일반의 부터 코드를 00으로 시작하여 코드를 { "hospital": ["hospital1", "hospital2", "hospital3"] } 형식으로 코드 3개를 반환해.  (예: 00, 08, 04). 답변은 사회적으로 흔한 질환부터 우선순위로 답변합니다.',
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

      try {
        const parsed = JSON.parse(answer);
        [disease1, disease2, disease3] = parsed.diseases;
        [treatment1, treatment2, treatment3] = parsed.treatment;
        [hosp1, hosp2, hosp3] = parsed.hospital;
      } catch (e) {
        console.error("JSON 파싱 실패:", e.message);
      }
      console.log(disease1, disease2, disease3);
      console.log(treatment1, treatment2, treatment3);
      const formattedAnswer = `그런 증상이 지속될 경우 \n 1. ${disease1}이/가 의심됩니다. ${treatment1}\n2. ${disease2}이/가 의심됩니다. ${treatment2}\n3. ${disease3}이/가 의심됩니다. ${treatment3} \n 해당 증상이 지속될 경우 병원에 방문해보세요!`;
      setChatLog((prev) => [
        ...prev,
        { role: "assistant", content: formattedAnswer },
      ]);
      findHospital();
      console.log(hosp1, hosp2, hosp3);
      // setChatLog((prev) => [...prev, { role: "assistant", content: answer }]);
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
    <Router>
      <div className="main-container">
        <header className="main-header">
          <div className="logo">logo</div>
          <nav className="main-nav">
            <Link to="/">홈</Link>
            <Link to="/hospital">주변 병원 찾기</Link>
            <Link to="/profile">프로필</Link>
            <Link to="/help">도움말</Link>
          </nav>
          <button className="login-btn">로그인</button>
        </header>
        <main className="main-content">
          <Routes>
            <Route path="/hospital" element={<Hospital />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/help" element={<Help />} />
            <Route
              path="/"
              element={
                <div>
                  <div className="symptom-box">
                    <input
                      className="symptom-input"
                      type="text"
                      placeholder="자신의 증상을 입력해보세요."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyUp={(e) => {
                        if (e.key === "Enter") {
                          handleSubmit();
                        }
                      }}
                    />
                    <button className="symptom-btn" onClick={handleSubmit} />
                  </div>
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
                    {hospitals.length > 0 && (
                      <div className="hospital-list">
                        <h3>추천 병원 리스트</h3>
                        {hospitals.map((hospital, index) => (
                          <div
                            key={index}
                            className="hospital-bubble"
                            onClick={() =>
                              window.open(`${hospital.hospUrl}`, "_blank")
                            }
                          >
                            <div className="hospital-line">
                              <span className="hospital-name">
                                {hospital.yadmNm}
                              </span>
                              <span className="hospital-tel">
                                {hospital.telno}
                              </span>
                            </div>
                            <div className="hospital-line">
                              <span className="hospital-distance">
                                {hospital.distance
                                  ? `${parseInt(hospital.distance / 1000)}km`
                                  : ""}
                              </span>
                              <span className="hospital-addr">
                                {hospital.addr}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {isLoading && (
                      <div className="chat-bubble assistant">
                        답변 생성 중...
                      </div>
                    )}
                  </div>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
