// ===== 중계 서버(TURN) 설정 =====
// 학교 와이파이처럼 기기끼리 직접 연결이 막힌 곳에서도 연결되게 해 줍니다.
// Metered Open Relay(무료, 매달 20GB)에 가입한 뒤 아래 두 칸을 채우세요.
//   appName : 대시보드에 보이는 앱 이름 (주소 xxx.metered.live 의 xxx 부분)
//   apiKey  : TURN 자격 증명(Credential)의 API 키  ※ 계정의 Secret Key는 절대 넣지 마세요
// 비워 두면 중계 서버 없이 지금처럼 동작합니다.
window.NB_TURN = {
  appName: "",
  apiKey: ""
};
