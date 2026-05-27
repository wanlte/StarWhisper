const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist', 'build', 'mp-weixin');

// 1. Add cloudfunctionRoot to project.config.json
const projectConfigPath = path.join(distDir, 'project.config.json');
const projectConfig = JSON.parse(fs.readFileSync(projectConfigPath, 'utf-8'));
projectConfig.cloudfunctionRoot = 'cloudfunctions/';
fs.writeFileSync(projectConfigPath, JSON.stringify(projectConfig, null, 2), 'utf-8');
console.log('[postbuild] Added cloudfunctionRoot to project.config.json');

// 2. Add lazyCodeLoading to app.json (组件按需注入)
const appJsonPath = path.join(distDir, 'app.json');
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf-8'));

// Inject as first key for readability
const { pages, window, tabBar, permission, requiredBackgroundModes, plugins, usingComponents, ...rest } = appJson;
const patchedAppJson = {
  lazyCodeLoading: 'requiredComponents',
  pages,
  window,
  tabBar,
  permission,
  requiredBackgroundModes,
  plugins,
  usingComponents,
  ...rest
};

fs.writeFileSync(appJsonPath, JSON.stringify(patchedAppJson, null, 2), 'utf-8');
console.log('[postbuild] Added lazyCodeLoading to app.json');
