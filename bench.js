const { performance } = require('perf_hooks');

const FACTION_CONFIG = {
  wealthy: { label: 'Wealthy Elite', emoji: '💼', color: '#fbbf24' },
  working: { label: 'Working Class', emoji: '🔧', color: '#60a5fa' },
  nationalist: { label: 'Nationalists', emoji: '🏛️', color: '#f87171' },
  youth: { label: 'Youth & Students', emoji: '🎓', color: '#34d399' },
};

const FACTION_ENTRIES = Object.entries(FACTION_CONFIG);

function bench() {
  const ITERS = 10_000_000;

  let s1 = 0;
  const start1 = performance.now();
  for (let i = 0; i < ITERS; i++) {
    const entries = Object.entries(FACTION_CONFIG);
    for (let j = 0; j < entries.length; j++) {
      s1 += entries[j][0].length;
    }
  }
  const end1 = performance.now();

  let s2 = 0;
  const start2 = performance.now();
  for (let i = 0; i < ITERS; i++) {
    const entries = FACTION_ENTRIES;
    for (let j = 0; j < entries.length; j++) {
      s2 += entries[j][0].length;
    }
  }
  const end2 = performance.now();

  console.log(`Object.entries inline: ${Math.round(end1 - start1)} ms`);
  console.log(`Cached entries: ${Math.round(end2 - start2)} ms`);
  console.log(`Improvement: ${Math.round(((end1 - start1) - (end2 - start2)) / (end1 - start1) * 100)}%`);
}
bench();
