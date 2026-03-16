// grab the main game elements from the html
const arena = document.getElementById("arena");
const target = document.getElementById("target");
const startBtn = document.getElementById("startBtn");

// grab the hud text elements so we can update numbers live
const timeEl = document.getElementById("time");
const scoreEl = document.getElementById("score");
const missesEl = document.getElementById("misses");
const accuracyEl = document.getElementById("accuracy");
const comboEl = document.getElementById("combo");
const bestComboEl = document.getElementById("bestCombo");

// grab the reward overlay (popup) pieces
const rewardOverlay = document.getElementById("rewardOverlay");
const rewardGrid = document.getElementById("rewardGrid");
const closeReward = document.getElementById("closeReward");

// grab the in-game feedback ui
const pop = document.getElementById("pop");
const rankCard = document.getElementById("rankCard");

const gameMusic = document.querySelector("#game-music");
const smoochSound = document.getElementById("smooch-sound");

// game state flags + timers
let roundActive = false;
let timerId = null;
let animationId = null;

// player stats
let score = 0;
let misses = 0;
let shots = 0;
let combo = 0;
let bestCombo = 0;

// round timer
let timeLeft = 30.0;

let gameMusicStarted = false;

const startGameMusic = () => {

    if (gameMusicStarted || !gameMusic) return;

    gameMusic.volume = 0.08;

    gameMusic.play().catch(function (error) {
        console.log("Game music failed to play:", error);
    });

    gameMusicStarted = true;
};

const rewards = [
  {
    src: "images/reward1.jpg",
    caption: "YOU UNLOCKED NAUGHTY JADE",
    border: "#9aa0a6" // gray (common)
  },
  {
    src: "images/reward2.jpg",
    caption: "YOU UNLOCKED SLEEPY JADE",
    border: "#3b82f6" // blue (rare)
  },
  {
    src: "images/reward3.jpg",
    caption: "YOU UNLOCKED AIRBENDER JADE",
    border: "#a855f7" // purple (epic)
  },
  {
    src: "images/reward4.jpg",
    caption: "YOU UNLOCKED SILLY JADE",
    border: "#ff4d6d" // red/pink (legendary)
  }
];

// small helper to keep a value within a min/max range
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

// update all hud numbers (score, misses, accuracy, combo, time)
const updateHUD = () => {
  scoreEl.textContent = score;
  missesEl.textContent = misses;

  // accuracy = (hits / shots) * 100
  const acc = shots === 0 ? 100 : Math.round(((shots - misses) / shots) * 100);
  accuracyEl.textContent = `${acc}%`;

  comboEl.textContent = combo;
  bestComboEl.textContent = bestCombo;

  timeEl.textContent = timeLeft.toFixed(1);
};

// show the little pop-up text at the top (then auto-hide it)
const showPop = (text) => {
  pop.textContent = text;
  pop.classList.remove("hidden");
  pop.setAttribute("aria-hidden", "false");

  // clear any previous hide timer so it doesn’t flicker
  clearTimeout(pop._t);
  pop._t = setTimeout(() => {
    pop.classList.add("hidden");
    pop.setAttribute("aria-hidden", "true");
  }, 600);
};

// difficulty scales with score: smaller target + faster movement
const getDifficulty = () => {
  // shrink target as score increases
  const size = clamp(118 - Math.floor(score / 40) * 10, 44, 118);

  // speed multiplier grows with score (cap it so it doesn’t become impossible)
  const speedMult = clamp(1 + score / 250, 1, 3.2);

  return { size, speedMult };
};

// place the target somewhere random (useful at start and optional after hits)
const placeTargetRandomly = () => {
  const { size } = getDifficulty();
  target.style.width = `${size}px`;

  const arenaRect = arena.getBoundingClientRect();
  const maxX = arenaRect.width - size;
  const maxY = arenaRect.height - size;

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  target.style.left = `${x}px`;
  target.style.top = `${y}px`;
};

const openRewards = () => {
  rewardGrid.innerHTML = "";

  // pick random reward object
  const randomIndex = Math.floor(Math.random() * rewards.length);
  const selectedReward = rewards[randomIndex];

  // create image
  const img = document.createElement("img");
  img.src = selectedReward.src;
  img.alt = "reward photo";

  // apply custom border color
  img.style.border = `3px solid ${selectedReward.border}`;
  img.style.boxShadow = `0 0 25px ${selectedReward.border}`;

  // create caption
  const caption = document.createElement("p");
  caption.textContent = selectedReward.caption;
  caption.classList.add("reward-caption");

  rewardGrid.appendChild(img);
  rewardGrid.appendChild(caption);

  rewardOverlay.classList.remove("hidden");
  rewardOverlay.setAttribute("aria-hidden", "false");
};

// hide the reward overlay
const closeRewards = () => {
  rewardOverlay.classList.add("hidden");
  rewardOverlay.setAttribute("aria-hidden", "true");
};

// convert score + accuracy + combo into a “rank”
const rankFromStats = () => {
  const acc = shots === 0 ? 0 : ((shots - misses) / shots) * 100;

  // mmr rewards score + accuracy + best combo
  const mmr = score + (acc * 6) + (bestCombo * 4);

  if (mmr >= 1200) return { name: "radiant", note: "okay demon 😭" };
  if (mmr >= 1050) return { name: "immortal", note: "locked in." };
  if (mmr >= 920)  return { name: "ascendant", note: "this is actually scary." };
  if (mmr >= 780)  return { name: "diamond", note: "clean aim." };
  if (mmr >= 660)  return { name: "platinum", note: "okay aim king." };
  if (mmr >= 560)  return { name: "gold", note: "solid. you warmed up?" };
  if (mmr >= 460)  return { name: "silver", note: "respectable. keep grinding." };
  if (mmr >= 360)  return { name: "bronze", note: "we're getting there." };
  return { name: "iron", note: "it's okay… i still love you." };
};

// show the match result card inside the arena (with buttons)
const showRankCard = () => {
  const acc = accuracyEl.textContent;
  const { name, note } = rankFromStats();

  rankCard.innerHTML = `
    <h3>match result:</h3>
    <p class="big">${name}</p>
    <p class="small">${note}</p>

    <div class="row"><span>score</span><span>${score}</span></div>
    <div class="row"><span>accuracy</span><span>${acc}</span></div>
    <div class="row"><span>best combo</span><span>${bestCombo}</span></div>
    <div class="row"><span>misses</span><span>${misses}</span></div>

    <div class="rank-actions">
      <button id="rankPlayAgain" class="btn primary" type="button">play again</button>
      <a class="btn ghost" href="../index.html">go back home</a>
    </div>
  `;

  rankCard.classList.remove("hidden");
  rankCard.setAttribute("aria-hidden", "false");

  // wire up the injected play again button
  document.getElementById("rankPlayAgain").addEventListener("click", (e) => {
    // stop this click from counting as an arena miss
    e.stopPropagation();

    hideRankCard();
    closeRewards();

    // reuse the start button logic to restart cleanly
    startBtn.click();
  });
};

// hide the match result card
const hideRankCard = () => {
  rankCard.classList.add("hidden");
  rankCard.setAttribute("aria-hidden", "true");
};

// end the round, show results, then show reward popup
const endRound = () => {
  roundActive = false;

  // stop timers/animation
  clearInterval(timerId);
  cancelAnimationFrame(animationId);

  // hide target + show start again
  target.classList.add("hidden");
  startBtn.classList.remove("hidden");
  startBtn.textContent = "play again";

  // show match results
  showRankCard();

  // show reward overlay after a short beat
  setTimeout(() => openRewards(), 700);
};

// reset all stats back to default
const resetRound = () => {
  score = 0;
  misses = 0;
  shots = 0;
  combo = 0;
  bestCombo = 0;
  timeLeft = 30.0;

  hideRankCard();
  updateHUD();
};

// smooth movement settings (lower = slower)
let velocityX = 1.2;
let velocityY = 1.2;

// smoothly move the target every frame and bounce off walls
const startSmoothMovement = () => {
  const move = () => {
    if (!roundActive) return;

    const arenaRect = arena.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    // read current position from inline styles
    let x = parseFloat(target.style.left) || 0;
    let y = parseFloat(target.style.top) || 0;

    // apply velocity
    x += velocityX;
    y += velocityY;

    // bounce on x edges
    if (x <= 0 || x + targetRect.width >= arenaRect.width) {
      velocityX *= -1;
    }

    // bounce on y edges
    if (y <= 0 || y + targetRect.height >= arenaRect.height) {
      velocityY *= -1;
    }

    // write new position back to styles
    target.style.left = `${x}px`;
    target.style.top = `${y}px`;

    // keep moving next frame
    animationId = requestAnimationFrame(move);
  };

  move();
};

// ---------- gameplay ----------

// clicking the target counts as a hit (sweet spot vs soft kiss)
target.addEventListener("click", (e) => {
  if (!roundActive) return;

  // stop the click from bubbling up and becoming a miss on the arena
  e.stopPropagation();

  if (smoochSound) {
    smoochSound.currentTime = 0;
    smoochSound.volume = 0.35;
    smoochSound.play().catch(function (error) {
        console.log("Smooch sound failed to play:", error);
  });
}

  shots++;

  // find where you clicked inside the image (top third = sweet spot)
  const rect = target.getBoundingClientRect();
  const clickY = e.clientY - rect.top;
  const sweetSpotZone = rect.height * 0.33;

  const isSweetSpot = clickY <= sweetSpotZone;

  if (isSweetSpot) {
    score += 25;
    combo += 2;
    showPop("+25 sweet spot");
  } else {
    score += 10;
    combo += 1;
    showPop("+10 soft kiss");
  }

  bestCombo = Math.max(bestCombo, combo);
  updateHUD();

  // optional: remove this line to prevent any teleport after a hit
  // placeTargetRandomly();
});

// clicking empty arena space counts as a miss
arena.addEventListener("click", (e) => {
  if (!roundActive) return;

  // only count a miss if the click was directly on the arena (not on buttons/target)
  if (e.target !== arena) return;

  shots++;
  misses++;

  score = Math.max(0, score - 5);
  combo = 0;

  showPop("-5 missed smooch");
  updateHUD();
});

// start the round when the start button is clicked
startBtn.addEventListener("click", (e) => {
  // prevent the start click from bubbling into the arena and counting as a miss
  e.stopPropagation();

  // start the game music
  startGameMusic();

  closeRewards();
  resetRound();

  roundActive = true;
  startBtn.classList.add("hidden");

  // show target and set an initial starting position
  target.classList.remove("hidden");
  placeTargetRandomly();

  // countdown timer (updates 10 times per second)
  timerId = setInterval(() => {
    timeLeft = Math.max(0, timeLeft - 0.1);
    updateHUD();
    if (timeLeft <= 0) endRound();
  }, 100);

  // start smooth movement loop
  startSmoothMovement();
});

// reward overlay controls (close button, click outside, escape key)
closeReward.addEventListener("click", closeRewards);

rewardOverlay.addEventListener("click", (e) => {
  if (e.target === rewardOverlay) closeRewards();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !rewardOverlay.classList.contains("hidden")) closeRewards();
});

// render initial hud state
updateHUD();