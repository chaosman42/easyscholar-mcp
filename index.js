#!/usr/bin/env node

/**
 * EasyScholar MCP Server
 *
 * Query journal rankings, impact factors, SCI quartiles, and more
 * via the EasyScholar API. Supports Claude Code, Claude Desktop,
 * Cursor, Windsurf, and any MCP-compatible client.
 *
 * API: https://www.easyscholar.cc
 * Get your secret key at: https://www.easyscholar.cc (register -> user center -> secret key)
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// EasyScholar API configuration - secret key MUST be set via environment variable
const EASYSCHOLAR_API_BASE = "https://www.easyscholar.cc/open";
const SECRET_KEY = process.env.EASYSCHOLAR_SECRET_KEY || "";

/**
 * Core function to query journal ranking from EasyScholar API
 * @param {string} publicationName - journal name in English or Chinese
 * @returns {Promise<object>} - raw API response
 */
async function getPublicationRank(publicationName) {
  if (!SECRET_KEY) {
    throw new Error(
      "EASYSCHOLAR_SECRET_KEY is not set. Get your key at https://www.easyscholar.cc (register -> user center -> secret key)"
    );
  }

  const url = `${EASYSCHOLAR_API_BASE}/getPublicationRank?secretKey=${SECRET_KEY}&publicationName=${encodeURIComponent(publicationName)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Format journal ranking data into a readable report
 * Covers SCI quartile, CAS zone, impact factor, ABDC, AJG, CCF, CSSCI, and university rankings
 * @param {object} data - raw API response
 * @param {string} journalName - the queried journal name
 * @returns {string} - formatted markdown string
 */
function formatPublicationRank(data, journalName) {
  if (data.code !== 200 || !data.data) {
    return `Query failed: ${data.msg || "Unknown error"}. Journal "${journalName}" may not exist in the database.`;
  }

  const officialRank = data.data.officialRank?.all || {};
  const selectRank = data.data.officialRank?.select || {};

  let result = `## Journal Ranking: ${journalName}\n\n`;

  // SCI / SSCI core metrics
  result += "### Core Metrics\n";
  if (selectRank.sci) result += `- **SCI Quartile (Clarivate JCR)**: ${selectRank.sci}\n`;
  if (selectRank.sciBase) result += `- **CAS Zone (Chinese Academy of Sciences, Basic)**: ${selectRank.sciBase}\n`;
  if (selectRank.sciUp) result += `- **CAS Zone (Upgraded)**: ${selectRank.sciUp}\n`;
  if (selectRank.sciUpTop) result += `- **CAS Zone TOP**: ${selectRank.sciUpTop}\n`;
  if (officialRank.sciif) result += `- **Impact Factor**: ${officialRank.sciif}\n`;
  if (selectRank.sciif5) result += `- **5-Year Impact Factor**: ${selectRank.sciif5}\n`;
  if (officialRank.jci) result += `- **JCI (Journal Citation Indicator)**: ${officialRank.jci}\n`;
  if (officialRank.esi) result += `- **ESI Subject**: ${officialRank.esi}\n`;
  if (officialRank.eii) result += `- **EI Index**: ${officialRank.eii}\n`;
  if (officialRank.sciWarning) result += `- **CAS Early Warning**: ${officialRank.sciWarning}\n`;

  // International business school rankings
  const bizRanks = [];
  if (officialRank.abdc) bizRanks.push(`ABDC: ${officialRank.abdc}`);
  if (officialRank.ajg) bizRanks.push(`AJG (ABS): ${officialRank.ajg}`);
  if (officialRank.ft50) bizRanks.push(`FT50: ${officialRank.ft50}`);
  if (officialRank.utd24) bizRanks.push(`UTD24: ${officialRank.utd24}`);
  if (officialRank.fms) bizRanks.push(`FMS: ${officialRank.fms}`);

  if (bizRanks.length > 0) {
    result += "\n### Business School Rankings\n";
    bizRanks.forEach((rank) => {
      result += `- ${rank}\n`;
    });
  }

  // CCF and CS rankings
  const csRanks = [];
  if (officialRank.ccf) csRanks.push(`CCF: ${officialRank.ccf}`);
  if (officialRank.ccfJournal) csRanks.push(`CCF Journal: ${officialRank.ccfJournal}`);
  if (officialRank.ccfConference) csRanks.push(`CCF Conference: ${officialRank.ccfConference}`);

  if (csRanks.length > 0) {
    result += "\n### Computer Science Rankings\n";
    csRanks.forEach((rank) => {
      result += `- ${rank}\n`;
    });
  }

  // Chinese core journal rankings
  const cnRanks = [];
  if (officialRank.pku) cnRanks.push(`PKU Core (北大核心): ${officialRank.pku}`);
  if (officialRank.cssci) cnRanks.push(`CSSCI (南大核心): ${officialRank.cssci}`);
  if (officialRank.cscd) cnRanks.push(`CSCD: ${officialRank.cscd}`);

  if (cnRanks.length > 0) {
    result += "\n### Chinese Core Journal Rankings\n";
    cnRanks.forEach((rank) => {
      result += `- ${rank}\n`;
    });
  }

  // University-specific rankings
  const uniRanks = [];
  if (officialRank.nju) uniRanks.push(`Nanjing University: ${officialRank.nju}`);
  if (officialRank.scu) uniRanks.push(`Sichuan University: ${officialRank.scu}`);
  if (officialRank.xju) uniRanks.push(`Xinjiang University: ${officialRank.xju}`);
  if (officialRank.cufe) uniRanks.push(`Central University of Finance: ${officialRank.cufe}`);
  if (officialRank.sdufe) uniRanks.push(`Shandong University of Finance: ${officialRank.sdufe}`);
  if (officialRank.swjtu) uniRanks.push(`Southwest Jiaotong University: ${officialRank.swjtu}`);
  if (officialRank.hhu) uniRanks.push(`Hohai University: ${officialRank.hhu}`);
  if (officialRank.cug) uniRanks.push(`China University of Geosciences: ${officialRank.cug}`);
  if (officialRank.cpu) uniRanks.push(`China Pharmaceutical University: ${officialRank.cpu}`);
  if (officialRank.xdu) uniRanks.push(`Xidian University: ${officialRank.xdu}`);
  if (officialRank.fdu) uniRanks.push(`Fudan University: ${officialRank.fdu}`);
  if (officialRank.sjtu) uniRanks.push(`Shanghai Jiao Tong University: ${officialRank.sjtu}`);
  if (officialRank.uibe) uniRanks.push(`UIBE: ${officialRank.uibe}`);
  if (officialRank.swufe) uniRanks.push(`SWUFE: ${officialRank.swufe}`);

  if (uniRanks.length > 0) {
    result += "\n### University-Specific Rankings\n";
    uniRanks.forEach((rank) => {
      result += `- ${rank}\n`;
    });
  }

  return result;
}

// Create MCP server
const server = new Server(
  {
    name: "easyscholar-mcp",
    version: "2.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_publication_rank",
        description:
          "Query journal rankings including SCI quartile, CAS zone, impact factor, ABDC, AJG, CCF, CSSCI, and 30+ ranking systems. Supports English and Chinese journal names.",
        inputSchema: {
          type: "object",
          properties: {
            publicationName: {
              type: "string",
              description:
                "Journal name in English or Chinese, e.g. 'Nature', 'Science', 'MIS Quarterly', 'Journal of Applied Psychology'",
            },
          },
          required: ["publicationName"],
        },
      },
      {
        name: "get_publication_rank_raw",
        description:
          "Query journal rankings and return raw JSON data with all available fields. Useful for programmatic processing.",
        inputSchema: {
          type: "object",
          properties: {
            publicationName: {
              type: "string",
              description: "Journal name in English or Chinese",
            },
          },
          required: ["publicationName"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "get_publication_rank") {
      const data = await getPublicationRank(args.publicationName);
      const formatted = formatPublicationRank(data, args.publicationName);
      return { content: [{ type: "text", text: formatted }] };
    } else if (name === "get_publication_rank_raw") {
      const data = await getPublicationRank(args.publicationName);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    } else {
      throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

// Start server
async function main() {
  if (!SECRET_KEY) {
    console.error("WARNING: EASYSCHOLAR_SECRET_KEY is not set.");
    console.error("Get your key at: https://www.easyscholar.cc (register -> user center -> secret key)");
  }
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("EasyScholar MCP Server v2.0.0 running on stdio");
}

main().catch(console.error);
