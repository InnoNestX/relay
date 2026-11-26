// relay MCP server (stdio). Exposes the relay workflow to any MCP-capable
// client (Claude Code, Cursor, and other MCP hosts). Model-agnostic: it only
// serves the skills, conventions, templates and the scoring gate as text.
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { listSkills, getSkill, getFile, passScore, scorecard } from './lib/pack.mjs';

const server = new McpServer({ name: 'relay', version: '0.1.0' });

const text = (t) => ({ content: [{ type: 'text', text: t }] });

server.tool(
  'relay_list_skills',
  'List every relay skill (the dev+test workflow) with a one-line description.',
  {},
  async () => {
    const skills = await listSkills();
    const body = skills.map((s) => `- ${s.name}: ${s.description}`).join('\n');
    return text(`relay skills (${skills.length}):\n${body}`);
  }
);

server.tool(
  'relay_get_skill',
  'Get the full SKILL.md of one relay skill by name.',
  { name: z.string().describe('skill name, e.g. supervisor, test-execution, workflow-scorecard') },
  async ({ name }) => text(await getSkill(name))
);

server.tool(
  'relay_get_file',
  'Read a relay pack file by repo-relative path (conventions/…, templates/…, config/…, examples/…).',
  { path: z.string().describe('repo-relative path, e.g. conventions/common-conventions.md') },
  async ({ path: rel }) => text(await getFile(rel))
);

server.tool(
  'relay_scorecard',
  'Return the relay scoring gate: the scorecard rubric, the pass threshold, and the workflow-scorecard skill. Use this before delivering to check the model followed the relay flow and scored high enough.',
  {},
  async () => {
    const [card, skill, score] = await Promise.all([
      scorecard(),
      getSkill('workflow-scorecard'),
      passScore(),
    ]);
    return text(
      `PASS_SCORE = ${score}\n\n=== skills/workflow-scorecard/SKILL.md ===\n${skill}\n\n=== templates/scorecard.md ===\n${card}`
    );
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
// stderr so stdout stays clean for the MCP protocol
console.error('relay MCP server ready (stdio)');
