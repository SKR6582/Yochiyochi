import { UiLanguage } from '../components/SettingsModal'

type Translations = {
  [key: string]: {
    ko: string
    en: string
    ja: string
  }
}

export const translations: Translations = {
  lessons: { ko: '문자', en: 'Lessons', ja: 'レッスン' },
  history: { ko: '기록', en: 'History', ja: '履歴' },
  number: { ko: '숫자', en: 'Number', ja: '数字' },
  cards: { ko: '카드', en: 'Cards', ja: 'カード' },
  settings: { ko: '설정', en: 'Settings', ja: '設定' },
  help: { ko: '도움말 가이드', en: 'Help Guide', ja: 'ヘルプガイド' },
  learningPanel: { ko: '학습 설정', en: 'LEARNING PANEL', ja: '学習パネル' },
  scriptType: { ko: '문자 종류', en: 'SCRIPT TYPE', ja: '文字の種類' },
  hiragana: { ko: '히라가나', en: 'Hiragana', ja: 'ひらがな' },
  katakana: { ko: '가타카나', en: 'Katakana', ja: 'カタカナ' },
  mixed: { ko: '혼합', en: 'Mixed', ja: '混合' },
  range: { ko: '학습 범위', en: 'LEARNING RANGE', ja: '学習範囲' },
  seion: { ko: '청음', en: 'Seion', ja: '清音' },
  dakuon: { ko: '탁음', en: 'Dakuon', ja: '濁音' },
  handakuon: { ko: '반탁음', en: 'Handakuon', ja: '半濁音' },
  yoon: { ko: '요음', en: 'Yoon', ja: '拗音' },
  preventDuplicates: { ko: '중복 방지', en: 'Prevent Duplicates', ja: '重複防止' },
  displayOptions: { ko: '표시 옵션', en: 'DISPLAY OPTIONS', ja: '表示オプション' },
  showRomaji: { ko: '발음 표시', en: 'Show Romaji', ja: 'ローマ字表示' },
  showExample: { ko: '예시 표시', en: 'Show Example', ja: '例文表示' },
  sidebarTip: { ko: 'TIP: 단어와 이미지는 한 번에 끄고 켤 수 있습니다.', en: 'TIP: You can toggle words and images at once.', ja: 'ヒント: 単語と画像を一度に切り替えられます。' },
  drawBtn: { ko: '뽑기', en: 'DRAW', ja: '引く' },
  drawHistory: { ko: '뽑은 기록', en: 'Draw History', ja: '引いた履歴' },
  totalCount: { ko: '총 {count}개', en: 'Total {count}', ja: '計 {count}個' },
  deleteAll: { ko: '전체 삭제', en: 'Delete All', ja: 'すべて削除' },
  noHistory: { ko: '아직 뽑은 기록이 없습니다', en: 'No draw history yet', ja: 'まだ履歴がありません' },
  noHistorySub: { ko: 'Lessons 탭에서 글자를 뽑아보세요', en: 'Draw characters in the Lessons tab', ja: 'レッスンタブで文字を引いてみてください' },
  randomNumber: { ko: '무작위 숫자', en: 'RANDOM NUMBER', ja: 'ランダムな数字' },
  presets: { ko: '프리셋', en: 'Presets', ja: 'プリセット' },
  classSettings: { ko: '반 별 설정', en: 'Class Settings', ja: 'クラスごとの設定' },
  presetName: { ko: '프리셋 이름', en: 'Preset Name', ja: 'プリセット名' },
  excludedNumbers: { ko: '제외 번호', en: 'Excluded Numbers', ja: '除外番号' },
  deletePreset: { ko: '이 프리셋 삭제', en: 'Delete this preset', ja: 'このプリセットを削除' },
  presetTip: { ko: 'TIP: 반 별로 프리셋을 만들어 결석자를 제외할 수 있습니다.', en: 'TIP: Create presets per class to exclude absentees.', ja: 'ヒント: クラスごとのプリセットを作成して欠席者を除外できます。' },
  languageSettings: { ko: '언어 설정', en: 'LANGUAGE', ja: '言語設定' },
  'NO_SELECTION': { ko: '학습 범위를 하나 이상 켜주세요.', en: 'Please turn on at least one learning range.', ja: '学習範囲を1つ以上オンにしてください。' },
  numberUnit: { ko: '번', en: '', ja: '番' },
  excluded: { ko: '제외', en: 'Excluded', ja: '除外' },
  helpTitle: { ko: '요치요치 도움말', en: 'YochiYochi Help', ja: 'ヨチヨチ ヘルプ' },
  helpLessons: { ko: 'Lessons 탭에서는 설정한 범위 내에서 히라가나/가타카나를 무작위로 뽑을 수 있습니다.', en: 'In the Lessons tab, you can randomly draw characters within the set range.', ja: 'Lessonsタブでは、設定した範囲内で文字をランダムに引くことができます。' },
  helpHistory: { ko: '기록 탭에서는 지금까지 뽑은 글자들의 내역을 확인하고 다시 띄울 수 있습니다.', en: 'In the History tab, you can view the drawn characters and display them again.', ja: '履歴タブでは、これまでに引いた文字の履歴を確認し、再度表示できます。' },
  helpNumber: { ko: '숫자 탭에서는 반 별 프리셋을 만들어 결석자를 제외하고 무작위 숫자를 뽑을 수 있습니다.', en: 'In the Number tab, you can create presets per class to draw a random number excluding absentees.', ja: '数字タブでは、クラスごとのプリセットを作成し、欠席者を除外してランダムな数字を引くことができます。' },
  helpCards: { ko: '카드 탭에서는 모든 글자의 목록을 보고 원하는 글자를 클릭해 화면에 크게 띄울 수 있습니다.', en: 'In the Cards tab, you can view all characters and click to display them large.', ja: 'カードタブでは、すべての文字のリストを表示し、クリックして大きく表示できます。' },
  close: { ko: '닫기', en: 'Close', ja: '閉じる' }
}

export function t(key: string, lang: UiLanguage, params?: Record<string, string | number>): string {
  const translation = translations[key]?.[lang] || translations[key]?.['ko'] || key
  
  if (params) {
    return Object.keys(params).reduce((str, paramKey) => {
      return str.replace(`{${paramKey}}`, String(params[paramKey]))
    }, translation)
  }
  
  return translation
}
