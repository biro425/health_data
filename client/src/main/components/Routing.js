import React from "react";
import "./Routing.css";

function Routing() {
  const data = {
    Examples: ["김선민 맛도리", "송리안 ㅡ", "신동건 일안하냐"],
    Trends: ["보건 공공데이터 대회ㅠ", "아 디자인 뭐하지", "개어려움"],
    Caution: ["아 유희왕 하고 싶다", "듀얼을 선언해라!", "배고파"],
  };

  return (
    <div className="tag-board">
      {Object.entries(data).map(([category, items]) => (
        <div key={category} className="column">
          <div className="column-title">{category}</div>
          {items.map((text, idx) => (
            <div key={idx} className="tag-card">
              {text}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Routing;
