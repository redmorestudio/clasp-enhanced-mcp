import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile, writeFile, access, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));

class ClaspEnhancedServer {
  constructor() {
    this.server = new Server(
      {
        name: 'clasp-enhanced',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );
  }

  async execClaspCommand(command, options = {}) {
    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: options.cwd || process.cwd(),
        env: { ...process.env, ...options.env },
      });
      
      if (stderr && !stderr.includes('Warning')) {
        throw new Error(stderr);
      }
      
      return stdout.trim();
    } catch (error) {
      throw new Error(`Clasp command failed: ${error.message}`);
    }
  }

  setupToolHandlers() {
    this.server.setRequestHandler('tools/list', async () => ({
      tools: [
        {
          name: 'clasp_login',
          description: 'Login to Google account for clasp',
          inputSchema: {
            type: 'object',
            properties: {
              creds: {
                type: 'string',
                description: 'Optional path to credentials file',
              },
              global: {
                type: 'boolean',
                description: 'Save credentials globally',
                default: true,
              },
            },
          },
        },
        {
          name: 'clasp_logout',
          description: 'Logout from Google account',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'clasp_create',
          description: 'Create a new Google Apps Script project',
          inputSchema: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
                description: 'Title of the project',
              },
              type: {
                type: 'string',
                enum: ['standalone', 'docs', 'sheets', 'slides', 'forms', 'webapp', 'api'],
                description: 'Type of project',
                default: 'standalone',
              },
              rootDir: {
                type: 'string',
                description: 'Root directory for the project',
                default: '.',
              },
              parentId: {
                type: 'string',
                description: 'Drive folder ID for the project',
              },
            },
            required: ['title'],
          },
        },
        {
          name: 'clasp_clone',
          description: 'Clone an existing Google Apps Script project',
          inputSchema: {
            type: 'object',
            properties: {
              scriptId: {
                type: 'string',
                description: 'Script ID to clone',
              },
              versionNumber: {
                type: 'number',
                description: 'Specific version to clone (optional)',
              },
              rootDir: {
                type: 'string',
                description: 'Directory to clone into',
                default: '.',
              },
            },
            required: ['scriptId'],
          },
        },
        {
          name: 'clasp_pull',
          description: 'Pull changes from Google Apps Script',
          inputSchema: {
            type: 'object',
            properties: {
              versionNumber: {
                type: 'number',
                description: 'Specific version to pull',
              },
              rootDir: {
                type: 'string',
                description: 'Root directory of the project',
                default: '.',
              },
            },
          },
        },
        {
          name: 'clasp_push',
          description: 'Push changes to Google Apps Script',
          inputSchema: {
            type: 'object',
            properties: {
              watch: {
                type: 'boolean',
                description: 'Watch for changes',
                default: false,
              },
              force: {
                type: 'boolean',
                description: 'Force push without confirmation',
                default: false,
              },
              rootDir: {
                type: 'string',
                description: 'Root directory of the project',
                default: '.',
              },
            },
          },
        },
        {
          name: 'clasp_status',
          description: 'Check clasp project status',
          inputSchema: {
            type: 'object',
            properties: {
              json: {
                type: 'boolean',
                description: 'Output as JSON',
                default: false,
              },
              rootDir: {
                type: 'string',
                description: 'Root directory of the project',
                default: '.',
              },
            },
          },
        },
        {
          name: 'clasp_open',
          description: 'Open the project in the Apps Script editor',
          inputSchema: {
            type: 'object',
            properties: {
              webapp: {
                type: 'boolean',
                description: 'Open web app URL',
                default: false,
              },
              deploymentId: {
                type: 'string',
                description: 'Deployment ID to open',
              },
              rootDir: {
                type: 'string',
                description: 'Root directory of the project',
                default: '.',
              },
            },
          },
        },
        {
          name: 'clasp_deployments',
          description: 'List deployments',
          inputSchema: {
            type: 'object',
            properties: {
              rootDir: {
                type: 'string',
                description: 'Root directory of the project',
                default: '.',
              },
            },
          },
        },
        {
          name: 'clasp_deploy',
          description: 'Create a new deployment',
          inputSchema: {
            type: 'object',
            properties: {
              versionNumber: {
                type: 'number',
                description: 'Version to deploy',
              },
              description: {
                type: 'string',
                description: 'Deployment description',
              },
              deploymentId: {
                type: 'string',
                description: 'ID to update existing deployment',
              },
              rootDir: {
                type: 'string',
                description: 'Root directory of the project',
                default: '.',
              },
            },
          },
        },
        {
          name: 'clasp_undeploy',
          description: 'Remove a deployment',
          inputSchema: {
            type: 'object',
            properties: {
              deploymentId: {
                type: 'string',
                description: 'Deployment ID to remove',
              },
              all: {
                type: 'boolean',
                description: 'Remove all deployments',
                default: false,
              },
              rootDir: {
                type: 'string',
                description: 'Root directory of the project',
                default: '.',
              },
            },
          },
        },
        {
          name: 'clasp_version',
          description: 'Create a new version',
          inputSchema: {
            type: 'object',
            properties: {
              description: {
                type: 'string',
                description: 'Version description',
              },
              rootDir: {
                type: 'string',
                description: 'Root directory of the project',
                default: '.',
              },
            },
          },
        },
        {
          name: 'clasp_versions',
          description: 'List versions',
          inputSchema: {
            type: 'object',
            properties: {
              rootDir: {
                type: 'string',
                description: 'Root directory of the project',
                default: '.',
              },
            },
          },
        },
        {
          name: 'clasp_list',
          description: 'List your Google Apps Script projects',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'clasp_logs',
          description: 'View project logs',
          inputSchema: {
            type: 'object',
            properties: {
              json: {
                type: 'boolean',
                description: 'Output as JSON',
                default: false,
              },
              open: {
                type: 'boolean',
                description: 'Open logs in browser',
                default: false,
              },
              setup: {
                type: 'boolean',
                description: 'Setup logs',
                default: false,
              },
              watch: {
                type: 'boolean',
                description: 'Watch for new logs',
                default: false,
              },
              simplified: {
                type: 'boolean',
                description: 'Simplified output',
                default: false,
              },
              rootDir: {
                type: 'string',
                description: 'Root directory of the project',
                default: '.',
              },
            },
          },
        },
        {
          name: 'clasp_run',
          description: 'Run a function in the Apps Script project',
          inputSchema: {
            type: 'object',
            properties: {
              functionName: {
                type: 'string',
                description: 'Function name to run',
              },
              nondev: {
                type: 'boolean',
                description: 'Run with production (non-development) deployment',
                default: false,
              },
              params: {
                type: 'string',
                description: 'Parameters as JSON string',
              },
              rootDir: {
                type: 'string',
                description: 'Root directory of the project',
                default: '.',
              },
            },
            required: ['functionName'],
          },
        },
        {
          name: 'clasp_apis',
          description: 'List or enable/disable APIs',
          inputSchema: {
            type: 'object',
            properties: {
              list: {
                type: 'boolean',
                description: 'List enabled APIs',
                default: false,
              },
              enable: {
                type: 'string',
                description: 'API to enable',
              },
              disable: {
                type: 'string',
                description: 'API to disable',
              },
              open: {
                type: 'boolean',
                description: 'Open API console',
                default: false,
              },
              rootDir: {
                type: 'string',
                description: 'Root directory of the project',
                default: '.',
              },
            },
          },
        },
        {
          name: 'clasp_setting',
          description: 'Manage project settings',
          inputSchema: {
            type: 'object',
            properties: {
              key: {
                type: 'string',
                description: 'Setting key (e.g., scriptId, rootDir)',
              },
              value: {
                type: 'string',
                description: 'Setting value',
              },
              rootDir: {
                type: 'string',
                description: 'Root directory of the project',
                default: '.',
              },
            },
          },
        },
      ],
    }));

    this.server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'clasp_login':
            return await this.handleLogin(args);
          case 'clasp_logout':
            return await this.handleLogout();
          case 'clasp_create':
            return await this.handleCreate(args);
          case 'clasp_clone':
            return await this.handleClone(args);
          case 'clasp_pull':
            return await this.handlePull(args);
          case 'clasp_push':
            return await this.handlePush(args);
          case 'clasp_status':
            return await this.handleStatus(args);
          case 'clasp_open':
            return await this.handleOpen(args);
          case 'clasp_deployments':
            return await this.handleDeployments(args);
          case 'clasp_deploy':
            return await this.handleDeploy(args);
          case 'clasp_undeploy':
            return await this.handleUndeploy(args);
          case 'clasp_version':
            return await this.handleVersion(args);
          case 'clasp_versions':
            return await this.handleVersions(args);
          case 'clasp_list':
            return await this.handleList();
          case 'clasp_logs':
            return await this.handleLogs(args);
          case 'clasp_run':
            return await this.handleRun(args);
          case 'clasp_apis':
            return await this.handleApis(args);
          case 'clasp_setting':
            return await this.handleSetting(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async handleLogin(args) {
    let command = 'clasp login';
    if (args.creds) command += ` --creds ${args.creds}`;
    if (!args.global) command += ' --no-localhost';
    
    const output = await this.execClaspCommand(command);
    return {
      content: [{ type: 'text', text: output || 'Login initiated. Follow the browser prompt.' }],
    };
  }

  async handleLogout() {
    const output = await this.execClaspCommand('clasp logout');
    return {
      content: [{ type: 'text', text: output || 'Logged out successfully.' }],
    };
  }

  async handleCreate(args) {
    let command = `clasp create --title "${args.title}"`;
    if (args.type) command += ` --type ${args.type}`;
    if (args.parentId) command += ` --parentId ${args.parentId}`;
    
    const output = await this.execClaspCommand(command, { cwd: args.rootDir });
    return {
      content: [{ type: 'text', text: output }],
    };
  }

  async handleClone(args) {
    let command = `clasp clone ${args.scriptId}`;
    if (args.versionNumber) command += ` ${args.versionNumber}`;
    
    const output = await this.execClaspCommand(command, { cwd: args.rootDir });
    return {
      content: [{ type: 'text', text: output }],
    };
  }

  async handlePull(args) {
    let command = 'clasp pull';
    if (args.versionNumber) command += ` --versionNumber ${args.versionNumber}`;
    
    const output = await this.execClaspCommand(command, { cwd: args.rootDir });
    return {
      content: [{ type: 'text', text: output }],
    };
  }

  async handlePush(args) {
    let command = 'clasp push';
    if (args.watch) command += ' --watch';
    if (args.force) command += ' --force';
    
    const output = await this.execClaspCommand(command, { cwd: args.rootDir });
    return {
      content: [{ type: 'text', text: output }],
    };
  }

  async handleStatus(args) {
    let command = 'clasp status';
    if (args.json) command += ' --json';
    
    const output = await this.execClaspCommand(command, { cwd: args.rootDir });
    return {
      content: [{ type: 'text', text: output }],
    };
  }

  async handleOpen(args) {
    let command = 'clasp open';
    if (args.webapp) command += ' --webapp';
    if (args.deploymentId) command += ` --deploymentId ${args.deploymentId}`;
    
    const output = await this.execClaspCommand(command, { cwd: args.rootDir });
    return {
      content: [{ type: 'text', text: output || 'Opening in browser...' }],
    };
  }

  async handleDeployments(args) {
    const output = await this.execClaspCommand('clasp deployments', { cwd: args.rootDir });
    return {
      content: [{ type: 'text', text: output }],
    };
  }

  async handleDeploy(args) {
    let command = 'clasp deploy';
    if (args.versionNumber) command += ` --versionNumber ${args.versionNumber}`;
    if (args.description) command += ` --description "${args.description}"`;
    if (args.deploymentId) command += ` --deploymentId ${args.deploymentId}`;
    
    const output = await this.execClaspCommand(command, { cwd: args.rootDir });
    return {
      content: [{ type: 'text', text: output }],
    };
  }

  async handleUndeploy(args) {
    let command = 'clasp undeploy';
    if (args.all) {
      command += ' --all';
    } else if (args.deploymentId) {
      command += ` ${args.deploymentId}`;
    }
    
    const output = await this.execClaspCommand(command, { cwd: args.rootDir });
    return {
      content: [{ type: 'text', text: output }],
    };
  }

  async handleVersion(args) {
    let command = 'clasp version';
    if (args.description) command += ` "${args.description}"`;
    
    const output = await this.execClaspCommand(command, { cwd: args.rootDir });
    return {
      content: [{ type: 'text', text: output }],
    };
  }

  async handleVersions(args) {
    const output = await this.execClaspCommand('clasp versions', { cwd: args.rootDir });
    return {
      content: [{ type: 'text', text: output }],
    };
  }

  async handleList() {
    const output = await this.execClaspCommand('clasp list');
    return {
      content: [{ type: 'text', text: output }],
    };
  }

  async handleLogs(args) {
    let command = 'clasp logs';
    if (args.json) command += ' --json';
    if (args.open) command += ' --open';
    if (args.setup) command += ' --setup';
    if (args.watch) command += ' --watch';
    if (args.simplified) command += ' --simplified';
    
    const output = await this.execClaspCommand(command, { cwd: args.rootDir });
    return {
      content: [{ type: 'text', text: output }],
    };
  }

  async handleRun(args) {
    let command = `clasp run ${args.functionName}`;
    if (args.nondev) command += ' --nondev';
    if (args.params) command += ` --params '${args.params}'`;
    
    const output = await this.execClaspCommand(command, { cwd: args.rootDir });
    return {
      content: [{ type: 'text', text: output }],
    };
  }

  async handleApis(args) {
    let command = 'clasp apis';
    if (args.list) command += ' list';
    if (args.enable) command += ` enable ${args.enable}`;
    if (args.disable) command += ` disable ${args.disable}`;
    if (args.open) command += ' --open';
    
    const output = await this.execClaspCommand(command, { cwd: args.rootDir });
    return {
      content: [{ type: 'text', text: output }],
    };
  }

  async handleSetting(args) {
    let command = 'clasp setting';
    if (args.key && args.value) {
      command += ` ${args.key} ${args.value}`;
    } else if (args.key) {
      command += ` ${args.key}`;
    }
    
    const output = await this.execClaspCommand(command, { cwd: args.rootDir });
    return {
      content: [{ type: 'text', text: output }],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    // Setup handlers after connection is established
    this.setupToolHandlers();
    
    console.error('Clasp Enhanced MCP server running on stdio');
  }
}

const server = new ClaspEnhancedServer();
server.run().catch(console.error);
