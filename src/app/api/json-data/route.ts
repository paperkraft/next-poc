import fs from 'fs-extra';
import path from 'path';

// Path to the JSON file
const jsonFilePath = path.join(process.cwd(), 'src', 'data', 'data.json');
// const jsonFilePath = path.join(process.cwd(), 'schemas', 'data.json');

// Helper to check if the file exists
const fileExists = (filePath:string) => {
    try {
        return fs.existsSync(filePath);
    } catch (err) {
        console.error('Error checking file existence', err);
        return false;
    }
};

// Read the JSON file (this will contain form metadata)
const readJsonFile = () => {
    const fileData = fs.readFileSync(jsonFilePath, 'utf-8');
    return JSON.parse(fileData);
};

// Write the updated JSON data to the file
const writeJsonFile = (data:object) => {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(jsonFilePath, jsonData, 'utf-8');
};


export async function GET() {

    if (!fileExists(jsonFilePath)) {
        return new Response(JSON.stringify({ error: 'JSON file not found' }), { status: 404 });
    }
    const formMetadata = readJsonFile();
    return new Response(JSON.stringify(formMetadata), { headers: { 'Content-Type': 'application/json' } });
}

export async function POST(req: Request) {
    try {
        const updatedMetadata = await req.json();
        writeJsonFile(updatedMetadata);
        return new Response('Form metadata updated successfully', { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to update JSON file' }), { status: 500 });
    }
}
