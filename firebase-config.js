// ───────────────────────────────────────────────────────────
//  開場彈幕 共用 Firebase 設定（submit / screen 共用）
//
//  ⚠ 本專案與 QQQQAAAA 完全隔離，必須使用獨立的新 Firebase 專案。
//  嚴禁把 qqqqaaaa 舊專案（QQQQAAAA/firebase-config.js）的任何一個值
//  複製貼到下面——那是另一個資料庫，會把開場彈幕的資料寫錯地方。
//  下方設定值已於 2026/08/30 填入獨立專案 opening-danmaku 的真實值。
//
//  部署步驟見 deploy-guide.md，重點：
//  1. https://console.firebase.google.com 建立「全新」專案（免費 Spark 方案即可）
//  2. 建立 Realtime Database，區域選 asia-southeast1（新加坡，離台灣最近）
//  3. 專案設定 → 你的應用程式 → 新增網頁應用程式 → 把 firebaseConfig 貼到下方
//  4. Realtime Database → 規則 → 貼上 database.rules.json 的內容後發布
// ───────────────────────────────────────────────────────────

const firebaseConfig = {
  apiKey: "AIzaSyCuAb5MOQNF2mJ--s_6fxt3HqcQO93mdbY",
  authDomain: "opening-danmaku.firebaseapp.com",
  databaseURL: "https://opening-danmaku-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "opening-danmaku",
  storageBucket: "opening-danmaku.firebasestorage.app",
  messagingSenderId: "317427340257",
  appId: "1:317427340257:web:5062f7f4f44f26a39978a0"
};

// 房間代號：與 QQQQAAAA 系列（qqqqaaaa-rehearsal / qqqqaaaa-live）完全無關的獨立房間。
const ROOM = "opening-danmaku";

// 各頁共用初始化。設定未填、SDK 沒載到（CDN 掛掉）或初始化失敗時回傳 null，
// 失敗原因放在 QQQQ_INIT_ERROR，頁面必須顯示明確提示（不可白屏）。
var QQQQ_INIT_ERROR = null;
function initQQQQDb(){
  if (typeof firebase === 'undefined'){
    QQQQ_INIT_ERROR = 'Firebase SDK 載入失敗（現場請確認網路後重新整理）';
    return null;
  }
  if (!firebaseConfig.databaseURL || firebaseConfig.databaseURL.indexOf('待填') !== -1){
    QQQQ_INIT_ERROR = '尚未設定 Firebase（請照 deploy-guide.md 填 firebase-config.js）';
    return null;
  }
  try {
    firebase.initializeApp(firebaseConfig);
    return firebase.database();
  } catch(e){
    QQQQ_INIT_ERROR = 'Firebase 初始化失敗：' + e.message;
    return null;
  }
}

// 資料模型備忘（實際權限限制在 database.rules.json）：
// rooms/{ROOM}/submissions/{pushId} = {
//   table: "B3"~"B32", nick: ≤8字, question: ≤50字（自由文字，欄位名沿用 question
//   以求 rules 與引擎程式碼零 diff，畫面上不再顯示「問題」字樣）, ts: ServerValue.TIMESTAMP
// }
// 沒有 admin、沒有 draw、沒有審核狀態欄位（無 status/drawnAt/tone）：
// 所有投稿一律視為可上牆，唯一防線是 submit 頁的文案提醒。
// rooms/{ROOM}/control = { clearAt? }（只有清空一個控制項）
