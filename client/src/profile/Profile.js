import React from 'react';
import './Profile.css';

function Profile() {
  return (
    <div className="profile-container">
      <div className="profile-left">
        <div className="profile-img">
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r="90" fill="#e0e0e0" />
            <g>
              <rect x="45" y="70" width="90" height="60" rx="10" fill="#bdbdbd" />
              <circle cx="90" cy="100" r="18" fill="#e0e0e0" />
              <rect x="75" y="85" width="30" height="10" rx="5" fill="#bdbdbd" />
            </g>
          </svg>
        </div>
        <div className="profile-username">홍길동</div>
      </div>
      <div className="profile-right">
        <div className="profile-row">
          <div className="profile-label">이메일</div>
          <div className="profile-value"></div>
        </div>
        <div className="profile-row">
          <div className="profile-label">전화번호</div>
          <div className="profile-value"></div>
        </div>
        <div className="profile-row">
          <div className="profile-label">성별</div>
          <div className="profile-value"></div>
          <div className="profile-label">나이</div>
          <div className="profile-value"></div>
        </div>
        <div className="profile-row">
          <div className="profile-label">주소</div>
          <div className="profile-value">
            대전대신특별시 오량구 오량동 오량로 52-3번길 대전대신고등학교
          </div>
        </div>
        <div className="profile-row profile-btn-row">
          <button className="profile-edit-btn">수정하기</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;