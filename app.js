// This detector uses only timestamp and scroll-position values. It never reads page content.
const rule = { velocityThreshold: 900, pauseThreshold: 1, minimumSamples: 6 };
const scenarios = {
  reading: [{t:0,y:0},{t:1800,y:260},{t:4200,y:500},{t:7000,y:760},{t:10800,y:990},{t:14600,y:1250},{t:19000,y:1490}],
  browsing: [{t:0,y:0},{t:700,y:380},{t:1700,y:880},{t:2900,y:1450},{t:4200,y:2020},{t:5800,y:2640},{t:7600,y:3100},{t:9500,y:3720},{t:11400,y:4240},{t:13600,y:4920},{t:16000,y:5520},{t:18400,y:6170},{t:19900,y:6680}]
};
function analyse(samples) {
  const pairs = samples.slice(1).map((sample, index) => ({
    velocity: Math.abs(sample.y - samples[index].y) / ((sample.t - samples[index].t) / 1000),
    pause: (sample.t - samples[index].t) / 1000
  }));
  const velocity = Math.round(pairs.reduce((total, pair) => total + pair.velocity, 0) / pairs.length);
  const pause = Math.max(...pairs.map(pair => pair.pause));
  const detected = samples.length >= rule.minimumSamples && velocity > rule.velocityThreshold && pause < rule.pauseThreshold;
  return { velocity, pause, detected };
}
function show(mode) {
  const result = analyse(scenarios[mode]);
  document.querySelector('#velocity').textContent = result.velocity.toLocaleString();
  document.querySelector('#pause').textContent = result.pause.toFixed(1);
  document.querySelector('#status').textContent = result.detected ? 'Pattern noticed' : 'Intentional';
  document.querySelector('#rule').textContent = `Average speed > 900 px/s: ${result.velocity > 900 ? 'YES ✓' : 'NO ×'}   |   Longest pause < 1.0 s: ${result.pause < 1 ? 'YES ✓' : 'NO ×'}`;
}
document.querySelectorAll('.tabs button').forEach(button => button.addEventListener('click', () => { document.querySelector('.tabs .active').classList.remove('active'); button.classList.add('active'); show(button.dataset.mode); }));
show('reading');
