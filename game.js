const tg = window.Telegram.WebApp;
tg.expand();

// === ДАННЫЕ ===
// Карты из базы бота
const CARDS = [
    { id: 1, name: "Тимофей", cost: 2, atk: 2, hp: 3, img: "https://i.postimg.cc/fbXxcyPS/photo-2025-11-16-23-23-40.jpg" },
    { id: 2, name: "Нейронка", cost: 3, atk: 3, hp: 2, img: "https://i.postimg.cc/Lsfzt5WS/photo-2025-11-16-23-24-34.jpg" },
    { id: 3, name: "Валера", cost: 4, atk: 4, hp: 5, img: "https://i.postimg.cc/NGp3FhPc/photo_2025_12_15_23_27_47.jpg" },
    { id: 4, name: "Вафля", cost: 3, atk: 1, hp: 6, img: "https://i.postimg.cc/66Ykqs1s/photo_2025_12_15_23_28_15.jpg" }, // Танк
    { id: 5, name: "Мяук", cost: 5, atk: 6, hp: 4, img: "https://i.postimg.cc/Vk2q0nD3/g0c7GVV.jpg" },
    { id: 6, name: "Вишня", cost: 2, atk: 3, hp: 1, img: "https://i.postimg.cc/63B9ngtQ/photo_2025_11_30_01_43_10_removebg-preview.png" },
    { id: 7, name: "Тиндих", cost: 4, atk: 5, hp: 2, img: "https://i.postimg.cc/rpWS1sHp/photo-2025-11-16-23-23-27.jpg" }
];

// Новогодние карты для награды
const REWARDS = [
    { name: "Новогодний Котар", img: "https://i.postimg.cc/0Q33mdRs/photo-2025-11-30-02-08-33-removebg-preview.png" },
    { name: "Санта Алексей", img: "https://i.postimg.cc/FsTD4L7L/santaaleksey-removebg-preview.png" },
    { name: "Лже-Санта", img: "https://i.postimg.cc/gc5CPQQb/download-removebg-preview.png" }
];

let game = {
    turn: 1,
    playerTurn: true,
    player: { hp: 30, mana: 1, maxMana: 1, hand: [], board: [], deck: [] },
    enemy: { hp: 40, mana: 1, maxMana: 1, hand: [], board: [], deck: [] },
    dragged: null // { source: 'hand'|'board', index: 0, cardData: {} }
};

// === INIT ===
function init() {
    // Собираем колоды
    for(let i=0; i<20; i++) {
        game.player.deck.push(createCard());
        game.enemy.deck.push(createCard());
    }
    draw('player', 4); // Игроку чуть больше карт для старта
    draw('enemy', 3);
    updateUI();
    setupDragAndDrop();
}

function createCard() {
    const template = CARDS[Math.floor(Math.random() * CARDS.length)];
    return { ...template, uid: Math.random(), sleep: true, currentHp: template.hp };
}

function draw(who, count) {
    const p = game[who];
    for(let i=0; i<count; i++) {
        if(p.deck.length > 0 && p.hand.length < 6) p.hand.push(p.deck.pop());
    }
}

// === DRAG AND DROP SYSTEM (TOUCH & MOUSE) ===
function setupDragAndDrop() {
    const app = document.getElementById('app');
    
    // Начало перетаскивания
    const startDrag = (e) => {
        if (!game.playerTurn) return;
        const target = e.target.closest('.card');
        if (!target) return;

        // Определяем, откуда тянем (рука или стол)
        const parentId = target.parentElement.id;
        const index = parseInt(target.dataset.index);
        
        if (parentId === 'player-hand') {
            const card = game.player.hand[index];
            if (card.cost > game.player.mana) { tg.HapticFeedback.notificationOccurred('error'); return; }
            game.dragged = { source: 'hand', index, card };
        } else if (parentId === 'player-board') {
            const card = game.player.board[index];
            if (card.sleep) { tg.HapticFeedback.notificationOccurred('warning'); return; }
            game.dragged = { source: 'board', index, card };
        } else {
            return;
        }

        // Создаем визуальный клон
        const proxy = document.getElementById('drag-proxy');
        proxy.style.backgroundImage = `url('${game.dragged.card.img}')`;
        proxy.innerHTML = target.innerHTML; // Копируем статы
        proxy.classList.remove('hidden');
        proxy.classList.add('dragging');
        
        moveDrag(e); // Сразу позиционируем
        
        // Подсветка зон
        if (game.dragged.source === 'hand') {
            document.getElementById('player-board').classList.add('highlight');
        }
    };

    // Движение
    const moveDrag = (e) => {
        if (!game.dragged) return;
        e.preventDefault();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const proxy = document.getElementById('drag-proxy');
        proxy.style.left = (clientX - 40) + 'px'; // Центрируем (ширина 80/2)
        proxy.style.top = (clientY - 60) + 'px'; // Центрируем (высота 120/2)
        
        // Проверка наведения для подсветки
        checkHover(clientX, clientY);
    };

    // Конец перетаскивания
    const endDrag = (e) => {
        if (!game.dragged) return;
        const proxy = document.getElementById('drag-proxy');
        proxy.classList.add('hidden');
        document.getElementById('player-board').classList.remove('highlight');
        document.querySelectorAll('.target-highlight').forEach(el => el.classList.remove('target-highlight'));

        // Определяем, куда бросили
        const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
        const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
        const dropTarget = document.elementFromPoint(clientX, clientY);

        if (game.dragged.source === 'hand') {
            // Розыгрыш карты: Бросили на "player-board" или "battlefield"
            if (dropTarget.closest('#player-board') || dropTarget.closest('.battlefield')) {
                playCard(game.dragged.index);
            }
        } else if (game.dragged.source === 'board') {
            // Атака: Бросили на врага (героя или карту)
            const enemyUnit = dropTarget.closest('#enemy-board .card');
            const enemyHero = dropTarget.closest('#enemy-hero-zone');
            
            if (enemyUnit) {
                const targetIndex = parseInt(enemyUnit.dataset.index);
                attack(game.dragged.index, 'unit', targetIndex);
            } else if (enemyHero) {
                attack(game.dragged.index, 'hero', 0);
            }
        }

        game.dragged = null;
    };

    app.addEventListener('mousedown', startDrag);
    app.addEventListener('touchstart', startDrag, {passive: false});
    
    window.addEventListener('mousemove', moveDrag);
    window.addEventListener('touchmove', moveDrag, {passive: false});
    
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);
}

function checkHover(x, y) {
    // Убираем старую подсветку
    document.querySelectorAll('.target-highlight').forEach(el => el.classList.remove('target-highlight'));
    
    // Элемент под пальцем (скрываем прокси на секунду, чтобы пробить его)
    const proxy = document.getElementById('drag-proxy');
    proxy.style.visibility = 'hidden';
    const elem = document.elementFromPoint(x, y);
    proxy.style.visibility = 'visible';

    if (!elem) return;

    if (game.dragged.source === 'board') {
        // Подсветка врагов при атаке
        if (elem.closest('#enemy-board .card') || elem.closest('.enemy-hero')) {
            const target = elem.closest('.card') || elem.closest('.hero');
            target.classList.add('target-highlight');
        }
    }
}

// === ЛОГИКА ===
function playCard(index) {
    if (game.player.board.length >= 5) { tg.showAlert("Стол полон!"); return; }
    
    const card = game.player.hand[index];
    game.player.mana -= card.cost;
    game.player.hand.splice(index, 1);
    
    // Выход на стол
    game.player.board.push({ ...card, sleep: true });
    
    tg.HapticFeedback.impactOccurred('medium');
    updateUI();
}

function attack(attackerIdx, type, targetIdx) {
    const attacker = game.player.board[attackerIdx];
    let target;
    
    if (type === 'hero') target = game.enemy;
    else target = game.enemy.board[targetIdx];
    
    // Анимация удара (визуально можно добавить позже)
    target.hp -= attacker.atk;
    if (type !== 'hero') attacker.currentHp -= target.atk; // Ответка
    
    attacker.sleep = true;
    tg.HapticFeedback.impactOccurred('heavy');
    
    resolveCombat();
}

function resolveCombat() {
    // Убираем мертвых
    game.player.board = game.player.board.filter(c => c.currentHp > 0);
    game.enemy.board = game.enemy.board.filter(c => c.currentHp > 0);
    
    updateUI();
    
    if (game.enemy.hp <= 0) winGame();
    if (game.player.hp <= 0) loseGame();
}

// === AI (Умный) ===
function endTurn() {
    game.playerTurn = false;
    updateUI();
    
    // ИИ думает
    setTimeout(() => {
        const ai = game.enemy;
        
        // 1. Розыгрыш карт
        // Пытается сыграть самую дорогую карту, которую может себе позволить
        ai.hand.sort((a,b) => b.cost - a.cost); // Сортировка по убыванию стоимости
        
        // Простой цикл попытки сыграть карты
        let played = true;
        while(played && ai.board.length < 5) {
            played = false;
            for(let i=0; i<ai.hand.length; i++) {
                if(ai.hand[i].cost <= ai.mana) {
                    ai.mana -= ai.hand[i].cost;
                    ai.board.push({ ...ai.hand[i], sleep: true });
                    ai.hand.splice(i, 1);
                    played = true;
                    break; 
                }
            }
        }
        updateUI();

        // 2. Атака (через паузу)
        setTimeout(() => {
            ai.board.forEach(attacker => {
                if(attacker.sleep) return;
                
                // ЛОГИКА АТАКИ:
                // 1. Если у игрока есть существо, которое ИИ убивает и выживает -> Бьем его (Value Trade)
                // 2. Если у игрока есть существо, которое ИИ убивает (размен) -> Бьем его
                // 3. Иначе -> В лицо
                
                let bestTarget = null;
                let bestScore = -100;

                // Оценка удара по лицу
                const faceScore = 10; 
                
                // Проверяем существ игрока
                game.player.board.forEach((defender, idx) => {
                    let score = 0;
                    if (attacker.atk >= defender.currentHp) score += 20; // Килл
                    if (attacker.currentHp > defender.atk) score += 10; // Выживание
                    
                    // Если очень выгодный размен (убить сильного слабым)
                    if (attacker.atk >= defender.currentHp && attacker.cost < defender.cost) score += 30;

                    if (score > bestScore) {
                        bestScore = score;
                        bestTarget = idx;
                    }
                });

                if (bestTarget !== null && bestScore > faceScore) {
                    // Бьем существо
                    const def = game.player.board[bestTarget];
                    def.currentHp -= attacker.atk;
                    attacker.currentHp -= def.atk;
                } else {
                    // Бьем лицо
                    game.player.hp -= attacker.atk;
                }
            });
            
            attacker.sleep = false; // Просыпается к след ходу
            resolveCombat();
            
            // Конец хода ИИ
            setTimeout(() => {
                startPlayerTurn();
            }, 800);
        }, 800);
    }, 500);
}

function startPlayerTurn() {
    game.turn++;
    if (game.player.maxMana < 10) game.player.maxMana++;
    game.player.mana = game.player.maxMana;
    
    if (game.enemy.maxMana < 10) game.enemy.maxMana++;
    game.enemy.mana = game.enemy.maxMana;
    
    draw('player', 1);
    draw('enemy', 1);
    
    // Пробуждение
    game.player.board.forEach(c => c.sleep = false);
    game.enemy.board.forEach(c => c.sleep = false);
    
    game.playerTurn = true;
    updateUI();
}

// === UI RENDER ===
function updateUI() {
    document.getElementById('player-hp').innerText = game.player.hp;
    document.getElementById('enemy-hp').innerText = game.enemy.hp;
    document.getElementById('player-mana').innerText = game.player.mana;
    document.getElementById('max-mana').innerText = game.player.maxMana;
    
    const btn = document.getElementById('end-turn');
    btn.innerText = game.playerTurn ? "ЗАКОНЧИТЬ" : "ВРАГ ХОДИТ...";
    btn.disabled = !game.playerTurn;

    renderContainer('player-hand', game.player.hand, true);
    renderContainer('enemy-hand', game.enemy.hand, false); // false = рубашки
    renderBoard('player-board', game.player.board, true);
    renderBoard('enemy-board', game.enemy.board, false);
}

function renderContainer(id, list, isPlayer) {
    const el = document.getElementById(id);
    el.innerHTML = '';
    list.forEach((c, i) => {
        const div = createCardElement(c, isPlayer);
        div.dataset.index = i; // Для Drag and Drop
        el.appendChild(div);
    });
}

function renderBoard(id, list, isPlayer) {
    const el = document.getElementById(id);
    el.innerHTML = '';
    list.forEach((c, i) => {
        const div = createCardElement(c, true); // На столе всегда лицом вверх
        div.dataset.index = i;
        if (isPlayer && !c.sleep) div.classList.add('can-attack');
        if (c.sleep) div.classList.add('exhausted');
        el.appendChild(div);
    });
}

function createCardElement(c, faceUp) {
    const div = document.createElement('div');
    div.className = 'card';
    if (!faceUp) {
        div.classList.add('back'); // Рубашка
        div.style.background = `repeating-linear-gradient(45deg, #111, #111 10px, #333 10px, #333 20px)`;
        return div;
    }
    
    div.style.backgroundImage = `url('${c.img}')`;
    div.innerHTML = `
        <div class="card-stats-overlay"></div>
        <div class="stat-val c-cost">${c.cost}</div>
        <div class="stat-val c-atk">⚔️${c.atk}</div>
        <div class="stat-val c-hp">❤️${c.currentHp || c.hp}</div>
    `;
    return div;
}

// === ПОБЕДА И НАГРАДА ===
function winGame() {
    document.getElementById('modal').classList.remove('hidden');
    document.getElementById('modal-title').innerText = "ПОБЕДА!";
    document.getElementById('modal-desc').innerText = "Нажми на подарок!";
    document.getElementById('gift-container').classList.remove('hidden');
    document.getElementById('restart-btn').classList.add('hidden'); // Скрываем рестарт пока не открыл
    tg.HapticFeedback.notificationOccurred('success');
}

function loseGame() {
    document.getElementById('modal').classList.remove('hidden');
    document.getElementById('modal-title').innerText = "ПОРАЖЕНИЕ";
    document.getElementById('modal-desc').innerText = "Алексей оказался сильнее...";
    document.getElementById('gift-container').classList.add('hidden');
    document.getElementById('restart-btn').classList.remove('hidden');
    tg.HapticFeedback.notificationOccurred('error');
}

function openGift() {
    const giftBox = document.querySelector('.gift-box');
    const reveal = document.getElementById('card-reveal');
    const reward = REWARDS[Math.floor(Math.random() * REWARDS.length)];
    
    giftBox.style.display = 'none';
    reveal.classList.remove('hidden');
    
    document.getElementById('reward-img').src = reward.img;
    document.getElementById('reward-name').innerText = reward.name;
    
    document.getElementById('claim-btn').classList.remove('hidden');
    tg.HapticFeedback.impactOccurred('heavy');
}

function closeApp() {
    // Отправляем данные боту (если нужно) и закрываем
    // tg.sendData(JSON.stringify({ action: 'win' })); 
    tg.close();
}

init();
