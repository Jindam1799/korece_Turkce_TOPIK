# 덩어리숲 · Korece Kelime Ormanı

튀르키예·아제르바이잔 친구들을 위한 한국어 단어 게임. © 2026 Wonju (원주)
Türk ve Azerbaycanlı arkadaşlar için Korece kelime oyunu.

▶ https://jindam1799.github.io/korece_Turkce_TOPIK/

## 내용
| 단계 | 단어 수 | 파일 |
|---|---|---|
| A1–A2 | 893 | `data/a12.js` |
| B1.1 | 447 | `data/b11.js` |
| B1.2 | 616 | `data/b12.js` |
| B2.1 | 607 | `data/b21.js` |
| B2.2 | 121 | `data/b22.js` |
| 한자 (Hanca) | 390 | `data/hanja.js` |

- 단어 자료: Aslıhan Erdoğan (KOREAN VOCAB, Asl_HANCA) — 오타 수정, 단어마다 짝꿍어휘 추가
- 퀴즈: 한국어 → 튀르키예어 4지선다, 오답은 같은 단원·같은 품사에서
- 짝꿍어휘 보너스, 카드 뒤집기, 나의 진도표, 복습 목록
- 식물 친구 육성 (그림: 진담중국어 덩어리숲 `char.js`)
- 튀르키예어 / 한국어 화면 전환, 한국어 여성 음성 TTS, 홈 화면 아이콘(PWA)
- 인트로 화면, 힐링 배경 음악(브라우저에서 직접 만들어 재생), 덩이 이야기와 식물 도감, 업데이트 노트
- 링크 미리보기 그림 `og-image.png`, 카카오톡·인스타그램 앱 안 브라우저에서 Chrome으로 자동 전환

## 고치는 법
- 단어: `data/*.js` 한 줄 = `단어|뜻|짝꿍어휘=뜻;짝꿍어휘=뜻`, `#`으로 시작하는 줄은 단원 이름
- 연락처: `config.js` — `contact`(이메일), `kakao`(카카오톡 ID), `instagram`
- 업데이트 노트: `app.js`의 `NOTES` 목록 맨 위에 추가
- 새 버전을 올릴 때 `sw.js`의 `VERSION`을 바꾸면 휴대폰에서 바로 새 버전이 보여요
