export const TEAMS=['A','B','C','D'];
export const TITANS=[
 {id:'cart',name:'차력 거인',ability:'보급의 달인',game:'젓가락으로 콩 옮기기',items:'젓가락, 콩, 그릇',brief:'흩어진 보급품을 되찾을 시간! 침착한 손끝으로 분대의 진격을 이어 가자.',limit:240},
 {id:'beast',name:'짐승 거인',ability:'정밀 투척',game:'신발을 던져 소쿠리로 받기',items:'신발, 소쿠리',brief:'던지는 동료와 받는 동료의 완벽한 호흡! 우리의 합동 투척을 보여 주자.',limit:240},
 {id:'female',name:'여성형 거인',ability:'완벽한 포커페이스',game:'표정으로 소금물 마신 사람 찾기',items:'컵, 음용수, 소금',brief:'표정 속에 숨은 단서를 찾아라! 날카로운 관찰력과 능청스러운 연기로 승부하자.',limit:180},
 {id:'jaw',name:'턱 거인',ability:'돌파 본능',game:'밀가루 속 사탕 찾기',items:'밀가루, 포장 사탕, 쟁반',brief:'보급품이 잔해 속에 묻혔다! 숨은 물자를 찾아내고 돌파의 주인공이 되자.',limit:240},
 {id:'armor',name:'갑옷 거인',ability:'철벽 돌파',game:'얼굴의 포스트잇을 입김으로 떼기',items:'포스트잇',brief:'우리 앞에 철벽이란 없다! 온 힘을 모아 마지막 방어막까지 날려 버리자.',limit:210},
 {id:'warhammer',name:'전퇴의 거인',ability:'창조의 일격',game:'팀원별 서로 다른 종이접기 완성',items:'색종이, 접기 도안',brief:'이번 무기는 우리의 상상력! 서로 다른 작품을 완성해 분대만의 힘을 모으자.',limit:270}
];
export const BONUSES=[{id:'timer',name:'감각의 10초',description:'정확히 10.00초에 멈춰라!',kind:'web'},{id:'tap',name:'15초 진격',description:'15초 동안 거침없이 터치!',kind:'web'},{id:'photo',name:'분대의 한 장',description:'지령에 맞춰 사진을 찍고 운영실에 보여 주세요.',kind:'field'},{id:'roulette',name:'운영실 룰렛',description:'운영실에서 운명의 회전! +3 / +1 / 0 / −1점.',kind:'roulette'},{id:'person',name:'반가운 지원군',description:'조건에 맞는 사람에게 동의를 구하고 운영실에 함께 방문하세요.',kind:'field'},{id:'bottle',name:'보급병의 손끝',description:'운영실에서 물병 세우기!',kind:'field'}];
export const PHOTO=['분대원 전원이 조사병단 경례','여섯 명이 거인 흉내 내기','전원 극적인 출정 포즈','함께 하나의 거대한 검 만들기'];
export const PERSON=['안경을 쓴 사람','초록색 옷이나 소품을 가진 사람','모자를 쓴 사람','흰색 신발을 신은 사람'];
export const BOSS={A:'단체줄넘기 연속 5회',B:'논리 퀴즈 1문제',C:'젠가 5개 수직 쌓기',D:'티스푼 탁구공 릴레이'};
export const assigned=(team,round)=>TITANS[(TEAMS.indexOf(team)+round-1)%6];
