import React, { useState } from 'react';
import './Help.css';

const faqList = [
  {
    question: '회원가입은 어떻게 하나요?',
    answer: '상단의 회원가입 버튼을 클릭한 후, 정보를 입력하시면 됩니다.',
  },
  {
    question: '비밀번호를 잊어버렸어요.',
    answer: '로그인 화면에서 "비밀번호 찾기"를 클릭해 안내에 따라 진행하세요.',
  },
  {
    question: '병원 위치 정보는 어떻게 제공되나요?',
    answer: '카카오맵 API를 통해 주변 병원 위치를 안내해드립니다.',
  },
];

function Help() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = idx => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="help-container">
      <h2 className="help-title">FAQ</h2>
      <div className="faq-list">
        {faqList.map((faq, idx) => (
          <div className={`faq-item${openIndex === idx ? ' open' : ''}`} key={idx}>
            <button className="faq-question" onClick={() => handleToggle(idx)}>
              <span>{faq.question}</span>
              <span className="faq-arrow">{openIndex === idx ? '▲' : '▼'}</span>
            </button>
            <div className="faq-answer">
              {openIndex === idx && <div>{faq.answer}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Help;