const screen1 = document.getElementById('screen1');
const screen2 = document.getElementById('screen2');
const screen3 = document.getElementById('screen3');
const startBtn = document.getElementById('start-btn');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const message = document.getElementById('message');
const chooseInsectBtns = document.querySelectorAll('.choose-insect-btn');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');

let seconds = 0;
let score = 0;
let lives = 3;
let selectedInsect = {};
let timerInterval;
let gameOver = false;
let spawnSpeed = 1000;
let escapeTime = 5000;

startBtn.addEventListener('click', () => {
  screen1.classList.add('up');
  screen2.classList.add('active');
});

difficultyBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    difficultyBtns.forEach(b => b.style.background = 'white');
    btn.style.background = '#ffdd57';
    spawnSpeed = parseInt(btn.getAttribute('data-speed'));
    if (spawnSpeed === 1500) escapeTime = 6000;
    if (spawnSpeed === 1000) escapeTime = 4000;
    if (spawnSpeed === 600)  escapeTime = 2500;
  });
});

chooseInsectBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const img = btn.querySelector('img');
    selectedInsect = {
      src: img.getAttribute('src'),
      alt: img.getAttribute('alt')
    };
    screen2.classList.add('up');
    screen3.classList.add('active');
    setTimeout(createInsect, 800);
    startTimer();
  });
});

function startTimer() {
  timerInterval = setInterval(() => {
    let m = Math.floor(seconds / 60);
    let s = seconds % 60;
    m = m < 10 ? `0${m}` : m;
    s = s < 10 ? `0${s}` : s;
    timeEl.textContent = `Time: ${m}:${s}`;
    seconds++;
  }, 1000);
}

function createInsect() {
  if (gameOver) return;
  const insect = document.createElement('div');
  insect.classList.add('insect');

  const x = Math.random() * (window.innerWidth - 150) + 75;
  const y = Math.random() * (window.innerHeight - 150) + 75;
  insect.style.left = `${x}px`;
  insect.style.top = `${y}px`;

  insect.innerHTML = `<img src="${selectedInsect.src}" alt="${selectedInsect.alt}" style="transform: rotate(${Math.random() * 360}deg)">`;
  insect.addEventListener('click', catchInsect);
  screen3.appendChild(insect);

  const escapeTimer = setTimeout(() => {
    if (document.body.contains(insect) && !insect.classList.contains('caught')) {
      insect.classList.add('caught');
      setTimeout(() => insect.remove(), 300);
      loseLife();
      setTimeout(createInsect, 800);
    }
  }, escapeTime);

  insect.addEventListener('click', () => clearTimeout(escapeTimer));
}

function loseLife() {
  if (gameOver) return;
  lives--;
  livesEl.textContent = `Lives: ${lives}`;
  if (lives <= 0) {
    endGame(false);
  }
}

function catchInsect() {
  if (gameOver) return;
  score++;
  scoreEl.textContent = `Score: ${score}`;
  this.classList.add('caught');
  setTimeout(() => this.remove(), 300);

  if (score >= 30) {
    endGame(true);
    return;
  }

  if (score > 19) {
    message.innerHTML = `Almost there!<br>Score: ${score}`;
    message.classList.add('visible');
  }

  setTimeout(createInsect, spawnSpeed);
  setTimeout(createInsect, spawnSpeed + 500);
}

function endGame(won) {
  gameOver = true;
  clearInterval(timerInterval);
  document.querySelectorAll('.insect').forEach(i => i.remove());
  message.innerHTML = won
    ? `You win!<br><br>Score: ${score}<br><br>Refresh to play again`
    : `Game over!<br><br>Score: ${score}<br><br>Refresh to play again`;
  message.classList.add('visible');
}