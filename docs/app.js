// app.js
let rouletteData = [];
let currentIndex = 0;
let state = '静止'; // '静止', '回転', '停止中'
let spinInterval = null;
let stopTimeout = null;
let slowTimeout = null;

const roulette = document.getElementById('roulette');
const startBtn = document.getElementById('start-btn');
const destInfo = document.getElementById('destination-info');

async function loadCSV() {
  const res = await fetch('csv/sample.csv');
  const text = await res.text();
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const cols = line.split(',');
    const obj = {};
    headers.forEach((h, i) => obj[h.trim()] = cols[i]?.trim() || '');
    return obj;
  });
}

function showRoulette(index) {
  if (rouletteData.length === 0) return;
  roulette.textContent = rouletteData[index].Name;
}

function showDestination(index) {
  const d = rouletteData[index];
  destInfo.innerHTML = `
    <div class="mt-3">
      <a href="${d.SiteURL}" target="_blank" class="fw-bold">${d.Brand}</a><br>
      <a href="${d.MapURL}" target="_blank">${d.Location}</a><br>
      <img src="${d.Picture}" alt="${d.Name}" class="img-fluid rounded mt-2" style="max-height:200px;">
    </div>
  `;
}

function clearDestination() {
  destInfo.innerHTML = '';
}

function spinRoulette(speed = 100) {
  spinInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % rouletteData.length;
    showRoulette(currentIndex);
  }, speed);
}

function stopRoulette(final = false) {
  clearInterval(spinInterval);
  spinInterval = null;
  if (final) {
    state = '静止';
    startBtn.textContent = 'START';
    startBtn.disabled = false;
    showDestination(currentIndex);
  }
}

startBtn.addEventListener('click', async () => {
  if (state !== '静止') return;
  if (rouletteData.length === 0) return;
  state = '回転';
  startBtn.textContent = 'Where we go?';
  startBtn.disabled = true;
  clearDestination();
  let speed = 60;
  spinRoulette(speed);
  // 5秒後に減速
  slowTimeout = setTimeout(() => {
    state = '停止中';
    let decel = 0;
    const decelInterval = setInterval(() => {
      speed += 40; // 線形に遅くする
      clearInterval(spinInterval);
      spinRoulette(speed);
      decel++;
      if (decel >= 5) {
        clearInterval(decelInterval);
      }
    }, 1000);
    // 5秒後に完全停止
    stopTimeout = setTimeout(() => {
      clearInterval(decelInterval);
      stopRoulette(true);
    }, 5000);
  }, 3000);
});

window.addEventListener('DOMContentLoaded', async () => {
  rouletteData = await loadCSV();
  currentIndex = 0;
  showRoulette(currentIndex);
});
