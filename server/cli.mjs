#!/usr/bin/env node
// relay CLI — list/show skills, print the scoring gate, scaffold placeholders,
// install the pack into a tool's directory, or run the MCP server.
import { listSkills, getSkill, getFile, passScore, scorecard, root } from './lib/pack.mjs';
import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const argv = process.argv.slice(2);
const cmd = argv[0];
const rest = argv.slice(1);
const flag = (name, def) => {
  const i = rest.indexOf(name);
  return i >= 0 && rest[i + 1] ? rest[i + 1] : def;
};

async function main() {
  switch (cmd) {
    case 'list': {
      const skills = await listSkills();
      for (const s of skills) console.log(`${s.name.padEnd(26)} ${s.description}`);
      console.log(`\n${skills.length} skills · pass score ${await passScore()}`);
      break;
    }
    case 'show': {
      if (!rest[0]) return fail('usage: relay show <skill>');
      process.stdout.write(await getSkill(rest[0]));
      break;
    }
    case 'score':
    case 'scorecard': {
      console.log(`PASS_SCORE = ${await passScore()}\n`);
      process.stdout.write(await scorecard());
      console.log('\n\n--- how the gate works: skills/workflow-scorecard/SKILL.md ---\n');
      process.stdout.write(await getSkill('workflow-scorecard'));
      break;
    }
    case 'init': {
      const dest = path.resolve(flag('--dir', process.cwd()), 'placeholders.yaml');
      if (existsSync(dest) && !rest.includes('--force')) return fail(`${dest} exists (use --force)`);
      writeFileSync(dest, await getFile('config/placeholders.example.yaml'));
      console.log(`wrote ${dest} — fill in your systems (never credentials).`);
      break;
    }
    case 'install': {
      const tool = rest.find((a) => !a.startsWith('--')) || 'generic';
      const base = flag('--dir', defaultDir(tool));
      const dest = path.join(base, 'relay');
      mkdirSync(base, { recursive: true });
      for (const d of ['skills', 'conventions', 'templates', 'config', 'examples']) {
        const src = path.join(root(), d);
        if (existsSync(src)) cpSync(src, path.join(dest, d), { recursive: true });
      }
      console.log(`installed relay pack -> ${dest}`);
      console.log(hint(tool, dest));
      break;
    }
    case 'mcp':
      await import('./index.mjs');
      break;
    case 'root':
      console.log(root());
      break;
    default:
      help();
  }
}

function defaultDir(tool) {
  if (tool === 'claude' || tool === 'claude-code') return path.join(os.homedir(), '.claude', 'skills');
  if (tool === 'cursor') return path.join(process.cwd(), '.cursor');
  return path.join(process.cwd(), 'relay-pack');
}

function hint(tool, dest) {
  if (tool === 'claude' || tool === 'claude-code')
    return `Point Claude Code at ${dest}/skills, or use the Claude Code plugin in plugins/claude-code.`;
  if (tool === 'cursor')
    return `Add ${dest}/relay/skills to your Cursor rules, or use plugins/cursor/relay.mdc.`;
  return `Load ${dest}/relay/skills into your agent; any model can read the SKILL.md files.`;
}

function help() {
  console.log(`relay — model-agnostic multi-agent dev+test workflow

usage:
  relay list                 list skills + pass score
  relay show <skill>         print one SKILL.md
  relay score                print the scoring gate (rubric + threshold + skill)
  relay init [--dir d]       write placeholders.yaml to fill in
  relay install [tool]       copy the pack into a tool dir
                             tool: claude-code | cursor | generic   [--dir d]
  relay mcp                  run the MCP server over stdio
`);
}

function fail(m) {
  console.error(m);
  process.exitCode = 1;
}

main().catch((e) => {
  console.error(e.message || e);
  process.exitCode = 1;
});
