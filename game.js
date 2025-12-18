const tg = window.Telegram.WebApp;
tg.expand();

// === БАЗА КАРТ (ЛОР) ===
const CARDS = [
    { id: 1, name: "Тимофей", cost: 2, atk: 2, hp: 3, img: "https://i.postimg.cc/fbXxcyPS/photo-2025-11-16-23-23-40.jpg", desc: "Раб-котик" },
    { id: 2, name: "Нейронка", cost: 3, atk: 3, hp: 2, img: "https://i.postimg.cc/Lsfzt5WS/photo-2025-11-16-23-24-34.jpg", desc: "А ты здесь откуда?" },
    { id: 3, name: "Валера", cost: 4, atk: 4, hp: 5, img: "https://i.postimg.cc/NGp3FhPc/photo_2025_12_15_23_27_47.jpg", desc: "Магнат" },
    { id: 4, name: "Вафля", cost: 3, atk: 1, hp: 6, img: "https://i.postimg.cc/66Ykqs1s/photo_2025_12_15_23_28_15.jpg", desc: "Легенда... Таунт" },
    { id: 5, name: "Горем Бот", cost: 1, atk: 1, hp: 2, img: "https://i.postimg.cc/ZR8nGvXF/photo_2025_11_16_21_52_10.jpg", desc: "228" },
    { id: 6, name: "Тиндих", cost: 4, atk: 5, hp: 2, img: "https://i.postimg.cc/rpWS1sHp/photo-2025-11-16-23-23-27.jpg", desc: "Иди на..." },
    { id: 7, name: "Вишня", cost: 2, atk: 3, hp: 1, img: "https://i.postimg.cc/63B9ngtQ/photo_2025_11_30_01_43_10_removebg-preview.png", desc: "Вор крипты" },
    { id: 8, name: "Мяук", cost: 5, atk: 6, hp: 4, img: "https://i.postimg.cc/Vk2q0nD3/g0c7GVV.jpg", desc: "12,7 калибр" }
];

// === СОСТОЯНИЕ ===
let game = {
    turn: 1,
    playerTurn: true,
    player: { hp: 30, mana: 1, maxMana: 1, hand: [], board: [], deck: [] },
    enemy: { hp: 40, mana: 1, maxMana: 1, hand: [], board: [], deck: [] } // У босса больше ХП
};

// === ИНИЦИАЛИЗАЦИЯ ===
function init() {
    // Заполняем колоды случайными картами
    for(let i=0; i<20; i++) {
        game.player.deck.push(createCard());
        game.enemy.deck.push(createCard());
    }
    
    // Стартовая рука
    draw('player', 3);
    draw('enemy', 3);
    
    updateUI();
}

function createCard() {
    const template = CARDS[Math.floor(Math.random() * CARDS.length)];
    return { ...template, uid: Math.random(), canAttack: false, sleep: true };
}

function draw(who, count=1) {
    const target = game[who];
    for(let i=0; i<count; i++) {
        if(target.deck.length > 0 && target.hand.length < 6) {
            target.hand.push(target.deck.pop());
        }
    }
    updateUI();
}

// === ЛОГИКА ИГРОКА ===
function playCard(index) {
    if (!game.playerTurn) return;
    const card = game.player.hand[index];
    
    if (card.cost > game.player.mana) {
        tg.HapticFeedback.notificationOccurred('error');
        return;
    }
    
    if (game.player.board.length >= 5) return;

    game.player.mana -= card.cost;
    game.player.hand.splice(index, 1);
    game.player.board.push(card);
    
    tg.HapticFeedback.impactOccurred('medium');
    updateUI();
}

function attack(attackerIdx, targetType, targetIdx) {
    if (!game.playerTurn) return;
    const attacker = game.player.board[attackerIdx];
    
    if (!attacker.canAttack) return;

    let target;
    if (targetType === 'hero') target = game.enemy;
    else target = game.enemy.board[targetIdx];

    // Бой
    target.hp -= attacker.atk;
    
    // Ответка если бьем существо
    if (targetType === 'unit') {
        attacker.hp -= target.atk;
    }
    
    attacker.canAttack = false;
    attacker.sleep = true; // Устал
    tg.HapticFeedback.impactOccurred('heavy');
    
    cleanBoard();
    updateUI();
    checkWin();
}

function cleanBoard() {
    game.player.board = game.player.board.filter(c => c.hp > 0);
    game.enemy.board = game.enemy.board.filter(c => c.hp > 0);
}

// === ХОДЫ И AI ===
function endTurn() {
    if (!game.playerTurn) return;
    game.playerTurn = false;
    document.getElementById('end-turn').innerText = "ХОД ВРАГА...";
    document.getElementById('end-turn').disabled = true;
    
    // AI Logic
    setTimeout(() => {
        aiPlay();
        setTimeout(() => {
            aiAttack();
            setTimeout(startPlayerTurn, 1000);
        }, 1000);
    }, 1000);
}

function aiPlay() {
    const ai = game.enemy;
    // AI пытается разыграть всё что может
    for (let i = ai.hand.length - 1; i >= 0; i--) {
        if (ai.board.length >= 5) break;
        if (ai.hand[i].cost <= ai.mana) {
            ai.mana -= ai.hand[i].cost;
            ai.board.push(ai.hand[i]);
            ai.hand.splice(i, 1);
        }
    }
    updateUI();
}

function aiAttack() {
    // AI тупой: бьет в лицо, если нет таунтов (таунтов пока нет, так что всегда в лицо)
    game.enemy.board.forEach(unit => {
        if (!unit.sleep) {
            game.player.hp -= unit.atk;
        }
        unit.sleep = false; // Просыпается к следующему ходу
    });
    updateUI();
    checkWin();
}

function startPlayerTurn() {
    game.playerTurn = true;
    
    // Мана
    if (game.player.maxMana < 10) game.player.maxMana++;
    game.player.mana = game.player.maxMana;
    
    if (game.enemy.maxMana < 10) game.enemy.maxMana++;
    game.enemy.mana = game.enemy.maxMana;

    // Пробуждение существ
    game.player.board.forEach(c => { c.canAttack = true; c.sleep = false; });
    
    draw('player');
    draw('enemy');
    
    updateUI();
}

// === ОТРИСОВКА ===
function updateUI() {
    document.getElementById('player-hp').innerText = game.player.hp;
    document.getElementById('enemy-hp').innerText = game.enemy.hp;
    document.getElementById('player-mana').innerText = game.player.mana;
    document.getElementById('max-mana').innerText = game.player.maxMana;
    
    const btn = document.getElementById('end-turn');
    if (game.playerTurn) {
        btn.innerText = "ЗАКОНЧИТЬ";
        btn.disabled = false;
        btn.style.background = "#00ff88";
    }

    renderHand('player-hand', game.player.hand, true);
    renderHand('enemy-hand', game.enemy.hand, false);
    renderBoard('player-board', game.player.board, true);
    renderBoard('enemy-board', game.enemy.board, false);
}

function renderHand(id, cards, isPlayer) {
    const el = document.getElementById(id);
    el.innerHTML = '';
    cards.forEach((c, i) => {
        const div = document.createElement('div');
        div.className = 'card';
        if (isPlayer) {
            div.style.backgroundImage = `url('${c.img}')`;
            div.innerHTML = `
                <div class="card-cost">${c.cost}</div>
                <div class="card-atk">⚔️${c.atk}</div>
                <div class="card-hp">❤️${c.hp}</div>
            `;
            div.onclick = () => playCard(i);
        } else {
            // Рубашка
        }
        el.appendChild(div);
    });
}

function renderBoard(id, cards, isPlayer) {
    const el = document.getElementById(id);
    el.innerHTML = '';
    
    if (!isPlayer && cards.length === 0) {
        // Если у врага нет карт, клик по полю = атака в лицо
         el.onclick = () => {
             const attackerIdx = game.player.board.findIndex(c => c.selected);
             if (attackerIdx !== -1) attack(attackerIdx, 'hero');
         };
    } else {
        el.onclick = null;
    }

    cards.forEach((c, i) => {
        const div = document.createElement('div');
        div.className = `card ${c.sleep && isPlayer ? 'exhausted' : ''}`;
        if (isPlayer && c.canAttack && !c.sleep) div.classList.add('can-attack');
        
        div.style.backgroundImage = `url('${c.img}')`;
        div.innerHTML = `
            <div class="card-atk">⚔️${c.atk}</div>
            <div class="card-hp">❤️${c.hp}</div>
        `;

        if (isPlayer) {
            div.onclick = (e) => {
                e.stopPropagation();
                // Выделение для атаки
                game.player.board.forEach(card => card.selected = false);
                if (c.canAttack && !c.sleep) {
                    c.selected = true;
                    tg.HapticFeedback.selectionChanged();
                    // Визуально можно добавить класс selected, но для MVP пропустим
                }
            };
        } else {
            div.onclick = (e) => {
                e.stopPropagation();
                // Если выбрана своя карта - атакуем эту
                const attackerIdx = game.player.board.findIndex(x => x.selected);
                if (attackerIdx !== -1) {
                    attack(attackerIdx, 'unit', i);
                }
            };
        }
        el.appendChild(div);
    });
    
    // Атака в лицо (костыль для MVP: клик по аватарке врага)
    if (!isPlayer) {
        document.querySelector('.enemy-hero').onclick = () => {
            const attackerIdx = game.player.board.findIndex(x => x.selected);
            if (attackerIdx !== -1) attack(attackerIdx, 'hero');
        };
    }
}

function checkWin() {
    if (game.player.hp <= 0) showEnd("ПОРАЖЕНИЕ", "Алексей захватил сервер.");
    else if (game.enemy.hp <= 0) showEnd("ПОБЕДА", "Вы защитили честь Горема!");
}

function showEnd(title, desc) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-desc').innerText = desc;
    document.getElementById('modal').classList.remove('hidden');
}

init();
