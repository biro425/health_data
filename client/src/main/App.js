import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Hospital from '../hospital/hospital';
import Profile from '../profile/Profile';
import Help from '../help/Help';

function App() {
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
            <Route path="/" element={
              <div className="symptom-box">
                <input
                  className="symptom-input"
                  type="text"
                  placeholder="자신의 증상을 상세하게 적어주세요."
                />
                <button className="symptom-btn"></button>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;