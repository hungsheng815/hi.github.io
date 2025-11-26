# me-web

這是一個簡單的個人履歷單頁網站範例，包含 header、關於我、技能、經歷、聯絡方式等區塊。

## 使用方式

1. 開啟 `index.html` 於瀏覽器中（可直接雙擊或使用 Live Server）

## 專案結構

```
me-web/
	├─ index.html
	├─ css/
	│   └─ styles.css
	├─ js/
	│   └─ script.js
	└─ README.md
```

## 說明

- `index.html`：主頁
- `css/styles.css`：全站樣式
- `js/script.js`：簡單互動，包括行動導覽切換與平滑捲動。

## 自訂內容
請替換 `index.html` 中的個人資訊與連結，例如 Email、GitHub、LinkedIn 與經歷。

## 頭像 (Avatar)

我已新增預設的 `assets/avatar.svg` 檔案作為頭像範例。要替換成自己的頭像，請將新的圖片命名為 `avatar.svg`（或在 `index.html` 中修改路徑），放到 `assets/` 資料夾中。

- 建議圖片大小：方形，至少 240 x 240 px。若使用 JPG/PNG 可直接覆蓋檔案；若使用 SVG，請確保適當縮放與可見性。
- 若想使用不同檔名或儲存在其他資料夾，請更新 `index.html` 中的 `src` 屬性。

## 視覺優化說明

- 使用 Google Fonts（Inter 與 Playfair Display）改善字體層次。
- 新增更飽和的配色、按鈕漸層與陰影，並優化行距與字級大小。
- 經歷區改為左右交錯的時間軸（桌面版），搭配點狀標記與漸層卡片。
- 加入 reveal-on-scroll 動畫、滑動平滑滾動與導航 active 標示。

## 主題 (淺色 / 深色) 切換

- 在頁首提供主題切換按鈕（太陽/月亮圖示），支援使用者主題偏好與儲存偏好至 localStorage。
- 預設會依作業系統偏好 (prefers-color-scheme) 或上次使用的選擇自動載入。
- 若要調整色彩，編輯 `:root` 與 `:root[data-theme='light']` 中的 CSS 變數（如 `--accent`, `--bg` 等）。

### 切換與重置

- 頁面按鈕會自動切換，你也可以在瀏覽器中更改偏好：
	- 清除儲存值以恢復 OS 偏好：在瀏覽器的 devtools console 執行：
		```js
		localStorage.removeItem('theme')
		```
	- 強制套用某個主題（開發用途）：在 console 執行：
		```js
		document.documentElement.setAttribute('data-theme', 'light')
		// 或
		document.documentElement.removeAttribute('data-theme')
		```

如果需要我進一步調整主題、增加淺色/深色主題切換或更換字型，請告訴我你偏好的風格（例如：簡潔 / 極簡 / 鮮豔 / 公司品牌）。
