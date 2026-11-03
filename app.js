let cards = JSON.parse(localStorage.getItem('flashcards')) || [

];

let currentIndex = 0;


const cardArea = document.querySelector('#cardArea');
const wordInput = document.querySelector('#wordInput');
const translationInput = document.querySelector('#translationInput');
const addBtn = document.querySelector('#addBtn');
const prevBtn = document.querySelector('#prevBtn');
const nextBtn = document.querySelector('#nextBtn');
const randomBtn = document.querySelector('#randomBtn'); 
const markBtn = document.querySelector('#markBtn');
const deleteBtn = document.querySelector('#deleteBtn');

//儲存新增的單字
function saveCardsToStorage() {
  localStorage.setItem('flashcards', JSON.stringify(cards));
}

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
    randomIndex = Math.floor(Math.random() * activeCards.length);
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


// 監聽器
if (addBtn) addBtn.addEventListener('click', addCard);
if (randomBtn) randomBtn.addEventListener('click', randomCard); 
if (markBtn) markBtn.addEventListener('click', toggleRemember);
if (deleteBtn) deleteBtn.addEventListener('click', deleteCard);
if (prevBtn) prevBtn.addEventListener('click', prevCard);
if (nextBtn) nextBtn.addEventListener('click', nextCard);

if (cardArea) {
  cardArea.addEventListener('click', function(e) {
    const mainCard = e.target.closest('#mainCard');
    if (mainCard) {
      flipCard(); 
    }
  });
}

renderCard();