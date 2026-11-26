// Shared helpers: read the relay pack (skills / conventions / templates / config)
// from the repo root, regardless of where the server/CLI is launched.
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url)); // <root>/server/lib
export const ROOT = path.resolve(process.env.RELAY_ROOT || path.join(here, '..', '..'));

export function root() {
  return ROOT;
}

function frontMatter(txt) {
  const m = txt.match(/^---\n([\s\S]*?)\n---/);
  return m ? m[1] : '';
}

// Pull a readable one-paragraph description out of YAML frontmatter,
// handling both inline and folded/literal (>- , | ) scalars.
function frontDesc(txt) {
  const fm = frontMatter(txt);
  const m = fm.match(/description:\s*(.*)/);
  if (!m) return '';
  let d = m[1].trim();
  if (['>-', '>', '|', '|-', '|+', '>+'].includes(d)) {
    const after = fm.slice(fm.indexOf(m[0]) + m[0].length);
    d = after
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .join(' ');
  }
  return d.replace(/^["']|["']$/g, '').trim();
}

export async function listSkills() {
  const dir = path.join(ROOT, 'skills');
  if (!existsSync(dir)) return [];
  const names = (await readdir(dir, { withFileTypes: true }))
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
  const out = [];
  for (const name of names) {
    const f = path.join(dir, name, 'SKILL.md');
    if (!existsSync(f)) continue;
    out.push({ name, description: frontDesc(await readFile(f, 'utf8')) });
  }
  return out;
}

export async function getSkill(name) {
  const f = path.join(ROOT, 'skills', name, 'SKILL.md');
  if (!existsSync(f)) throw new Error(`skill not found: ${name}`);
  return readFile(f, 'utf8');
}

// Read any pack file by repo-relative path, refusing path escapes.
export async function getFile(rel) {
  const full = path.resolve(ROOT, rel);
  if (full !== ROOT && !full.startsWith(ROOT + path.sep)) {
    throw new Error('path outside the pack');
  }
  if (!existsSync(full)) throw new Error(`file not found: ${rel}`);
  return readFile(full, 'utf8');
}

export async function passScore() {
  for (const f of ['config/placeholders.yaml', 'config/placeholders.example.yaml']) {
    const p = path.join(ROOT, f);
    if (existsSync(p)) {
      const m = (await readFile(p, 'utf8')).match(/^PASS_SCORE:\s*(\d+)/m);
      if (m) return Number(m[1]);
    }
  }
  return 80;
}

export async function scorecard() {
  return getFile('templates/scorecard.md');
}
