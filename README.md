# EasyScholar MCP Server

[English](#english) | [中文](#中文)

---

## English

An MCP server for querying academic journal rankings via the [EasyScholar](https://www.easyscholar.cc) API. Supports **30+ ranking systems** including SCI, SSCI, ABDC, AJG, CCF, CAS zones, impact factors, and university-specific rankings.

Works with Claude Code, Claude Desktop, Cursor, Windsurf, and any MCP-compatible client.

### Supported Rankings

| Category | Rankings |
|----------|---------|
| **SCI/SSCI** | JCR Quartile, CAS Zone (Basic/Upgraded/TOP), Impact Factor, 5-Year IF, JCI |
| **Business Schools** | ABDC, AJG (ABS), FT50, UTD24, FMS |
| **Computer Science** | CCF (Journal/Conference) |
| **Chinese Core** | PKU Core, CSSCI, CSCD |
| **University-Specific** | Nanjing, Fudan, SJTU, Sichuan, CUFE, SWUFE, SWJTU, and more |
| **Other** | EI, ESI Subject, CAS Early Warning |

### Prerequisites

- Node.js 18+
- EasyScholar Secret Key (free): Register at [easyscholar.cc](https://www.easyscholar.cc), go to user center, copy your secret key

### Installation

```bash
git clone https://github.com/chaosman42/easyscholar-mcp.git
cd easyscholar-mcp
npm install
```

### Configuration

#### Claude Code

Add to `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "easyscholar": {
      "command": "node",
      "args": ["/path/to/easyscholar-mcp/index.js"],
      "env": {
        "EASYSCHOLAR_SECRET_KEY": "YOUR_SECRET_KEY"
      }
    }
  }
}
```

#### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "easyscholar": {
      "command": "node",
      "args": ["/path/to/easyscholar-mcp/index.js"],
      "env": {
        "EASYSCHOLAR_SECRET_KEY": "YOUR_SECRET_KEY"
      }
    }
  }
}
```

### Tools

| Tool | Description |
|------|-------------|
| `get_publication_rank` | Query journal rankings with formatted output (SCI quartile, impact factor, ABDC, AJG, CCF, etc.) |
| `get_publication_rank_raw` | Query journal rankings and return raw JSON data for programmatic use |

### Usage Examples

Once configured, ask your AI assistant:

- "What's the ranking of Journal of Applied Psychology?"
- "查询 MIS Quarterly 的期刊等级"
- "Is the Journal of Business Research an ABDC A journal?"
- "What's the impact factor of Nature?"
- "Compare the rankings of AMJ and AMR"

### Example Output

```
## Journal Ranking: Journal of Applied Psychology

### Core Metrics
- **SCI Quartile (Clarivate JCR)**: Q1
- **CAS Zone (Upgraded)**: Zone 1
- **Impact Factor**: 9.4
- **5-Year Impact Factor**: 11.2

### Business School Rankings
- ABDC: A*
- AJG (ABS): 4*
- FT50: Yes
- UTD24: Yes
```

---

## 中文

一个通过 [EasyScholar](https://www.easyscholar.cc) API 查询学术期刊等级的 MCP 服务器。支持 **30+ 种等级体系**，包括 SCI、SSCI、ABDC、AJG、CCF、中科院分区、影响因子、各高校认定等级等。

支持 Claude Code、Claude Desktop、Cursor、Windsurf 等所有 MCP 兼容客户端。

### 支持的等级体系

| 分类 | 等级 |
|------|------|
| **SCI/SSCI** | JCR 分区、中科院分区（基础版/升级版/TOP）、影响因子、5年影响因子、JCI |
| **商学院** | ABDC、AJG（ABS）、FT50、UTD24、FMS |
| **计算机** | CCF（期刊/会议） |
| **中文核心** | 北大核心、CSSCI（南大核心）、CSCD |
| **高校认定** | 南京大学、复旦大学、上海交大、四川大学、中央财经、西南财经、西南交大 等 |
| **其他** | EI 收录、ESI 学科、中科院预警 |

### 环境要求

- Node.js 18+
- EasyScholar 密钥（免费）：在 [easyscholar.cc](https://www.easyscholar.cc) 注册，进入个人中心复制密钥

### 安装

```bash
git clone https://github.com/chaosman42/easyscholar-mcp.git
cd easyscholar-mcp
npm install
```

### 配置

#### Claude Code

在 `~/.claude/settings.json` 中添加：

```json
{
  "mcpServers": {
    "easyscholar": {
      "command": "node",
      "args": ["/你的路径/easyscholar-mcp/index.js"],
      "env": {
        "EASYSCHOLAR_SECRET_KEY": "你的密钥"
      }
    }
  }
}
```

#### Claude Desktop

在 `~/Library/Application Support/Claude/claude_desktop_config.json`（macOS）或 `%APPDATA%\Claude\claude_desktop_config.json`（Windows）中添加同样的配置。

### 工具列表

| 工具 | 说明 |
|------|------|
| `get_publication_rank` | 查询期刊等级，返回格式化的报告（SCI分区、影响因子、ABDC、AJG、CCF 等） |
| `get_publication_rank_raw` | 查询期刊等级，返回原始 JSON 数据，方便程序处理 |

### 使用示例

配置完成后，对 AI 助手说：

- "查询 Journal of Applied Psychology 的期刊等级"
- "MIS Quarterly 是什么级别的期刊？"
- "Journal of Business Research 是不是 ABDC A 级？"
- "Nature 的影响因子是多少？"
- "对比 AMJ 和 AMR 的期刊等级"

### 输出示例

```
## 期刊等级信息: Journal of Applied Psychology

### 核心指标
- **SCI 分区 (Clarivate JCR)**: Q1
- **中科院分区 (升级版)**: 1区
- **影响因子**: 9.4
- **5年影响因子**: 11.2

### 商学院排名
- ABDC: A*
- AJG (ABS): 4*
- FT50: Yes
- UTD24: Yes
```

### 获取密钥

1. 访问 [easyscholar.cc](https://www.easyscholar.cc) 注册账号
2. 登录后进入个人中心
3. 复制 Secret Key
4. 将密钥配置到环境变量 `EASYSCHOLAR_SECRET_KEY`

---

## License

MIT License. See [LICENSE](LICENSE) for details.

## Contributing

Issues and pull requests are welcome.

欢迎提交 Issue 和 Pull Request。
