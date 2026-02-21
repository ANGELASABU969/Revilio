const globalRegrets = ["Relivio connected a soul today.", "A memory was turned to stardust.", "The universe feels lighter now."];
const taskPool = ["Drink a glass of water slowly.", "Relax your shoulders.", "Notice 3 beautiful things.", "High-five your reflection."];
const funnyMotivations = ["Regret cleared. Now prove you are a functioning human:", "Space-time is clean. Don't be a potato, do these:"];

// Emoji Mapping Logic
const emojiMap = {
    love: ["💔", "❤️‍🩹", "🥀", "💍", "💌"],
    sad: ["😢", "🌧️", "💧", "☁️", "🌑"],
    work: ["💼", "📉", "🖱️", "🏢", "☕"],
    angry: ["🔥", "🌋", "🧨", "💢", "🌩️"],
    money: ["💸", "💰", "📉", "💳"],
    general: ["🫧", "✨", "🎈", "🍃", "☁️"]
};

let particles = [];
const canvas = document.getElementById('ember-canvas');
const ctx = canvas.getContext('2d');
let gameActive = false;

window.addEventListener('DOMContentLoaded', () => {
    resize(); animate();
    setInterval(() => {
        const el = document.getElementById('inner-breath-text');
        if(el) el.innerText = (el.innerText === "Breath In") ? "Breath Out" : "Breath In";
    }, 4000);
    setTimeout(() => transitionTo('breath-section', 'input-section'), 12000);
    setTimeout(triggerGlobalEcho, 5000);
});

window.addEventListener('resize', resize);
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }

class Ember {
    constructor(x, y, isThought = false) {
        this.x = x; this.y = y;
        this.size = isThought ? Math.random() * 3 + 2 : Math.random() * 1.5;
        this.speedY = isThought ? Math.random() * -1.2 - 0.5 : Math.random() * -0.5 - 0.1;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.opacity = 1; this.isThought = isThought; this.isSettled = false;
    }
    update() {
        if (this.isSettled) return;
        this.y += this.speedY; this.x += this.speedX;
        if (this.isThought) {
            this.opacity -= 0.0015;
            if (this.y < 100 || this.opacity < 0.3) { this.isSettled = true; this.opacity = 0.3; }
        } else { this.opacity -= 0.002; }
    }
    draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.isThought ? "#ffcc33" : "#ffffff";
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (Math.random() < 0.08) particles.push(new Ember(Math.random() * canvas.width, canvas.height + 10));
    particles.forEach((p, i) => { p.update(); p.draw(); if (!p.isThought && p.opacity <= 0) particles.splice(i, 1); });
    requestAnimationFrame(animate);
}

function transitionTo(hideId, showId) {
    document.getElementById(hideId).classList.add('hidden');
    const show = document.getElementById(showId);
    show.classList.remove('hidden'); show.classList.add('fade-in');
}

function igniteEmber() {
    const val = document.getElementById('regret-input').value;
    if(!val.trim()) return;
    for (let i = 0; i < 40; i++) particles.push(new Ember(window.innerWidth / 2, window.innerHeight / 2, true));
    transitionTo('input-section', 'task-section');
    setupChecklist();
}

function setupChecklist() {
    document.getElementById('funny-motivation').innerText = funnyMotivations[Math.floor(Math.random() * funnyMotivations.length)];
    const list = document.getElementById('checklist');
    const tasks = [...taskPool].sort(() => 0.5 - Math.random()).slice(0, 3);
    list.innerHTML = tasks.map((t, i) => `<div class="task-item"><input type="checkbox" onchange="checkTasks()"> ${t}</div>`).join('') + `<button class="subtext-btn" onclick="handleFail()">I'm too lazy...</button>`;
}

function checkTasks() {
    if (document.querySelectorAll('input:checked').length === 3) {
        document.getElementById('task-outcome').classList.remove('hidden');
        document.getElementById('outcome-msg').innerText = "Tasks done. Welcome to the Zen Zone.";
    }
}

function handleFail() { alert("No worries. Let's just play."); transitionTo('task-section', 'game-menu'); }

function startGame(type) {
    transitionTo('game-menu', 'game-container');
    const area = document.getElementById('game-canvas-area');
    gameActive = true;

    if (type === 'bubble') {
        const text = document.getElementById('regret-input').value.toLowerCase();
        let selectedEmojis = [...emojiMap.general];
        
        if (text.includes("love") || text.includes("breakup") || text.includes("ex")) selectedEmojis.push(...emojiMap.love);
        if (text.includes("sad") || text.includes("cry") || text.includes("hurt")) selectedEmojis.push(...emojiMap.sad);
        if (text.includes("work") || text.includes("job") || text.includes("office")) selectedEmojis.push(...emojiMap.work);
        if (text.includes("angry") || text.includes("hate")) selectedEmojis.push(...emojiMap.angry);

        area.innerHTML = '<h3>Pop Your Emotions</h3><p>Tap them to let go.</p><div id="bubble-box"></div>';
        for(let i=0; i<20; i++) {
            const e = document.createElement('span');
            e.className = 'bubble-emoji';
            e.innerText = selectedEmojis[Math.floor(Math.random() * selectedEmojis.length)];
            e.onclick = function() {
                for(let j=0; j<5; j++) particles.push(new Ember(this.offsetLeft, this.offsetTop, true));
                this.style.transform = 'scale(0)'; setTimeout(() => this.remove(), 250);
            };
            document.getElementById('bubble-box').appendChild(e);
        }
    } else {
        area.innerHTML = '<h3>Zen Sand</h3><canvas id="sand-cvs"></canvas>';
        const sand = document.getElementById('sand-cvs');
        const sCtx = sand.getContext('2d');
        sand.width = 300; sand.height = 200;
        let drawing = false;
        const draw = (e) => {
            if (!drawing) return;
            const rect = sand.getBoundingClientRect();
            const x = (e.clientX || e.touches[0].clientX) - rect.left;
            const y = (e.clientY || e.touches[0].clientY) - rect.top;
            sCtx.lineWidth = 10; sCtx.lineCap = 'round'; sCtx.strokeStyle = 'rgba(101,67,33,0.1)';
            sCtx.lineTo(x, y); sCtx.stroke(); sCtx.beginPath(); sCtx.moveTo(x, y);
        };
        sand.onmousedown = () => { drawing = true; sCtx.beginPath(); };
        window.onmouseup = () => drawing = false;
        sand.onmousemove = draw;
        const fade = () => { if (gameActive && document.getElementById('sand-cvs')) { sCtx.fillStyle = 'rgba(194,178,128,0.01)'; sCtx.fillRect(0,0,300,200); requestAnimationFrame(fade); } };
        fade();
    }
}

function exitGame() { gameActive = false; transitionTo('game-container', 'game-menu'); }

function saveJournalLocal() {
    const text = document.getElementById('journal-input').value;
    if(!text) return;
    const entries = JSON.parse(localStorage.getItem('relivio_journal') || "[]");
    entries.push({ date: new Date().toLocaleDateString(), content: text });
    localStorage.setItem('relivio_journal', JSON.stringify(entries));
    alert("Saved to your browser.");
}

function triggerGlobalEcho() {
    const el = document.getElementById('global-echo-container');
    document.getElementById('echo-text').innerText = globalRegrets[Math.floor(Math.random() * globalRegrets.length)];
    el.classList.add('visible');
    setTimeout(() => { el.classList.remove('visible'); setTimeout(triggerGlobalEcho, 15000); }, 5000);
}