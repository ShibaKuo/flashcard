# 專題報告

* **專題名稱**：單字卡
* **姓名**：郭哲銘
* **班級／座號**：25113132

---

## 一、 目的
本專題旨在幫助使用者透過動態卡片翻面的方式，用以背單字與複習。透過自訂新增單字與標記熟記狀態的功能，使用者可以自由的選擇想背的內容。也存在提供預設的單字庫/分享單字庫的可能。

---

## 二、 功能說明
1. **新增單字**：使用者在輸入框填寫單字與中文翻譯後，點擊「新增單字」按鈕，會將新卡片加入清單並跳轉顯示。
2. **卡片翻面**：使用者點擊卡片本體或「翻面」按鈕，卡片會即時切換顯示單字或中文翻譯。
3. **切換上下張**：使用者點擊「上一張」或「下一張」按鈕，可輪播切換檢視不同的單字卡。
3. **隨機**：使用者點擊「隨機」按鈕，可隨機跳出一個標示為未記熟的單字。
4. **標記熟記**：使用者點擊「標記為已熟記」按鈕，卡片背景與標題會更新為綠色狀態，便於識別掌握度。
5. **刪除單字卡**：使用者點擊「刪除此單字卡」按鈕，跳出確認視窗後，可將該單字從清單中永久移除。
5. **重製單字卡**：使用者點擊「重製單字卡」按鈕，跳出確認視窗後，可將熟記隱藏後的單字全部重製。

---

## 三、 程式運作流程說明
1. **頁面載入與狀態讀取 (Initialization)**：
   網頁開啟時，程式會先嘗試從瀏覽器的 `localStorage` 讀取先前儲存的單字資料。若無資料則載入預設陣列，並呼叫 `renderCard()` 函式繪製第一張卡片。

   let cards = JSON.parse(localStorage.getItem('flashcards')) || [

   ];

   

2. **新增資料流程**：
   使用者輸入資料並點擊新增後，觸發 `addCard()` 函式。程式會先進行防呆檢查（確保欄位非空白），驗證通過後建立新物件並透過 `push()` 加入陣列，隨後呼叫 `saveCardsToStorage()` 存入 localStorage，最後更新畫面。

   //新增卡片
   function addCard() {
   const word = wordInput.value.trim();
   const translation = translationInput.value.trim();

   if (word === '' || translation === '') {
      alert('請填寫完整的單字與中文翻譯！');
      return;
   }

   const newCard = {
      id: Date.now(),
      word: word,
      translation: translation,
      isFlipped: false,
      isRemembered: false
   };

   cards.push(newCard);
   saveCardsToStorage();

   wordInput.value = '';
   translationInput.value = '';

   const activeCards = cards.filter(card => !card.isRemembered);
   currentIndex = activeCards.length - 1;

   renderCard();
   }

3. **篩選與動態渲染流程 (`renderCard`)**：
   畫面繪製時，會先透過 `filter()` 方法過濾出 `isRemembered === false`（尚未熟記）的活躍單字。若清單為空則顯示完成提示；若有資料則根據 `currentIndex` 與 `isFlipped` 狀態，動態透過 `innerHTML` 重新產生 DOM 元素。

   //畫面與資料同步
   function renderCard() {
   if (!cardArea) return;

   const activeCards = cards.filter(card => !card.isRemembered);

   if (activeCards.length === 0) {
      cardArea.innerHTML = `
         <div class="empty-msg" style="padding: 20px; background: #e8f5e9; border-radius: 8px; color: #2e7d32; text-align: center;">
         目前的單字都已經標記為熟記了<br>
         <small style="color: #666;">點擊下方「重製所有單字」按鈕可以重新複習全部單字。</small>
         </div>`;
      return;
   }

   if (currentIndex >= activeCards.length) {
      currentIndex = activeCards.length - 1;
   }
   if (currentIndex < 0) {
      currentIndex = 0;
   }

   const currentCard = activeCards[currentIndex];
   const displayText = currentCard.isFlipped ? currentCard.translation : currentCard.word;

   let cardClass = 'flashcard';
   if (currentCard.isFlipped) cardClass += ' flipped';

   cardArea.innerHTML = `
      <div class="${cardClass}" id="mainCard" style="width: 100%; height: 150px; background-color: #2196F3; color: white; border-radius: 10px; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 24px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
         <p style="margin: 0;">${displayText}</p>
         <small style="font-size: 12px; margin-top: 10px; opacity: 0.8;">
         (未熟記第 ${currentIndex + 1} / ${activeCards.length} 張) - 點擊卡片可直接翻面
         </small>
      </div>
   `;
   }

4. **互動切換流程（隨機抽卡與翻面）**：
   - 點擊卡片本體會觸發 `flipCard()`，反轉當前物件的 `isFlipped` 布林值並重新渲染。
   - 點擊「隨機抽卡」會透過 `Math.random()` 隨機改變 `currentIndex` 索引，並強制將新卡片的正面顯示出來。

   //翻卡看翻譯
   function flipCard() {
   const activeCards = cards.filter(card => !card.isRemembered);
   if (activeCards.length === 0) return;

   const currentCard = activeCards[currentIndex];
   const target = cards.find(c => c.id === currentCard.id);
   if (target) {
      target.isFlipped = !target.isFlipped;
      saveCardsToStorage();
      renderCard();
   }
   }

   //隨機抽取
   function randomCard() {
   const activeCards = cards.filter(card => !card.isRemembered);
   if (activeCards.length === 0) {
      alert('目前沒有可隨機抽取的單字！');
      return;
   }
   if (activeCards.length === 1) {
      alert('目前只有一張未熟記的單字卡！');
      return;
   }

   let randomIndex;
   do {
      randomIndex = Math.floor(Math.random() * activeCards.length); //改變index中的排列方式 達到出現隨機單字的效果
   } while (randomIndex === currentIndex && activeCards.length > 1);

   currentIndex = randomIndex;
   
   const currentCard = activeCards[currentIndex];
   const target = cards.find(c => c.id === currentCard.id);
   if (target) {
      target.isFlipped = false;
   }

   saveCardsToStorage();
   renderCard();
   }

   //上一張
   function prevCard() {
   const activeCards = cards.filter(card => !card.isRemembered);
   if (activeCards.length === 0) return;

   if (currentIndex > 0) {
      currentIndex--;
      const currentCard = activeCards[currentIndex];
      const target = cards.find(c => c.id === currentCard.id);
      if (target) target.isFlipped = false;
      
      saveCardsToStorage();
      renderCard();
   } else {
      alert('已經是第一張單字卡囉！');
   }
   }

   //下一張
   function nextCard() {
   const activeCards = cards.filter(card => !card.isRemembered);
   if (activeCards.length === 0) return;

   if (currentIndex < activeCards.length - 1) {
      currentIndex++;
      const currentCard = activeCards[currentIndex];
      const target = cards.find(c => c.id === currentCard.id);
      if (target) target.isFlipped = false;
      
      saveCardsToStorage();
      renderCard();
   } else {
      alert('已經是最後一張單字卡囉！');
   }
   }

5. **熟記隱藏與重製流程**：
   - 點擊標記熟記會將該物件的 `isRemembered` 設為 `true`，利用 `filter()` 機制使其暫時從當前複習畫面中隱藏。
   - 點擊「重製」按鈕則會透過 `forEach()` 將所有單字的 `isRemembered` 全部改回 `false`，讓全部單字重新回到複習清單中。

   //熟記
   function toggleRemember() {
   const activeCards = cards.filter(card => !card.isRemembered);
   if (activeCards.length === 0) return;

   const currentCard = activeCards[currentIndex];
   const target = cards.find(c => c.id === currentCard.id);
   
   if (target) {
      target.isRemembered = true;
      target.isFlipped = false;
      
      saveCardsToStorage();

      if (currentIndex > 0) {
         currentIndex--;
      }
      
      renderCard();
   }
   }

   //重製
   function resetCards() {
   const confirmReset = confirm('確定要重製所有單字卡嗎？');
   if (confirmReset) {
      cards.forEach(card => {
         card.isRemembered = false;
         card.isFlipped = false;
      });
      currentIndex = 0;
      saveCardsToStorage();
      renderCard();
      alert('已成功重製所有單字卡！');
   }
   }

   //刪除
   function deleteCard() {
   const activeCards = cards.filter(card => !card.isRemembered);
   if (activeCards.length === 0) {
      alert('目前沒有可刪除的單字！');
      return;
   }

   const currentCard = activeCards[currentIndex];
   const confirmDelete = confirm(`確定要從資料庫永久刪除單字「${currentCard.word}」嗎？`);
   
   if (confirmDelete) {
      cards = cards.filter(c => c.id !== currentCard.id);
      
      const updatedActiveCards = cards.filter(card => !card.isRemembered);
      if (currentIndex >= updatedActiveCards.length && currentIndex > 0) {
         currentIndex--;
      }
      
      saveCardsToStorage();
      renderCard();
   }
   }
