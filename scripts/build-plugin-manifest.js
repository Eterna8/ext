import path from 'path';
import fs from 'fs';
import languages from './languages.js';
import { execSync } from 'child_process';
import { minify } from './terser.js';

const REMOTE = execSync('git remote get-url origin')
  .toString()
  .replace(/[\s\n]/g, '');
const CURRENT_BRANCH = execSync('git branch --show-current')
  .toString()
  .replace(/[\s\n]/g, '');
const matched = REMOTE.match(/([^:/]+?)\/([^/.]+)(\.git)?$/);
if (!matched) throw Error('Cant parse git url');
const USERNAME = matched[1];
const REPO = matched[2];
const USER_CONTENT_LINK = process.env.USER_CONTENT_BASE
  ? process.env.USER_CONTENT_BASE
  : `https://raw.githubusercontent.com/${USERNAME}/${REPO}/${CURRENT_BRANCH}`;

const STATIC_LINK = `${USER_CONTENT_LINK}/public/static`;
// Use legacy .js/src/plugins path for backward compatibility
const PLUGIN_LINK = `${USER_CONTENT_LINK}/.js/src/plugins`;

const DIST_DIR = '.dist';

let json = {};
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR);
}
const jsonPath = path.join(DIST_DIR, 'plugins.json');
const jsonMinPath = path.join(DIST_DIR, 'plugins.min.json');
const pluginSet = new Set();
const pluginsPerLanguage = {};
const pluginsWithFiltersPerLanguage = {};

const COMPILED_PLUGIN_DIR = './.js/plugins';

const language = 'English';
console.log(
  ` ${language} `
    .padStart(Math.floor((language.length + 32) / 2), '=')
    .padEnd(30, '='),
);

const langPath = path.join(COMPILED_PLUGIN_DIR, language.toLowerCase());
if (fs.existsSync(langPath)) {
  const plugins = fs.readdirSync(langPath);

  pluginsPerLanguage[language] = 0;
  pluginsWithFiltersPerLanguage[language] = 0;

  plugins.forEach(plugin => {
    if (plugin.startsWith('.')) return;
    minify(path.join(langPath, plugin));
    const rawCode = fs.readFileSync(
      `${COMPILED_PLUGIN_DIR}/${language.toLowerCase()}/${plugin}`,
      'utf-8',
    );
    const instance = Function(
      'require',
      'module',
      `const exports = module.exports = {}; 
      ${rawCode}; 
      return exports.default`,
    )(() => {}, {});
    const { id, name, site, version, icon, customJS, customCSS, filters } =
      instance;
    const normalisedName = name.replace(/.*\[.*\]/, '');

    const info = {
      id,
      name: normalisedName,
      site,
      lang: languages[language],
      version,
      url: `${PLUGIN_LINK}/${language.toLowerCase()}/${plugin}`,
      iconUrl: `${STATIC_LINK}/${icon || 'siteNotAvailable.png'}`,
      customJS: customJS ? `${STATIC_LINK}/${customJS}` : undefined,
      customCSS: customCSS ? `${STATIC_LINK}/${customCSS}` : undefined,
    };

    if (pluginSet.has(id)) {
      console.log("There's already a plugin with id:", id);
      throw new Error('2 or more plugins have the same id');
    } else {
      pluginSet.add(id);
    }
    if (!json[language]) {
      json[language] = [];
    }
    json[language].push(info);

    pluginsPerLanguage[language] += 1;
    if (filters !== undefined) {
      pluginsWithFiltersPerLanguage[language] += 1;
    }

    console.log(
      '   ',
      name.padEnd(25),
      ` (${id})`,
      filters == undefined ? '\r✅' : '\r✅🔍',
    );
  });
}

fs.writeFileSync(jsonMinPath, JSON.stringify(json));
fs.writeFileSync(jsonPath, JSON.stringify(json, null, '\t'));

const totalPlugins = Object.values(pluginsPerLanguage).reduce(
  (a, b) => a + b,
  0,
);

// check for broken plugins
if (fs.existsSync(path.join('./plugins', language.toLocaleLowerCase()))) {
  const tsFiles = fs.readdirSync(
    path.join('./plugins', language.toLocaleLowerCase()),
  );
  tsFiles
    .filter(f => f.endsWith('.broken.ts'))
    .forEach(fn => {
      console.error(
        language.toLocaleLowerCase() +
          '/' +
          fn.replace('.broken.ts', '') +
          ' ❌',
      );
    });
}

console.log(jsonPath);
console.log('Done ✅');

const totalPluginsWithFilter = Object.values(
  pluginsWithFiltersPerLanguage,
).reduce((a, b) => a + b, 0);

// Markdown table for GitHub Actions
console.warn('\n| Language | Plugins (With Filters) |');
console.warn('|----------|------------------------|');
console.warn(
  `| ${language} | ${pluginsPerLanguage[language] || 0} (${pluginsWithFiltersPerLanguage[language] || 0}) |`,
);
console.warn('|----------|------------------------|');
console.warn(`| Total | ${totalPlugins} (${totalPluginsWithFilter}) |`);
