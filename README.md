# Yochiyochi (요치요치) 🌸

[![Platform macOS](https://img.shields.io/badge/platform-macOS-lightgrey.svg)]()
[![Platform Windows](https://img.shields.io/badge/platform-Windows-blue.svg)]()
[![Framework Electron](https://img.shields.io/badge/framework-Electron-47848F.svg)]()
[![Library React](https://img.shields.io/badge/library-React-20232a.svg)]()

> **Yochiyochi**는 스마트 교실 환경에서 일본어(히라가나/가타카나) 수업 및 학생 관리를 효율적으로 돕기 위해 개발된 **데스크톱 애플리케이션**입니다.  
> 직관적이고 세련된 테마 디자인과 함께 다양한 스마트 교육 편의 기능을 제공합니다.

---

## ✨ 주요 제공 기능 (Key Features)

### 1. 일본어 문자 랜덤 뽑기 (Lessons)
- **학습 범위 커스텀**: 청음(Seion), 탁음(Dakuon), 반탁음(Handakuon), 요음(Yoon)을 자유롭게 켜고 끌 수 있습니다.
- **문자 종류 선택**: 히라가나, 가타카나, 혹은 두 문자가 섞인 혼합 모드를 제공합니다.
- **스마트 중복 방지**: 이전에 이미 뽑은 글자를 자동으로 기억하여 전체 글자가 순환하기 전까지 중복 없이 고르게 문자가 뽑힙니다.
- **교사용 무선 핫키**: 교탁에서 멀리 떨어져서도 무선 프리젠터나 단축키로 제어할 수 있도록 `스페이스바`(새로 뽑기) 및 `R`(다시 뽑기) 단축키를 지원합니다.

### 2. 스마트 화이트보드 (Whiteboard)
- 칠판처럼 즉석 필기가 가능한 내장 화이트보드 기능입니다.
- **객체 지우개**: 선 하나하나를 일일이 긁어 문지르지 않고, 지우고 싶은 획 위에 마우스를 얹고 우클릭하면 해당 획 전체가 깔끔하게 삭제되는 지능형 획 지우개를 지원합니다.
- 펜 색상 프리셋(검정, 빨강, 파랑, 초록 등) 및 두께 조절 제공.

### 3. 무작위 숫자 드로우 & 결석자 배제 (Number Draw)
- 학급 활동이나 번호 뽑기 시 활용 가능한 무작위 난수 생성기입니다.
- **반 별 프리셋 관리**: A반, B반, C반 등 학급별 프리셋 명칭을 관리할 수 있습니다.
- **제외 번호 등록**: 결석한 학생들의 번호를 제외하고 뽑을 수 있어 번거로움이 없습니다.

### 4. 전체 학습 카드 리스트 (Cards)
- 수록된 전체 문자 리스트를 제공합니다.
- 특정 카드를 클릭하면 칠판 화면 전체에 해당 글자가 울트라 볼드 폰트와 발음 정보로 확대 표시되어 전체 학생에게 설명하기 편리합니다.

### 5. 다국어 지원 및 테마 설정 (Settings)
- 한국어, 영어, 일본어 UI 번역을 완벽 지원합니다.
- 사용자 설정에 기반한 세련된 모던 다크 테마 및 다양한 강조 색상 테마를 영구 보존(Local Persistence)합니다.

---

## 🛠 기술 스택 (Tech Stack)

* **Core**: Electron, React, TypeScript
* **Build Tooling**: Vite (`electron-vite`), `electron-builder`
* **Styling**: Vanilla CSS (Material Design Token 기반 테마 튜닝 및 부드러운 Stagger 모션 적용)
* **Storage**: Node.js 파일 시스템 기반 로컬 설정 영구 데이터 보존

---

## 📥 다운로드 및 실행 방법 (Download & Run)

일반 사용자는 별도의 빌드 과정 없이, 우측의 **Releases** 탭에서 사용 중인 운영체제(OS)에 맞는 설치 파일을 다운로드하여 즉시 사용하실 수 있습니다.

### 🍎 macOS 실행 가이드 (보안 경고 우회)
> [!IMPORTANT]
> 정식 App Store 심사를 거치지 않은 Ad-hoc 배포본이므로 최초 실행 시 시스템 차단 팝업이 나타날 수 있습니다.
1. **Releases**에서 `.dmg` 파일을 다운로드하여 실행한 뒤, Yochiyochi 앱을 **Applications (응용 프로그램)** 폴더로 드래그하여 설치합니다.
2. 앱을 처음 실행할 때 *"확인되지 않은 개발자가 배포했기 때문에 열 수 없습니다"* 경고창이 뜨면 **[확인]**을 누릅니다.
3. 응용 프로그램 폴더의 `Yochiyochi` 앱 아이콘을 마우스 **우클릭(두 손가락 클릭)** 한 뒤 **[열기]**를 선택합니다.
4. 다시 나타나는 확인 창에서 **[열기]** 버튼을 클릭하여 실행합니다. (최초 1회 설정 후에는 이후 일반 앱처럼 바로 켜집니다.)

### 🐬 Windows 실행 가이드 (보안 경고 우회)
> [!IMPORTANT]
> 코드 서명 인증서가 포함되지 않은 Unsigned 빌드이므로 설치 시 SmartScreen 차단 화면이 나타납니다.
1. **Releases**에서 `-setup.exe` 파일을 다운로드하여 실행합니다.
2. 실행 시 파란색 경고창(*"Windows의 PC 보호"*)이 나타나면 본문 내부의 **[추가 정보]** 링크를 클릭합니다.
3. 우측 하단에 나타나는 **[실행]** 버튼을 클릭하여 설치 및 실행을 완료합니다.

---

---

## 📝 라이선스 (License)

This project is licensed under the MIT License - see the LICENSE file for details.