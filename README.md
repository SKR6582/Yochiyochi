# Yochiyochi (요치요치) 🎒🌸

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

## 🚀 개발 및 빌드 환경 가이드

프로젝트 코드는 `/yochiyochi` 하위 디렉토리에 위치해 있습니다.

### 1. 패키지 설치
```bash
$ cd yochiyochi
$ npm install
```

### 2. 로컬 개발 서버 구동
```bash
$ npm run dev
```

### 3. 플랫폼별 빌드 (배포 패키지 생성)
코드 서명 생략 빌드를 지원하여 로컬에서 즉시 설치용 패키지를 추출할 수 있습니다.

```bash
# macOS 빌드 (DMG 및 ZIP 생성)
$ CSC_IDENTITY_AUTO_DISCOVERY=false npm run build:mac

# Windows 빌드 (EXE 설치 파일 생성)
$ npm run build:win

# Linux 빌드
$ npm run build:linux
```
빌드된 결과물은 `yochiyochi/dist` 디렉토리에 보관됩니다.

---

## 📝 라이선스 (License)

This project is licensed under the MIT License - see the LICENSE file for details.