import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

// Define paths for logging and script
const LOG_FILE = path.join(process.cwd(), 'logs', 'execution-log.txt');
const SCRIPT_PATH = path.join(process.cwd(), 'public', 'device-info.ps1');

// Ensure the logs directory exists
if (!fs.existsSync(path.dirname(LOG_FILE))) {
    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
}

// Helper function to log messages
function logMessage(message: string) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`);
}

// Helper function to parse PowerShell output into JSON
function parseOutput(output: string) {
    const lines = output.trim().split('\n');
    const result: Record<string, string> = {};

    lines.forEach((line) => {
        const [key, value] = line.split(':').map((part) => part.trim());
        if (key && value) {
            result[key] = value;
        }
    });

    return result;
}

// Helper function to execute a script
function executeScript(command: string): Promise<Record<string, string>> {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                return reject(`Error executing script: ${error.message}`);
            }
            if (stderr) {
                return reject(`Script error: ${stderr}`);
            }
            // resolve(stdout.trim());
            const parsedOutput = parseOutput(stdout.trim());
            resolve(parsedOutput);
        });
    });
}

// API Route Handler
export async function GET() {
    logMessage('Received request for device info.');

    // Determine the platform and select the appropriate script
    const platform = process.platform; // 'win32', 'linux', or 'darwin'
    let command: string;

    if (platform === 'win32') {
        // For Windows, use a PowerShell script
        const scriptPath = path.join(process.cwd(), 'public', 'device-info.ps1');
        command = `powershell -ExecutionPolicy Bypass -File "${scriptPath}"`;
    } else if (platform === 'linux') {
        // For Linux, use a shell script
        const scriptPath = path.join(process.cwd(), 'public', 'device-info-linux.sh');
        command = `bash "${scriptPath}"`;
    } else if (platform === 'darwin') {
        // For macOS, use a shell script
        const scriptPath = path.join(process.cwd(), 'public', 'device-info-mac.sh');
        command = `bash "${scriptPath}"`;
    } else {
        const errorMessage = `Unsupported platform: ${platform}`;
        logMessage(errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    try {
        // Execute the selected script
        const output = await executeScript(command);

        // Log and return the output
        logMessage(`Script executed successfully on ${platform}. Output: ${JSON.stringify(output)}`);
        return NextResponse.json({ platform, output });
    } catch (error: any) {
        // Log and return the error
        logMessage(`Error: ${error}`);
        return NextResponse.json({ error }, { status: 500 });
    }
}
