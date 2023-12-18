## 大綱及前情提要

> 第一次嘗試串接 Firebase，題材就選了萬年不朽的 todolist。

功能方面除了一般的增修刪查之外，也包含了串接第三方登入；

技術的部分，在 Firebase 之中使用了 Firestore Database 以及 Authentication，再搭配多語系 i18n 設置，也將 Yup、Semantic UI 表單用自己的理解方式包裝起來，以完成了驗證流程。

另外，也有將這次關於自己包裝的表單驗證流程，撰寫成文件分享出來 [[文件連結](https://diuer.medium.com/yup-form-538934cd902e)]

## Demo

https://todolist-3ada8.web.app/

## 專案 CI/CD

透過 Github Action 進行專案打包，再託管到 Firebase
(部分 token 已設定在 github 環境變數中，因此設定檔看不到該機敏資訊)

## Firebase Database 資料結構

`collections > documents > collections > documents > fields`

todos

└─── `${uid}`

├────└──── item

├─────────└──── `${random id}`

├──────────────└──── (data) `{ category, createTimestamp, id, isCompleted, priority, title }`

## 本地運行

- 先設置環境變數 .env (各種 Firebase 需要的資訊，詳情可看 `utils/firebase.js`)
- 在 Firebase 建立對應 collection (名稱: todos)
- yarn install & yarn start

## 資料夾說明

src

├── components 各式元件

├── constants 存放一些參數 (e.g. enum)

├── contexts 放置 Provider 的地方 (e.g. FormProvider)

├── hooks 一些 custom hook (e.g. useInput)

├── libraries 函式庫 初始化的設置也會放在這 (e.g. 初始化 i18n & Yup)

├── locales 多國語系的資料集 & 包裝 i18n 的 custom hook

├── sections 元件的集合 (更區塊性的元件)

├── utils 初始設置&呼叫 api 的 function

├── fonts

└── index.js

## 使用技術

- UI 框架: Semantic UI
- 前端框架: React.js
- 串接 SDK: Firebase
- 資料庫: Firestore Database
- 第三方登入驗證: Firebase Authentication
- 多國語系: i18n
- 表單資料驗證: Yup
- 拖拉功能: React DnD
