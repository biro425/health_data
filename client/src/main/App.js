import './App.css';

function App() {
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
      <main className="main-content">
        <div className="symptom-box">
          <input
            className="symptom-input"
            type="text"
            placeholder="자신의 증상을 상세하게 적어주세요."
          />
          <button className="symptom-btn"></button>
        </div>
      </main>
    </div>
  );
}

export default App;