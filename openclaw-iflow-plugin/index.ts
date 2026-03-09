import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface IFlowToolInput {
  action: 'analyze' | 'generate' | 'execute' | 'review' | 'chat';
  path?: string;
  prompt?: string;
  language?: string;
  command?: string;
  file?: string;
  message?: string;
}

interface IFlowToolResult {
  success: boolean;
  output?: string;
  error?: string;
}

async function runIFlow(args: string[]): Promise<{ stdout: string; stderr: string }> {
  const command = `iflow ${args.join(' ')}`;
  try {
    const result = await execAsync(command, {
      maxBuffer: 1024 * 1024 * 10,
      timeout: 120000
    });
    return result;
  } catch (error: any) {
    return {
      stdout: error.stdout || '',
      stderr: error.stderr || error.message
    };
  }
}

export async function iflow(input: IFlowToolInput): Promise<IFlowToolResult> {
  const { action, path, prompt, language, command, file, message } = input;

  try {
    switch (action) {
      case 'analyze': {
        const workPath = path || process.cwd();
        const result = await runIFlow(['--cwd', workPath, 'analyze']);
        return {
          success: !result.stderr,
          output: result.stdout || result.stderr
        };
      }

      case 'generate': {
        if (!prompt) {
          return { success: false, error: 'Missing required parameter: prompt' };
        }
        const lang = language || 'auto';
        const result = await runIFlow(['generate', '--prompt', `"${prompt}"`, '--language', lang]);
        return {
          success: !result.stderr,
          output: result.stdout || result.stderr
        };
      }

      case 'execute': {
        if (!command) {
          return { success: false, error: 'Missing required parameter: command' };
        }
        const result = await runIFlow(['exec', command]);
        return {
          success: !result.stderr,
          output: result.stdout || result.stderr
        };
      }

      case 'review': {
        if (!file) {
          return { success: false, error: 'Missing required parameter: file' };
        }
        const result = await runIFlow(['review', file]);
        return {
          success: !result.stderr,
          output: result.stdout || result.stderr
        };
      }

      case 'chat': {
        if (!message) {
          return { success: false, error: 'Missing required parameter: message' };
        }
        const result = await runIFlow(['--message', `"${message}"`]);
        return {
          success: !result.stderr,
          output: result.stdout || result.stderr
        };
      }

      default:
        return { success: false, error: `Unknown action: ${action}` };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Unknown error occurred'
    };
  }
}

export const iflowTool = {
  name: 'iflow',
  description: 'iFlow CLI 代码开发和仓库分析助手',
  input_schema: {
    type: 'object',
    properties: {
      action: {
        type: 'string',
        enum: ['analyze', 'generate', 'execute', 'review', 'chat'],
        description: '要执行的操作类型'
      },
      path: {
        type: 'string',
        description: '项目路径（用于 analyze 操作）'
      },
      prompt: {
        type: 'string',
        description: '代码生成提示（用于 generate 操作）'
      },
      language: {
        type: 'string',
        description: '编程语言（用于 generate 操作）'
      },
      command: {
        type: 'string',
        description: '要执行的命令（用于 execute 操作）'
      },
      file: {
        type: 'string',
        description: '要审查的文件路径（用于 review 操作）'
      },
      message: {
        type: 'string',
        description: '聊天消息（用于 chat 操作）'
      }
    },
    required: ['action']
  },
  handler: iflow
};

export default iflowTool;
