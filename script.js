
const fruits = [
  { name: 'alma', emoji: '🍎', group: 'almatermesuek' },
  { name: 'körte', emoji: '🍐', group: 'almatermesuek' },
  { name: 'naspolya', emoji: '🥭', group: 'almatermesuek' },
  { name: 'birs', emoji: '🍏', group: 'almatermesuek' },

  { name: 'cseresznye', emoji: '🍒', group: 'csonth-ejasok' },
  { name: 'meggy', emoji: '🍒', group: 'csonth-ejasok' },
  { name: 'őszibarack', emoji: '🍑', group: 'csonth-ejasok' },
  { name: 'sárgabarack', emoji: '🍑', group: 'csonth-ejasok' },
  { name: 'szilva', emoji: '🍑', group: 'csonth-ejasok' },
  { name: 'nektarin', emoji: '🍑', group: 'csonth-ejasok' },
  { name: 'ringló szilva', emoji: '🍑', group: 'csonth-ejasok' },

  { name: 'dió', emoji: '🌰', group: 'hejas' },
  { name: 'mogyoró', emoji: '🥜', group: 'hejas' },
  { name: 'gesztenye', emoji: '🌰', group: 'hejas' },
  { name: 'mandula', emoji: '🌰', group: 'hejas' },

  { name: 'málna', emoji: '🫐', group: 'bogyos' },
  { name: 'szamóca', emoji: '🍓', group: 'bogyos' },
  { name: 'szeder', emoji: '🍓', group: 'bogyos' },
  { name: 'piros ribizli', emoji: '🍇', group: 'bogyos' },
  { name: 'fekete ribizli', emoji: '🍇', group: 'bogyos' },
  { name: 'josta', emoji: '🫐', group: 'bogyos' },
  { name: 'egres', emoji: '🫐', group: 'bogyos' }
];


const fruitsContainer = document.getElementById('fruits');
const bins = Array.from(document.querySelectorAll('.bin'));
const scoreSpan = document.getElementById('score');
const correctCountSpan = document.getElementById('correctCount');

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function renderFruits() {
  fruitsContainer.innerHTML = '';
  const pool = shuffle(fruits.slice());
  pool.forEach((f, i) => {
    const el = document.createElement('div');
    el.className = 'fruit';
    el.draggable = true;
    el.dataset.name = f.name;
    el.dataset.group = f.group;
    el.id = 'fruit-' + i;
    el.innerHTML = `<div class="emoji">${f.emoji}</div><div class="label">${f.name}</div>`;
    el.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', el.id);
      setTimeout(() => el.classList.add('hid'), 0);
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('hid');
    });
    fruitsContainer.appendChild(el);
  });
}

bins.forEach(bin => {
  bin.addEventListener('dragover', (e) => {
    e.preventDefault();
    bin.classList.add('dragover');
  });
  bin.addEventListener('dragleave', () => bin.classList.remove('dragover'));
  bin.addEventListener('drop', (e) => {
    e.preventDefault();
    bin.classList.remove('dragover');
    const id = e.dataTransfer.getData('text/plain');
    const dragged = document.getElementById(id);
    if (!dragged) return;
    // ha már bent van ugyanaz a név, ne ismételjük (opcionális)
    const inside = bin.querySelector('.inside');
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.textContent = dragged.dataset.name;
    chip.dataset.group = dragged.dataset.group;
    chip.dataset.name = dragged.dataset.name;

    // lehetőség: chip törlése kattintással
    chip.title = 'Kattints ide a visszavonáshoz';
    chip.addEventListener('click', () => {
      // visszahelyezzük a listába
      chip.remove();
      const el = document.createElement('div');
      el.className = 'fruit';
      el.draggable = true;
      el.dataset.name = chip.dataset.name;
      el.dataset.group = chip.dataset.group;
      el.innerHTML = `<div class="emoji">🔁</div><div class="label">${chip.dataset.name}</div>`;
      // egyszerű visszaállítás: újra-render helyett adjuk hozzá újra
      el.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', 're-' + Date.now());
        // ha újra akarjuk létrehozni a DOM elemet a drop-nál, hagyjuk egyszerűen:
      });
      // a legegyszerűbb: újrarendereljük az egész gyümölcslistát
      renderFruits();
    });

    // eltávolítjuk a forrás elemet (ha létezik a fruits listában)
    const maybeOrig = dragged.parentElement;
    if (maybeOrig) dragged.remove();
    inside.appendChild(chip);
  });
});

/* Ellenőrzés */
document.getElementById('checkBtn').addEventListener('click', () => {
  let correct = 0, total = 0;
  bins.forEach(bin => {
    const expected = bin.dataset.group;
    const items = Array.from(bin.querySelectorAll('.chip'));
    items.forEach(it => {
      total++;
      if (it.dataset.group === expected) {
        correct++;
        it.classList.add('correct'); it.classList.remove('wrong');
      } else {
        it.classList.add('wrong'); it.classList.remove('correct');
      }
    });
  });
  scoreSpan.textContent = `${correct}`;
  correctCountSpan.textContent = `${correct}/${total}`;
});

/* Reset */
document.getElementById('resetBtn').addEventListener('click', () => {
  document.querySelectorAll('.chip').forEach(c => c.remove());
  renderFruits();
  scoreSpan.textContent = '0';
  correctCountSpan.textContent = '0';
});

/* Inicializálás */
renderFruits();

/* ===== Paradicsom kitöltős rész (select-ek) ===== */
const fillOptions = {
  q1: ['Dél – Amerika', 'Észak – Amerika', 'Közép - Amerika'],
  q2: ['mélyre', 'sekélyre', 'nagyon mélyre'],
  q3: ['egyszerű', 'összetett', 'szeldelt'],
  q4: ['1', '2', '3'],
  q5: ['szögletes', 'hengeres', 'bordázott'],
  q6: ['fehér', 'sárga', 'zöld'],
  q7: ['felfújt bogyó', 'bogyó', 'aszmag'],
  q8: ['sárga', 'piros', 'kék'],
  q9: ['sárga', 'piros', 'kék'],
  q10: ['befőtt', 'ivólé', 'koktél'],
  q11: ['ketchup', 'lekvár', 'üdítő'],
  q12: ['meleg', 'víz', 'fény'],
  q13: ['meleg', 'víz', 'fény'],
  q14: ['tápanyagot', 'vizet', 'levegőt'],
  q15: ['kicsi', 'közepes', 'nagy']
};

const fillCorrect = {
  q1: 'Dél – Amerika',
  q2: 'mélyre',
  q3: 'egyszerű',
  q4: '1',
  q5: 'szögletes',
  q6: 'sárga',
  q7: 'bogyó',
  q8: 'piros',
  q9: 'sárga',
  q10: 'befőtt',
  q11: 'ketchup',
  q12: 'meleg',
  q13: 'meleg',
  q14: 'tápanyagot',
  q15: 'nagy'
};

// render select mezők
document.querySelectorAll('#fillForm select').forEach(sel => {
  const key = sel.dataset.key;
  // placeholder üres opció
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = '— válassz —';
  placeholder.selected = true;
  placeholder.disabled = true;
  sel.appendChild(placeholder);

  fillOptions[key].forEach(opt => {
    const o = document.createElement('option');
    o.value = opt;
    o.textContent = opt;
    sel.appendChild(o);
  });
});


document.getElementById('fillCheck').addEventListener('click', () => {
  let ok = 0, total = 0;
  document.querySelectorAll('#fillForm select').forEach(sel => {
    const key = sel.dataset.key;
    total++;
    if (sel.value === fillCorrect[key]) {
      sel.classList.add('correct'); sel.classList.remove('wrong');
      ok++;
    } else {
      sel.classList.add('wrong'); sel.classList.remove('correct');
    }
  });
  document.getElementById('fillResult').textContent = `Helyes válaszok: ${ok}/${total}`;
});

// reset
document.getElementById('fillReset').addEventListener('click', () => {
  document.querySelectorAll('#fillForm select').forEach(sel => {
    sel.selectedIndex = 0;
    sel.classList.remove('correct', 'wrong');
  });
  document.getElementById('fillResult').textContent = '';
});

/* ===== Találós kérdések (riddles) ===== */
// Ellenőrzés: dropdown válaszok ellenőrzése
document.getElementById('riddleCheck').addEventListener('click', () => {
  let correct = 0;
  const selects = document.querySelectorAll('#riddleDropdowns select');

  selects.forEach(select => {
    const selected = select.value;
    const correctAnswer = select.dataset.answer;

    if (selected === correctAnswer) {
      select.classList.add('correct');
      select.classList.remove('wrong');
      correct++;
    } else {
      select.classList.add('wrong');
      select.classList.remove('correct');
    }
  });

  const total = selects.length;
  const percentage = Math.round((correct / total) * 100);
  
  let message = `Helyes válaszok: ${correct}/${total} (${percentage}%)`;
  

  if (correct === total) {
    message += " 🎉 Kitűnő! Mindent helyesen válaszoltál!";
  } else if (correct >= total * 0.8) {
    message += " 👍 Nagyon jó eredmény!";
  } else if (correct >= total * 0.6) {
    message += " 😊 Jó munka!";
  } else {
    message += " 💪 Ne add fel, próbáld újra!";
  }

  document.getElementById('riddleResult').innerHTML = message;
});

// Újrakezd: minden mező alaphelyzetbe
document.getElementById('riddleReset').addEventListener('click', () => {
  const selects = document.querySelectorAll('#riddleDropdowns select');
  selects.forEach(select => {
    select.selectedIndex = 0;
    select.classList.remove('correct', 'wrong');
  });

  document.getElementById('riddleResult').textContent = '';
});


document.querySelectorAll('#riddleDropdowns select').forEach(select => {
  select.addEventListener('change', function() {
    // Eltávolítjuk az előző stílusokat
    this.classList.remove('correct', 'wrong');
    

    if (this.value) {
      const correctAnswer = this.dataset.answer;
      if (this.value === correctAnswer) {
        this.classList.add('correct');
      } else {
        this.classList.add('wrong');
      }
    }
  });
});


document.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    document.getElementById('riddleCheck').click();
  }
});