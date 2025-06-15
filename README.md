# Clasp Enhanced MCP Server

## Overview
An enhanced MCP (Model Context Protocol) server for Google Apps Script clasp CLI with full functionality including version cloning and all standard clasp commands.

## Features
- **Complete clasp CLI coverage** - All major clasp commands are supported
- **Version-specific operations** - Clone and pull specific versions
- **Full deployment management** - Create, update, and remove deployments
- **API management** - Enable/disable Google APIs
- **Logging and debugging** - View and watch logs
- **Project management** - Create, clone, push, pull projects

## Installation

```bash
npm install
```

## Usage

### In Claude Desktop
Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "clasp-enhanced": {
      "command": "node",
      "args": ["/path/to/clasp-enhanced/index.js"]
    }
  }
}
```

### Available Commands

#### Authentication
- `clasp_login` - Login to Google account
- `clasp_logout` - Logout from Google account

#### Project Management
- `clasp_create` - Create new project
- `clasp_clone` - Clone existing project (supports version parameter)
- `clasp_pull` - Pull changes (supports version parameter)
- `clasp_push` - Push changes
- `clasp_status` - Check project status
- `clasp_open` - Open in Apps Script editor
- `clasp_list` - List your projects

#### Version Management
- `clasp_version` - Create new version
- `clasp_versions` - List versions

#### Deployment Management
- `clasp_deploy` - Create deployment
- `clasp_deployments` - List deployments
- `clasp_undeploy` - Remove deployment

#### Development
- `clasp_run` - Run functions
- `clasp_logs` - View logs
- `clasp_apis` - Manage APIs
- `clasp_setting` - Manage settings

## Key Improvements
1. **Version Support** - Both `clasp_clone` and `clasp_pull` now support version numbers
2. **Complete CLI Coverage** - All major clasp commands are implemented
3. **Error Handling** - Proper error messages and handling
4. **Flexible Options** - All command options are supported

## Example Usage

### Clone a specific version
```javascript
clasp_clone({
  scriptId: "1abc123...",
  versionNumber: 30,
  rootDir: "./my-project"
})
```

### Pull a specific version
```javascript
clasp_pull({
  versionNumber: 25,
  rootDir: "./my-project"
})
```

### Deploy with description
```javascript
clasp_deploy({
  versionNumber: 33,
  description: "Production release",
  rootDir: "./my-project"
})
```

## Requirements
- Node.js 16+
- Google clasp CLI installed globally (`npm install -g @google/clasp`)
- Google account with Apps Script access

## License
MIT
