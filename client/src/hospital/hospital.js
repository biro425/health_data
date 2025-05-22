import React, { useEffect, useRef, useState } from "react";
import "./hosptial.css";

const KAKAO_MAP_API_KEY = "KEY";
const HOSPITAL_API_KEY = "KEY";

function loadKakaoMapScript(callback) {
  if (window.kakao && window.kakao.maps) {
    callback();
    return;
  }
  const script = document.createElement("script");
  script.id = "kakao-map-script";
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false`;
  script.onload = () => {
    window.kakao.maps.load(callback);
  };
  document.head.appendChild(script);
}

const HospitalMap = () => {
  const mapRef = useRef(null);
  const [hospitals, setHospitals] = useState([]);
  const [map, setMap] = useState(null);
  const [currentInfowindow, setCurrentInfowindow] = useState(null);

  // 병원 데이터 가져오기
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await fetch(
          `https://apis.data.go.kr/B552657/HsptlAsembySearchService/getHsptlMdcncListInfoInqire?serviceKey=${HOSPITAL_API_KEY}&Q0=대전광역시&Q1=중구&pageNo=1&numOfRows=100&_type=json`
        );
        const data = await response.json();
        console.log('API 응답:', data);
        
        if (data.response?.body?.items?.item) {
          const items = Array.isArray(data.response.body.items.item) 
            ? data.response.body.items.item 
            : [data.response.body.items.item];
          console.log('병원 데이터:', items);
          setHospitals(items);
        }
      } catch (error) {
        console.error("병원 데이터 가져오기 실패:", error);
      }
    };

    fetchHospitals();
  }, []);

  // 카카오맵 초기화
  useEffect(() => {
    loadKakaoMapScript(() => {
      const container = mapRef.current;
      const options = {
        center: new window.kakao.maps.LatLng(36.349809, 127.384816),
        level: 5,
      };
      const kakaoMap = new window.kakao.maps.Map(container, options);
      setMap(kakaoMap);
    });
  }, []);

  // 병원 마커 표시
  useEffect(() => {
    if (!map || !hospitals.length) return;

    hospitals.forEach(hospital => {
      if (hospital.wgs84Lat && hospital.wgs84Lon) {
        try {
          const lat = parseFloat(hospital.wgs84Lat);
          const lng = parseFloat(hospital.wgs84Lon);

          if (!isNaN(lat) && !isNaN(lng)) {
            const position = new window.kakao.maps.LatLng(lat, lng);
            
            const marker = new window.kakao.maps.Marker({
              position: position,
              map: map
            });

            // 병원 정보 HTML 컨텐츠 생성 시 데이터 검증
            const hospitalName = hospital.yadmNm || '병원명 없음';
            const hospitalAddr = hospital.addr || '주소 정보 없음';
            const hospitalTel = hospital.telno || '전화번호 없음';

            const infowindow = new window.kakao.maps.InfoWindow({
              content: `
                <div style="padding:10px;width:300px">
                  <h3 style="margin:0 0 10px 0;font-size:14px">${hospitalName}</h3>
                  <p style="margin:0;font-size:13px">주소: ${hospitalAddr}</p>
                  <p style="margin:5px 0 0 0;font-size:13px">전화: ${hospitalTel}</p>
                </div>
              `,
              removable: true
            });

            window.kakao.maps.event.addListener(marker, 'click', () => {
              // 이전에 열린 정보창이 있다면 닫기
              if (currentInfowindow) {
                currentInfowindow.close();
              }
              infowindow.open(map, marker);
              setCurrentInfowindow(infowindow);
            });

            console.log('마커 생성 완료:', hospitalName, lat, lng);
          }
        } catch (error) {
          console.error('마커 생성 실패:', error, hospital);
        }
      }
    });

    // 컴포넌트 언마운트 시 정보창 닫기
    return () => {
      if (currentInfowindow) {
        currentInfowindow.close();
      }
    };
  }, [hospitals, map, currentInfowindow]);

  return (
    <div className="map-container">
      <div ref={mapRef} className="kakao-map" />
    </div>
  );
};

export default HospitalMap;
