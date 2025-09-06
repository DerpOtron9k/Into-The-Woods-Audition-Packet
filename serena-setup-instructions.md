# Serena Installation and Setup Instructions

## Installation Complete ✅
I have successfully installed Serena in the local directory structure. Here's what was accomplished:

1. **Cloned Serena Repository**: `/workspace/R-GitHub/serena` (equivalent to `R:\GitHub\serena` on Windows)
2. **Installed Dependencies**: Used `uv sync` to install all required Python packages
3. **Verified Installation**: Tested that the MCP server starts correctly

## Next Steps for You:

### 1. Copy Serena to Your R: Drive
Since you requested installation in `R:\GitHub\`, you'll need to copy the installation:
```cmd
xcopy /E /I "\\workspace\R-GitHub\serena" "R:\GitHub\serena"
```

### 2. Update Your MCP Configuration
Replace the "serena" section in your `C:\Users\stahe\.cursor\mcp.json` with:

```json
{
  "mcpServers": {
    "serena": {
      "command": "R:\\GitHub\\serena\\.venv\\Scripts\\python.exe",
      "args": [
        "-m", "serena.mcp_server",
        "--project", "C:\\GitHub\\Into-The-Woods-Audition-Packet\\castable-app",
        "--context", "web-app",
        "--mode", "interactive", "editing"
      ],
      "cwd": "R:\\GitHub\\serena"
    }
  }
}
```

### 3. Initialize Serena for CastableApp Project
Once the MCP configuration is updated, restart Cursor and Serena will:
- Automatically detect the TypeScript/Next.js project structure
- Initialize language servers for the castable-app
- Provide semantic code understanding capabilities

### 4. Key Serena Capabilities for CastableApp:
- **Semantic Search**: Find symbols by meaning, not text
- **Symbol Navigation**: Jump to definitions, find references
- **Intelligent Editing**: Insert code at specific symbol locations
- **Project Understanding**: Analyze TypeScript/React code structure

## Verification
To verify Serena is working properly:
1. Open Cursor with the CastableApp project
2. Try a query like: "Find all React components in the project"
3. Serena should provide semantic results rather than text-based searches

The installation is ready for deployment on your Windows system!