const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'dist', 'build', 'mp-weixin', 'project.config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

config.cloudfunctionRoot = 'cloudfunctions/';
config.lazyCodeLoading = 'requiredComponents';

fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
console.log('[postbuild] Added cloudfunctionRoot to project.config.json');
