/**
 * 角色形象批量生成脚本 (免费版)
 *
 * 使用 Pollinations.ai 免费 API，无需 API Key
 * 运行: node scripts/generate-characters.mjs [--ids=1,2,3] [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── 配置 ──
const CONFIG = {
  ids: null,              // null=全部, "1,5,10"=指定角色
  outDir: path.resolve(__dirname, '../assets/characters'),
  concurrency: 2,         // 并发数 (免费API别太高)
  dryRun: false,          // 只试生成第一张
  skipExisting: true,     // 跳过已存在
  retry: 2,               // 失败重试次数
  timeout: 120000,        // 单张超时(ms)
};

// 解析命令行参数
for (const arg of process.argv.slice(2)) {
  if (arg.startsWith('--ids=')) {
    const raw = arg.split('=')[1];
    CONFIG.ids = raw === 'all' ? null : raw.split(',').map(Number).filter(Boolean);
  }
  if (arg === '--dry-run') CONFIG.dryRun = true;
  if (arg === '--no-skip') CONFIG.skipExisting = false;
  if (arg.startsWith('--out=')) CONFIG.outDir = arg.split('=')[1];
}
// ── 全局画风后缀 ──
const STYLE_SUFFIX = ', surreal dark fantasy illustration, full body character, atmospheric lighting, detailed, high quality, centered, precise anatomy';

// ── 加载角色数据 ──
const charsPath = path.resolve(__dirname, '../cloudfunctions/character/characters.json');
const characters = JSON.parse(fs.readFileSync(charsPath, 'utf-8'));
const toGen = CONFIG.ids
  ? characters.filter(c => CONFIG.ids.includes(c.id))
  : characters;

if (toGen.length === 0) {
  console.error('没有匹配的角色');
  process.exit(1);
}

console.log(`共 ${toGen.length} 个角色, 输出: ${CONFIG.outDir}`);
if (CONFIG.dryRun) console.log('(dry-run 模式: 只生成第一张)');
console.log('');

// ── 生成单张图片 ──
async function generateChar(char, attempt = 1) {
  const filename = `${String(char.id).padStart(2, '0')}_${char.name}.png`;
  const outPath = path.join(CONFIG.outDir, filename);

  if (CONFIG.skipExisting && fs.existsSync(outPath)) {
    console.log(`  [跳过] ${char.name} — 已存在`);
    return outPath;
  }

  const prompt = char.visualPrompt + STYLE_SUFFIX;
  const encoded = encodeURIComponent(prompt);
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&nologo=true&seed=${char.id * 100}&enhance=true`;

  process.stdout.write(`  [生成] ${char.name} (${char.id}/30)...`);

  let ctrl, timer;
  try {
    ctrl = new AbortController();
    timer = setTimeout(() => ctrl.abort(), CONFIG.timeout);

    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(timer);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 1000) {
      throw new Error(`图片太小 (${buffer.length} bytes), 可能生成失败`);
    }

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, buffer);
    console.log(` ✓ ${(buffer.length / 1024).toFixed(0)}KB`);
    return outPath;
  } catch (err) {
    clearTimeout(timer);
    if (attempt < CONFIG.retry) {
      console.log(` 重试 (${attempt + 1}/${CONFIG.retry})...`);
      await sleep(2000);
      return generateChar(char, attempt + 1);
    }
    console.log(` ✗ ${err.message}`);
    return null;
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  fs.mkdirSync(CONFIG.outDir, { recursive: true });

  if (CONFIG.dryRun) {
    console.log('=== 试生成 ===');
    await generateChar(toGen[0]);
    console.log('\n确认效果后去掉 --dry-run 正式生成。');
    return;
  }

  // 分批并发
  for (let i = 0; i < toGen.length; i += CONFIG.concurrency) {
    const batch = toGen.slice(i, i + CONFIG.concurrency);
    console.log(`=== 批次 ${Math.floor(i / CONFIG.concurrency) + 1}/${Math.ceil(toGen.length / CONFIG.concurrency)} ===`);
    await Promise.all(batch.map(c => generateChar(c)));
    await sleep(1500); // 批次间间隔
    console.log('');
  }

  console.log('全部完成!');
}

main().catch(err => { console.error('错误:', err); process.exit(1); });
