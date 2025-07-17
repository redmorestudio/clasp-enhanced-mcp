# Clasp Enhanced MCP Server

## Overview
A comprehensive MCP (Model Context Protocol) server that provides complete access to Google Apps Script development through the clasp CLI. This server enables AI assistants like Claude to manage, develop, and deploy Google Apps Script projects with full version control, deployment management, and real-time execution capabilities.

## Why Use Clasp Instead of Direct API?

### The Power of Clasp
While direct Google Apps Script API access is powerful, clasp (Command Line Apps Script) offers several compelling advantages:

1. **Local Development Workflow**
   - Edit code in your favorite IDE with syntax highlighting, linting, and Git integration
   - Use modern JavaScript/TypeScript with automatic transpilation
   - Maintain a proper version-controlled codebase alongside your other projects

2. **Superior Version Control**
   - Native Git integration for tracking changes
   - Pull specific versions from Google's version history
   - Merge Google's online edits with local changes
   - Maintain multiple branches for different features/environments

3. **Simplified Authentication**
   - Single login for all projects
   - No complex OAuth token management
   - Credentials stored securely by clasp
   - Works seamlessly with Google's security model

4. **Development Best Practices**
   - TypeScript support with type definitions
   - Modern ES6+ JavaScript features
   - Local testing before deployment
   - Integration with CI/CD pipelines

5. **Project Portability**
   - Easy project sharing via Git repositories
   - Team collaboration with standard Git workflows
   - No need to share Google Drive access
   - Clear separation of code and Google-specific configuration

### When to Use Each Approach

**Use Clasp (this server) when:**
- Building production Apps Script projects
- Working with teams using Git
- Need TypeScript or modern JavaScript
- Want local development with IDE features
- Managing multiple environments (dev/staging/prod)
- Implementing CI/CD workflows

**Use Direct API (google-apps-script-mcp) when:**
- Need programmatic project creation at scale
- Building tools that manage many scripts
- Requiring detailed metrics and analytics
- Implementing custom deployment strategies
- Building Apps Script management dashboards

## Complete Tool Reference

### 🔐 Authentication Tools

#### `clasp_login`
Login to Google account for clasp operations.
```javascript
// Parameters:
{
  creds: string,     // Optional: Path to credentials file
  global: boolean    // Default true: Save credentials globally
}
```

#### `clasp_logout`
Logout from Google account.
```javascript
// No parameters required
```

### 📁 Project Management Tools

#### `clasp_create`
Create a new Google Apps Script project.
```javascript
// Parameters:
{
  title: string,           // Required: Project title
  type: string,           // Default "standalone": Type of project
                         // Options: "standalone", "docs", "sheets", "slides", 
                         //          "forms", "webapp", "api"
  rootDir: string,        // Default ".": Root directory for the project
  parentId: string        // Optional: Drive folder ID for the project
}
```

#### `clasp_clone`
Clone an existing Google Apps Script project with optional version support.
```javascript
// Parameters:
{
  scriptId: string,        // Required: Script ID to clone
  versionNumber: number,   // Optional: Specific version to clone
  rootDir: string         // Default ".": Directory to clone into
}
```

#### `clasp_pull`
Pull changes from Google Apps Script.
```javascript
// Parameters:
{
  versionNumber: number,   // Optional: Pull specific version
  rootDir: string         // Default ".": Root directory of the project
}
```

#### `clasp_push`
Push local changes to Google Apps Script.
```javascript
// Parameters:
{
  watch: boolean,         // Default false: Watch for changes
  force: boolean,         // Default false: Force push without confirmation
  rootDir: string        // Default ".": Root directory of the project
}
```

#### `clasp_status`
Check the status of the current clasp project.
```javascript
// Parameters:
{
  json: boolean,          // Default false: Output as JSON
  rootDir: string        // Default ".": Root directory of the project
}
```

#### `clasp_open`
Open the project in the Apps Script editor.
```javascript
// Parameters:
{
  webapp: boolean,        // Default false: Open web app URL
  deploymentId: string,   // Optional: Open specific deployment
  rootDir: string        // Default ".": Root directory of the project
}
```

#### `clasp_list`
List all your Google Apps Script projects.
```javascript
// No parameters required
```

### 📦 Version Management Tools

#### `clasp_version`
Create a new version of the project.
```javascript
// Parameters:
{
  description: string,    // Optional: Version description
  rootDir: string        // Default ".": Root directory of the project
}
```

#### `clasp_versions`
List all versions of the project.
```javascript
// Parameters:
{
  rootDir: string        // Default ".": Root directory of the project
}
```

### 🚀 Deployment Management Tools

#### `clasp_deploy`
Create a new deployment.
```javascript
// Parameters:
{
  versionNumber: number,   // Optional: Version to deploy
  description: string,     // Optional: Deployment description
  deploymentId: string,    // Optional: ID to update existing deployment
  rootDir: string         // Default ".": Root directory of the project
}
```

#### `clasp_deployments`
List all deployments.
```javascript
// Parameters:
{
  rootDir: string        // Default ".": Root directory of the project
}
```

#### `clasp_undeploy`
Remove a deployment.
```javascript
// Parameters:
{
  deploymentId: string,   // Optional: Specific deployment to remove
  all: boolean,          // Default false: Remove all deployments
  rootDir: string        // Default ".": Root directory of the project
}
```

### 🛠️ Development Tools

#### `clasp_run`
Run a function in the Apps Script project.
```javascript
// Parameters:
{
  functionName: string,   // Required: Function name to run
  params: string,         // Optional: Parameters as JSON string
  nondev: boolean,        // Default false: Run production deployment
  rootDir: string        // Default ".": Root directory of the project
}
```

#### `clasp_logs`
View or watch project logs.
```javascript
// Parameters:
{
  watch: boolean,         // Default false: Watch for new logs
  open: boolean,         // Default false: Open logs in browser
  setup: boolean,        // Default false: Setup logs
  json: boolean,         // Default false: Output as JSON
  simplified: boolean,   // Default false: Simplified output
  rootDir: string        // Default ".": Root directory of the project
}
```

#### `clasp_apis`
List or enable/disable APIs.
```javascript
// Parameters:
{
  list: boolean,         // Default false: List enabled APIs
  enable: string,        // Optional: API to enable
  disable: string,       // Optional: API to disable
  open: boolean,         // Default false: Open API console
  rootDir: string        // Default ".": Root directory of the project
}
```

#### `clasp_setting`
Manage project settings.
```javascript
// Parameters:
{
  key: string,           // Optional: Setting key (e.g., "scriptId", "rootDir")
  value: string,         // Optional: Setting value
  rootDir: string        // Default ".": Root directory of the project
}
```

## Installation & Setup

### Prerequisites
1. Node.js 16 or higher
2. npm or yarn package manager
3. Google account with Apps Script access

### Installation Steps

1. **Install the MCP server:**
   ```bash
   cd /path/to/clasp-enhanced
   npm install
   ```

2. **Install clasp globally:**
   ```bash
   npm install -g @google/clasp
   ```

3. **Configure Claude Desktop:**
   Add to your `claude_desktop_config.json`:
   ```json
   {
     "mcpServers": {
       "clasp-enhanced": {
         "command": "node",
         "args": ["/absolute/path/to/clasp-enhanced/index.js"]
       }
     }
   }
   ```

4. **Restart Claude Desktop**

5. **Login to Google:**
   Use the `clasp_login` tool in Claude

## Example Workflows

### Creating a New Project
```javascript
// 1. Create a new standalone script
await clasp_create({
  title: "My Analytics Script",
  type: "standalone"
})

// 2. Push your local code
await clasp_push()

// 3. Create a version
await clasp_version({
  description: "Initial version"
})

// 4. Deploy it
await clasp_deploy({
  description: "Production deployment",
  versionNumber: 1
})
```

### Cloning and Modifying an Existing Project
```javascript
// 1. Clone a specific version
await clasp_clone({
  scriptId: "1a2b3c4d5e6f...",
  versionNumber: 45
})

// 2. Make local changes
// ... edit files ...

// 3. Push changes
await clasp_push()

// 4. Create new version
await clasp_version({
  description: "Added new features"
})
```

### Managing Deployments
```javascript
// List current deployments
await clasp_deployments()

// Update a deployment to new version
await clasp_deploy({
  deploymentId: "AKfycbw...",
  versionNumber: 50,
  description: "Hotfix for production"
})

// Remove old deployment
await clasp_undeploy({
  deploymentId: "AKfycbx..."
})
```

## Best Practices

1. **Version Management**
   - Always create versions before deploying
   - Use descriptive version messages
   - Pull specific versions when debugging

2. **Deployment Strategy**
   - Maintain separate deployments for dev/staging/prod
   - Always test in development before production
   - Use version numbers in deployment descriptions

3. **Local Development**
   - Use `.claspignore` to exclude files
   - Keep sensitive data in `.env` files (ignored by clasp)
   - Use TypeScript for better type safety

4. **Collaboration**
   - Share projects via Git, not Google Drive
   - Document deployment IDs and their purposes
   - Use consistent naming conventions

## Troubleshooting

### Common Issues

1. **"User has not enabled the Apps Script API"**
   - Run `clasp_apis({ enable: "script", open: true })`
   - Or visit https://script.google.com/home/usersettings

2. **"Script ID not found"**
   - Ensure you're in the correct directory
   - Check `.clasp.json` exists and has correct scriptId
   - Verify you have access to the script

3. **Push fails with "Invalid syntax"**
   - Check for ES6+ features not supported in Apps Script
   - Ensure files have `.js` or `.gs` extensions
   - Remove any Node.js specific code

## Architecture Notes

This MCP server acts as a bridge between AI assistants and the clasp CLI, providing:
- Structured command execution with proper error handling
- Parameter validation and type checking
- Consistent JSON responses for AI parsing
- Automatic working directory management
- Enhanced features like version-specific operations

The server is built with:
- Modern ES modules for clean architecture
- Promisified child process execution
- Comprehensive error handling
- Full MCP protocol compliance

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Author

Seth Redmore

## Acknowledgments

- Google clasp team for the excellent CLI tool
- Anthropic for the MCP protocol specification
- The Google Apps Script community