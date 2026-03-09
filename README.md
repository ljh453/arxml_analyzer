# AUTOSAR Structure Analyzer

브라우저에서 `index.html`을 열면 동작하는 정적 웹앱입니다. AUTOSAR `ARXML` 파일을 업로드하면 아래 흐름으로 분석합니다.

- `SWC / Composition / Complex Driver` 태그 탐지
- `P-Port / R-Port / Runnable / Connector / Interface` 기반 `RTE` 신호 추정
- `ECUC-MODULE-CONFIGURATION-VALUES`와 `AR-PACKAGE` 이름을 사용한 `BSW` 모듈 분류
- `AUTOSAR Layered Architecture` 보드 형태로 시각화

## 실행 방법

1. `index.html`을 브라우저에서 엽니다.
2. `.arxml` 또는 `.xml` 파일을 업로드합니다.
3. 요약 카드, 계층 보드, 분석 근거 테이블을 확인합니다.

## 현재 분류 규칙

- `Application Layer`
  - `APPLICATION-SW-COMPONENT-TYPE`
  - `COMPOSITION-SW-COMPONENT-TYPE`
  - `SERVICE-SW-COMPONENT-TYPE`
  - `SENSOR-ACTUATOR-SW-COMPONENT-TYPE`
- `Complex Drivers`
  - `COMPLEX-DEVICE-DRIVER-SW-COMPONENT-TYPE`
- `RTE`
  - 직접 레이어 정의보다는 `Port / Connector / Runnable / Interface` 개수를 기반으로 추정
- `Basic Software`
  - `Services`, `Communication Stack`, `Memory Stack`, `ECU Abstraction`, `MCAL`
  - `ECUC-MODULE-CONFIGURATION-VALUES`의 `DEFINITION-REF` 마지막 세그먼트와 패키지명을 기준으로 분류

## 한계

- ARXML 메타모델은 프로젝트별 커스터마이징 폭이 커서, 현재 버전은 `태그명 + 모듈명 휴리스틱` 중심입니다.
- 정확한 ECU Extract, System Description, BSWMD 해석이 필요하면 프로젝트 규칙에 맞춘 추가 매핑이 필요합니다.
- `RTE`는 보통 생성 산출물이라 ARXML 내 직접 표현이 제한적이어서, 현재는 추정 정보로 보여줍니다.

## 다음 확장 후보

- 패키지 트리 탐색과 검색
- 레이어별 상세 패널
- ECUC parameter / container depth 분석
- SVG 기반 아키텍처 다이어그램 export
