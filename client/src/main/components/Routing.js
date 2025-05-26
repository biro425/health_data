import React from "react";
import "./Routing.css";

function Routing() {
  const data = {
    Examples: ["천식", "코로나", "독감"],
    Trends: ["통합돌봄, 약사 역할 확대", "'이종욱 기념 공공보건상'", "농촌일손 해소하기 위해 구슬"],
    Caution: ["복귀 원하지만 조심스러운 전공의", "비브리오패혈균 감염 주의 당부", "야외활동 참진드기 조심하세요"],
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
