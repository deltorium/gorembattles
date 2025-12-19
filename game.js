const tg = window.Telegram.WebApp;
tg.expand();

// === БАЗА ИГРОВЫХ КАРТ (КОЛОДА) ===
const CARDS = [
    { id: 1, name: "Тимофей", cost: 2, atk: 2, hp: 3, img: "https://i.postimg.cc/fbXxcyPS/photo-2025-11-16-23-23-40.jpg" },
    { id: 2, name: "Нейронка", cost: 3, atk: 3, hp: 2, img: "https://i.postimg.cc/Lsfzt5WS/photo-2025-11-16-23-24-34.jpg" },
    { id: 3, name: "Валера", cost: 4, atk: 4, hp: 5, img: "https://i.postimg.cc/NGp3FhPc/photo_2025_12_15_23_27_47.jpg" },
    { id: 4, name: "Вафля", cost: 3, atk: 1, hp: 6, img: "https://i.postimg.cc/66Ykqs1s/photo_2025_12_15_23_28_15.jpg" },
    { id: 5, name: "Мяук", cost: 5, atk: 6, hp: 4, img: "https://i.postimg.cc/Vk2q0nD3/g0c7GVV.jpg" },
    { id: 6, name: "Вишня", cost: 2, atk: 3, hp: 1, img: "https://i.postimg.cc/63B9ngtQ/photo_2025_11_30_01_43_10_removebg-preview.png" },
    { id: 7, name: "Тиндих", cost: 4, atk: 5, hp: 2, img: "https://i.postimg.cc/rpWS1sHp/photo-2025-11-16-23-23-27.jpg" },
    { id: 8, name: "Горем", cost: 1, atk: 2, hp: 1, img: "https://i.postimg.cc/ZR8nGvXF/photo_2025_11_16_21_52_10.jpg" }
];

// === ВИЗУАЛЬНЫЕ НАГРАДЫ (ПОЛНЫЙ СПИСОК ИЗ БОТА) ===
const VISUAL_REWARDS = [
    { name: "Жена Юджина", img: "https://i.postimg.cc/9Q4Q3VCj/3F3F_3F3F3F.webp" },
    { name: "Нарко-Сова", img: "https://i.postimg.cc/0y6ygxxL/3F3F3F3F.webp" },
    { name: "Beer Belly Bob", img: "https://i.postimg.cc/zGLGm55M/Beer_Belly_Bob.webp" },
    { name: "Олень из будущего", img: "https://i.postimg.cc/NjyjhYYZ/Deer_from_the_future.webp" },
    { name: "Олень из соседней комнаты", img: "https://i.postimg.cc/yYp8rW4K/3F3F3F3F3F3F3F3F3F3F3F.webp" },
    { name: "Олень подкалывающий", img: "https://i.postimg.cc/65bp1TJJ/3F3F3F3F3F3F3F3F3F.webp" },
    { name: "PowerDrish", img: "https://i.postimg.cc/X71YDXS6/Power_Drish_3F.webp" },
    { name: "Аркадий Анатольевич", img: "https://i.postimg.cc/8PXzns83/3F3F3F3F3F3F3F3F3F1.webp" },
    { name: "Ароматный Пестик", img: "https://i.postimg.cc/289SX3Rp/3F3F3F3F3F3F3F_2.webp" },
    { name: "Астероид-Юджин", img: "https://i.postimg.cc/VLZkH5yp/3F3F3F3F_3F3F.webp" },
    { name: "Пингвикрыл", img: "https://i.postimg.cc/pXcL1yNS/3F3F3F3F3F.webp" },
    { name: "Повидло", img: "https://i.postimg.cc/xTp1Fqr6/3F3F3F.webp" },
    { name: "Ползун", img: "https://i.postimg.cc/RVpZbqrG/3F3F_3F3F3F.webp" },
    { name: "Полоскун", img: "https://i.postimg.cc/xTp1FqrR/3F3F3F3F_3F3F3F.webp" },
    { name: "Безумный Дракон", img: "https://i.postimg.cc/wT4jb3K0/3F3F3F1.webp" },
    { name: "Билли Боб", img: "https://i.postimg.cc/HsvkPjG9/3F3F.webp" },
    { name: "Брат Фернандо", img: "https://i.postimg.cc/PrV5FNGb/3F3F3F3F2.webp" },
    { name: "Радужная Форель", img: "https://i.postimg.cc/TYN3Hh8q/3F3F3F3F_3F3F3F.webp" },
    { name: "Раптор", img: "https://i.postimg.cc/3JfxbWMX/3F3F3F.webp" },
    { name: "Ружьё", img: "https://i.postimg.cc/YqDCyjcQ/3F3F_3F.webp" },
    { name: "Рыба-вода", img: "https://i.postimg.cc/ZKs5D0k3/3F3F_3F3F_1.webp" },
    { name: "Рыба-меч", img: "https://i.postimg.cc/5N2t3Lr5/3F3F_3F_new.webp" },
    { name: "Рыбы-маги", img: "https://i.postimg.cc/Pr5q4Y7m/ор3F3F_3F3F.webp" },
    { name: "Весло", img: "https://i.postimg.cc/L6Q80hdL/323F3F.webp" },
    { name: "Вибро-плот", img: "https://i.postimg.cc/kXg5cKHs/3F3F3F3F3F3F3F3F3F.webp" },
    { name: "Гарри", img: "https://i.postimg.cc/CLxKNk2k/3F3F_3щпн_F.webp" },
    { name: "Грибник", img: "https://i.postimg.cc/tC4g5Wc6/3Fцпкцкпу3F3F.webp" },
    { name: "Грустный труп", img: "https://i.postimg.cc/Wb14ngyJ/3F3F3F3F_3F3F.webp" },
    { name: "Гусемедведь", img: "https://i.postimg.cc/c4LJmwzn/3F3F3F3F3F.webp" },
    { name: "Сара", img: "https://i.postimg.cc/Pr5q4Y7P/3F3F1.webp" },
    { name: "Джеремия", img: "https://i.postimg.cc/Pr5q4Y7p/3F3кыуп_F3F3F2.webp" },
    { name: "Додо", img: "https://i.postimg.cc/nchLkBWV/3F3F.webp" },
    { name: "Скат-слуга", img: "https://i.postimg.cc/X7Yv8dPW/3F3F_3F3F.webp" },
    { name: "Сталкер Саня", img: "https://i.postimg.cc/m2grwCn2/3F3F3уепкеупк_F3F.webp" },
    { name: "Старейшина", img: "https://i.postimg.cc/GhmpQGfr/3руе_F3F3F3F3F.webp" },
    { name: "Старец Юджин", img: "https://i.postimg.cc/xjRCMt6q/3F3F3F_3F3F.webp" },
    { name: "Евгений Анус", img: "https://i.postimg.cc/KcNzBJ0v/3F3F3Fруекурек3F3F.webp" },
    { name: "Супер Акулы", img: "https://i.postimg.cc/6603nYMW/3F3F3F3F3F1.webp" },
    { name: "Зажигалка", img: "https://i.postimg.cc/SQrsCDgm/3Fуркеукер3F3F3F.webp" },
    { name: "Зомби-Юджин", img: "https://i.postimg.cc/Wpn3gX5c/3F3F3укеруекр_F3F3F.webp" },
    { name: "Тренер", img: "https://i.postimg.cc/HW2xXBBF/3Fцпукпуцпук3F3F1.webp" },
    { name: "Кабан Банан", img: "https://i.postimg.cc/L4TXLNxd/Кабан.webp" },
    { name: "Капитан Краб", img: "https://i.postimg.cc/mZwDC88q/8DF8AC90_735E_495C_ABAA_98B2DD005F2B.webp" },
    { name: "Уилсон", img: "https://i.postimg.cc/GtqmRm4k/3F3Fкцуцупк3F.webp" },
    { name: "Кижуч", img: "https://i.postimg.cc/hvptntXV/3F3Fцукпцукп.webp" },
    { name: "Кит", img: "https://i.postimg.cc/BbMn3njH/3F.webp" },
    { name: "Фернандо", img: "https://i.postimg.cc/1XJ3S38F/3F3F3F3F.webp" },
    { name: "Компас", img: "https://i.postimg.cc/MHdpwpnQ/3F3F3F283F_3F3F3F).webp" },
    { name: "Красная луна", img: "https://i.postimg.cc/T1C3x3Km/3F3F3F3Fкцпкуцкуцп3F.webp" },
    { name: "Француз", img: "https://i.postimg.cc/J0Pz8zsH/3F3куцпцупуц_F3F.webp" },
    { name: "Лама Кинг", img: "https://i.postimg.cc/QC0dDdFB/3F3F_3F3F.webp" },
    { name: "Холодильник", img: "https://i.postimg.cc/x8t1Q1Xb/Холодильник.webp" },
    { name: "Маг", img: "https://i.postimg.cc/hvptntXv/3цкппкц_F3F_3F3F.webp" },
    { name: "Чайка", img: "https://i.postimg.cc/hvptntXf/3F3Fцукпцукп.webp" },
    { name: "Мак Высер", img: "https://i.postimg.cc/Y0bC7Cvr/Mac_Viser.webp" },
    { name: "Мак Старец", img: "https://i.postimg.cc/Y0bC7Cv7/3F3F3укпуп_F3F.webp" },
    { name: "Медуза", img: "https://i.postimg.cc/sxwgzgMy/3негег_F3F3F.webp" },
    { name: "Шыпоштык", img: "https://i.postimg.cc/nr0hxhXn/3ыреруер_F3F3F3F.webp" },
    { name: "МерзкоЗмей", img: "https://i.postimg.cc/sxVgbhg3/3цпуц_F3F3F3F3F.webp" },
    { name: "Микроволновка", img: "https://i.postimg.cc/QCXdvTdh/3F3F3F3F3F3F_2.webp" },
    { name: "Юджин Всемогущий", img: "https://i.postimg.cc/XqVYtCYV/3F3F3F3F3F3F3F.webp" },
    { name: "Минералоискатель", img: "https://i.postimg.cc/qqjvrvzW/3F3F3F3F3F3F3F3F.webp" },
    { name: "Юджин-Археолог", img: "https://i.postimg.cc/1X93bq3Q/3F3F3F3F3F3F.webp" },
    { name: "Юджин-Коллега", img: "https://i.postimg.cc/HnpkFykm/3F3F3F3F3F3F.webp" },
    { name: "Мистер Друшлак", img: "https://i.postimg.cc/ZnT5Xd5h/3F3F3F_3F3F3F.webp" },
    { name: "Мистер Пэкедж", img: "https://i.postimg.cc/HnpkFyk1/3F3F3F_3F3F3F_new.webp" },
    { name: "№1", img: "https://i.postimg.cc/vTQZCVHJ/3F3F3F3Fкупыукпыукпы.webp" }
];

let game = {
    turn: 1,
    playerTurn: true,
    player: { hp: 30, mana: 1, maxMana: 1, hand: [], board: [], deck: [] },
    enemy: { hp: 40, mana: 1, maxMana: 1, hand: [], board: [], deck: [] },
    dragged: null
};

// === ИНИЦИАЛИЗАЦИЯ ===
function init() {
    for(let i=0; i<20; i++) {
        game.player.deck.push(createCard());
        game.enemy.deck.push(createCard());
    }
    draw('player', 4);
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

// === DRAG & DROP ===
function setupDragAndDrop() {
    const app = document.getElementById('app');
    
    const startDrag = (e) => {
        if (!game.playerTurn) return;
        const target = e.target.closest('.card');
        if (!target) return;

        const parentId = target.parentElement.id;
        const index = parseInt(target.dataset.index);
        
        if (parentId === 'player-hand') {
            const card = game.player.hand[index];
            if (card.cost > game.player.mana) { tg.HapticFeedback.notificationOccurred('error'); return; }
            game.dragged = { source: 'hand', index, card };
            document.getElementById('player-board').classList.add('highlight');
        } else if (parentId === 'player-board') {
            const card = game.player.board[index];
            if (card.sleep) { tg.HapticFeedback.notificationOccurred('warning'); return; }
            game.dragged = { source: 'board', index, card };
        } else return;

        const proxy = document.getElementById('drag-proxy');
        proxy.style.backgroundImage = `url('${game.dragged.card.img}')`;
        proxy.innerHTML = target.innerHTML;
        proxy.classList.remove('hidden');
        proxy.classList.add('dragging');
        moveDrag(e);
    };

    const moveDrag = (e) => {
        if (!game.dragged) return;
        e.preventDefault();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const proxy = document.getElementById('drag-proxy');
        proxy.style.left = (clientX - 32) + 'px'; 
        proxy.style.top = (clientY - 45) + 'px';
        checkHover(clientX, clientY);
    };

    const endDrag = (e) => {
        if (!game.dragged) return;
        document.getElementById('drag-proxy').classList.add('hidden');
        document.getElementById('player-board').classList.remove('highlight');
        document.querySelectorAll('.target-highlight').forEach(el => el.classList.remove('target-highlight'));

        const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
        const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
        const dropTarget = document.elementFromPoint(clientX, clientY);

        if (game.dragged.source === 'hand') {
            if (dropTarget && (dropTarget.closest('#player-board') || dropTarget.closest('.battlefield'))) {
                playCard(game.dragged.index);
            }
        } else if (game.dragged.source === 'board') {
            if (dropTarget) {
                const enemyUnit = dropTarget.closest('#enemy-board .card');
                const enemyHero = dropTarget.closest('#enemy-hero-zone');
                if (enemyUnit) attack(game.dragged.index, 'unit', parseInt(enemyUnit.dataset.index));
                else if (enemyHero) attack(game.dragged.index, 'hero', 0);
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
    document.querySelectorAll('.target-highlight').forEach(el => el.classList.remove('target-highlight'));
    const proxy = document.getElementById('drag-proxy');
    proxy.style.visibility = 'hidden';
    const elem = document.elementFromPoint(x, y);
    proxy.style.visibility = 'visible';
    if (!elem) return;
    if (game.dragged.source === 'board') {
        const target = elem.closest('#enemy-board .card') || elem.closest('.enemy-hero');
        if (target) target.classList.add('target-highlight');
    }
}

// === ЛОГИКА ИГРОКА ===
function playCard(index) {
    if (game.player.board.length >= 5) return;
    const card = game.player.hand[index];
    game.player.mana -= card.cost;
    game.player.hand.splice(index, 1);
    game.player.board.push({ ...card, sleep: true });
    tg.HapticFeedback.impactOccurred('light');
    updateUI();
}

function attack(attackerIdx, type, targetIdx) {
    const attacker = game.player.board[attackerIdx];
    let target = type === 'hero' ? game.enemy : game.enemy.board[targetIdx];
    
    // Атака
    if (type === 'hero') game.enemy.hp -= attacker.atk;
    else target.currentHp -= attacker.atk;

    // Ответка
    if (type !== 'hero') attacker.currentHp -= target.atk;
    
    attacker.sleep = true;
    tg.HapticFeedback.impactOccurred('medium');
    resolveCombat();
}

function resolveCombat() {
    game.player.board = game.player.board.filter(c => c.currentHp > 0);
    game.enemy.board = game.enemy.board.filter(c => c.currentHp > 0);
    updateUI();
    if (game.enemy.hp <= 0) winGame();
    else if (game.player.hp <= 0) loseGame();
}

// === ИИ И ОЧЕРЕДНОСТЬ ХОДОВ ===
function endTurn() {
    if (!game.playerTurn) return;
    game.playerTurn = false;
    document.getElementById('end-turn').innerText = "ВРАГ...";
    document.getElementById('end-turn').disabled = true;
    
    // Будим существ врага
    game.enemy.board.forEach(c => c.sleep = false);

    // Безопасный запуск фазы ИИ
    setTimeout(() => {
        try {
            aiPlayPhase(); 
        } catch (e) {
            console.error("AI Error:", e);
            startPlayerTurn(); // Аварийная передача хода
        }
    }, 800);
}

function aiPlayPhase() {
    const ai = game.enemy;
    
    // Сортировка: дорогие карты первыми
    ai.hand.sort((a,b) => b.cost - a.cost);
    
    let safetyCounter = 0; // Защита от бесконечного цикла
    let hasPlayed = true;

    // Цикл розыгрыша карт
    while (hasPlayed && ai.board.length < 5 && safetyCounter < 10) {
        hasPlayed = false;
        safetyCounter++;
        
        for (let i = 0; i < ai.hand.length; i++) {
            // Если хватает маны и есть место
            if (ai.hand[i].cost <= ai.mana) {
                ai.mana -= ai.hand[i].cost;
                ai.board.push({ ...ai.hand[i], sleep: true });
                ai.hand.splice(i, 1);
                hasPlayed = true; // Попробуем сыграть еще одну
                break; // Перезапуск цикла for, т.к. массив изменился
            }
        }
    }
    updateUI();
    
    // Гарантированный переход к фазе атаки через 1 сек
    setTimeout(aiAttackPhase, 1000);
}

function aiAttackPhase() {
    const aiBoard = game.enemy.board;
    const activeUnits = aiBoard.filter(u => !u.sleep);
    
    // Если атаковать некем, сразу передаем ход
    if (activeUnits.length === 0) {
        startPlayerTurn();
        return;
    }

    let delay = 0;

    activeUnits.forEach((attacker, i) => {
        // Планируем атаки с задержкой
        setTimeout(() => {
            if (attacker.currentHp <= 0) return; // Уже мертв

            // Логика выбора цели
            let bestTarget = -1;
            let bestScore = -100;

            // Оцениваем существ игрока
            game.player.board.forEach((defender, idx) => {
                let score = 0;
                // 1. Убил и выжил (идеально)
                if (attacker.atk >= defender.currentHp && attacker.currentHp > defender.atk) score += 50;
                // 2. Убил, но умер (размен)
                else if (attacker.atk >= defender.currentHp) score += 20;
                // 3. Просто ударил
                else score += 5;

                if (score > bestScore) {
                    bestScore = score;
                    bestTarget = idx;
                }
            });

            // Если нашли выгодный размен (> 15 очков), бьем существо. Иначе - лицо.
            if (bestTarget !== -1 && bestScore > 15) {
                const def = game.player.board[bestTarget];
                def.currentHp -= attacker.atk;
                attacker.currentHp -= def.atk;
            } else {
                game.player.hp -= attacker.atk;
            }

            attacker.sleep = true;
            resolveCombat();
        }, delay);
        
        delay += 800; // Пауза между ударами
    });

    // Гарантированная передача хода после всех атак
    setTimeout(startPlayerTurn, delay + 500);
}

function startPlayerTurn() {
    game.turn++;
    // Прирост маны (до 10)
    if (game.player.maxMana < 10) game.player.maxMana++;
    game.player.mana = game.player.maxMana;
    if (game.enemy.maxMana < 10) game.enemy.maxMana++;
    game.enemy.mana = game.enemy.maxMana;
    
    draw('player', 1);
    draw('enemy', 1);
    
    // Пробуждение карт игрока
    game.player.board.forEach(c => c.sleep = false);
    
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
    if (game.playerTurn) {
        btn.innerText = "ЗАКОНЧИТЬ";
        btn.disabled = false;
        btn.style.background = "#00ff88";
    } else {
        btn.innerText = "ВРАГ...";
        btn.disabled = true;
        btn.style.background = "#444";
    }

    renderContainer('player-hand', game.player.hand, true);
    renderContainer('enemy-hand', game.enemy.hand, false);
    renderBoard('player-board', game.player.board, true);
    renderBoard('enemy-board', game.enemy.board, false);
}

function createCardElement(c, faceUp) {
    const div = document.createElement('div');
    div.className = 'card';
    if (!faceUp) {
        div.style.background = `repeating-linear-gradient(45deg, #222, #222 5px, #444 5px, #444 10px)`;
        return div;
    }
    div.style.backgroundImage = `url('${c.img}')`;
    div.innerHTML = `
        <div class="stat-val c-cost">${c.cost}</div>
        <div class="stat-val c-atk">${c.atk}</div>
        <div class="stat-val c-hp">${c.currentHp || c.hp}</div>
    `;
    return div;
}

function renderContainer(id, list, isPlayer) {
    const el = document.getElementById(id);
    el.innerHTML = '';
    list.forEach((c, i) => {
        const div = createCardElement(c, isPlayer);
        div.dataset.index = i;
        el.appendChild(div);
    });
}

function renderBoard(id, list, isPlayer) {
    const el = document.getElementById(id);
    el.innerHTML = '';
    list.forEach((c, i) => {
        const div = createCardElement(c, true);
        div.dataset.index = i;
        if (isPlayer && !c.sleep) div.classList.add('can-attack');
        if (c.sleep) div.classList.add('exhausted');
        el.appendChild(div);
    });
}

// === WIN/LOSE ===
function winGame() {
    document.getElementById('modal').classList.remove('hidden');
    document.getElementById('gift-container').classList.remove('hidden');
    document.getElementById('modal-desc').innerText = "Забери награду!";
    document.getElementById('restart-btn').classList.add('hidden'); 
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
    document.querySelector('.gift-box').style.display = 'none';
    document.getElementById('card-reveal').classList.remove('hidden');
    const reward = VISUAL_REWARDS[Math.floor(Math.random() * VISUAL_REWARDS.length)];
    document.getElementById('reward-img').src = reward.img;
    document.getElementById('reward-name').innerText = reward.name;
    document.getElementById('claim-btn').classList.remove('hidden');
    tg.HapticFeedback.impactOccurred('heavy');
}

// === ВАЖНО: ОТПРАВКА ДАННЫХ БОТУ ===
document.getElementById('claim-btn').onclick = function() {
    // Эта команда отправляет данные боту. Бот поймает "win_common" и выдаст награду в БД.
    tg.sendData("win_common");
};

init();
