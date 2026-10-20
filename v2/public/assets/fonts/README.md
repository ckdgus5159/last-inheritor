# 게임 웹폰트

모든 파일은 SIL Open Font License 1.1로 웹 임베딩·재배포가 허용된 서체를 가공한 것입니다. 원 저작권과 라이선스는 같은 폴더의 `*-OFL.txt`에 보관합니다. 원본 TTF를 실행 시 다운로드하지 않으며 WOFF2 파일을 사이트에서 직접 제공합니다.

| 용도 | 원본 서체 | 프로젝트 내 이름 |
| --- | --- | --- |
| 제목·거인 이름·승리 연출 | Black Han Sans | Field Ops Display |
| 설명·메뉴·입력·관리자 화면 | Noto Sans KR | Field Ops Text |
| 점수·순위·타이머 | Rajdhani Bold | Field Ops Score |

원본: Google Fonts 저장소의 [Black Han Sans](https://github.com/google/fonts/tree/main/ofl/blackhansans), [Noto Sans KR](https://github.com/google/fonts/tree/main/ofl/notosanskr), [Rajdhani](https://github.com/google/fonts/tree/main/ofl/rajdhani). 파생 파일의 내부 이름을 위 이름으로 바꾸고 원 저작권·라이선스 메타데이터를 보존했습니다.

본문은 400~700 가변 굵기를 사용합니다. 자주 쓰는 한글·현재 UI의 문자와 드문 한글을 두 파일로 나눠 `unicode-range`에 따라 필요한 파일만 받습니다. 두 파일의 문자 범위는 겹치지 않으며 현대 완성형 한글 11,172자를 모두 포함합니다. 제목은 현재 UI와 요청 문구에 쓰는 문자를 포함하며 그 밖의 문자는 본문 서체로 표시합니다. 숫자는 실제 700 굵기를 사용합니다.

`faces.css`가 웹폰트를 선언하고 `/typography.css`가 화면별 역할을 지정합니다. `font-display: swap`을 사용해 다운로드가 늦어도 글자를 읽을 수 있도록 했습니다. 라이선스 파일은 수정·삭제하지 마세요.
