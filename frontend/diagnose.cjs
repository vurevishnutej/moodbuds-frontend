const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

(async () => {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
    url: 'http://localhost:5183/',
    pretendToBeVisual: true,
    runScripts: 'outside-only',
  });

  const { window } = dom;
  global.window = window;
  global.document = window.document;
  global.navigator = window.navigator;
  global.localStorage = {
    _data: {},
    getItem(k) { return Object.prototype.hasOwnProperty.call(this._data, k) ? this._data[k] : null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; },
  };
  window.localStorage = global.localStorage;
  window.matchMedia = window.matchMedia || function () {
    return { matches: false, addListener() {}, removeListener() {} };
  };
  window.scrollTo = () => {};
  global.requestAnimationFrame = (cb) => setTimeout(cb, 0);

  const errors = [];
  window.addEventListener('error', (e) => errors.push(e.error ? (e.error.stack || e.error.message) : e.message));

  const distDir = path.join(__dirname, 'dist', 'assets');
  const jsFile = fs.readdirSync(distDir).find((f) => f.endsWith('.js'));
  const code = fs.readFileSync(path.join(distDir, jsFile), 'utf8');

  try {
    const fn = new Function('window', 'document', 'navigator', 'localStorage', 'self', 'globalThis', code);
    fn(window, window.document, window.navigator, global.localStorage, window, window);
  } catch (err) {
    console.log('CAUGHT SYNCHRONOUS ERROR:');
    console.log(err.stack || err.message);
    process.exit(0);
  }

  await new Promise((r) => setTimeout(r, 1000));

  console.log('root innerHTML length:', window.document.getElementById('root').innerHTML.length);
  console.log('window errors:', errors);
})();
