// Shared helpers: read the relay pack (skills / conventions / templates / config)
// from the repo root, regardless of where the server/CLI is launched.
import { readdir, readFile, realpath } from 'node:fs/promises';
import { existsSync, realpathSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url)); // <root>/server/lib
export const ROOT = path.resolve(process.env.RELAY_ROOT || path.join(here, '..', '..'));
// Canonical root (symlinks resolved) used for all containment checks.
const REAL_ROOT = existsSync(ROOT) ? realpathSync(ROOT) : ROOT;

// A skill name is a single path segment: letters, digits, dash, underscore.
// Rejects separators, "." and ".." so it can never escape the skills directory.
function assertName(name) {
  if (typeof name !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(name)) {
    throw new Error(`invalid skill name: ${name}`);
  }
  return name;
}

// Read a file only if it stays inside the canonical pack root, both
// lexically and after symlinks are resolved.
async function readContained(full, label) {
  const rel = path.relative(REAL_ROOT, full);
  if (rel === '' || rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error(`path outside the pack: ${label}`);
  }
  if (!existsSync(full)) throw new Error(`not found: ${label}`);
  const real = await realpath(full);
  const realRel = path.relative(REAL_ROOT, real);
  if (realRel.startsWith('..') || path.isAbsolute(realRel)) {
    throw new Error(`path outside the pack: ${label}`);
  }
  return readFile(real, 'utf8');
}

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
  assertName(name);
  const full = path.join(REAL_ROOT, 'skills', name, 'SKILL.md');
  return readContained(full, `skill: ${name}`);
}

// Read any pack file by repo-relative path, refusing path escapes and symlinks.
export async function getFile(rel) {
  if (typeof rel !== 'string' || rel.includes('\0')) {
    throw new Error('invalid path');
  }
  const full = path.resolve(REAL_ROOT, rel);
  return readContained(full, rel);
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
