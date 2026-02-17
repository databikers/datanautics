import { createReadStream, createWriteStream } from 'fs';
import { promises as fs } from 'fs';

export async function compactFile(filePath: string) {
  const latest = new Map<string, { timestamp: number; line: string }>();
  const reader = createReadStream(filePath, { encoding: 'utf8' });
  let leftover = '';
  await new Promise<void>((resolve, reject) => {
    reader.on('data', chunk => {
      const data = leftover + chunk;
      const lines = data.split('\n');
      leftover = lines.pop() ?? '';

      for (const line of lines) {
        processLine(line);
      }
    });
    reader.on('end', () => {
      if (leftover) processLine(leftover);
      resolve();
    });
    reader.on('error', reject);
  });

  function processLine(line: string) {
    if (!line.trim()) {
      return;
    }
    const firstSpace = line.indexOf(' ');
    if (firstSpace === -1) {
      return;
    }
    const timestamp = Number(line.slice(0, firstSpace));
    const rest = line.slice(firstSpace + 1);
    const secondSpace = rest.indexOf(' ');
    if (secondSpace === -1) {
      return;
    }
    const key = rest.slice(0, secondSpace);
    const existing = latest.get(key);
    if (!existing || timestamp > existing.timestamp) {
      latest.set(key, { timestamp, line });
    }
  }
  const tempPath = filePath + '.tmp';
  const writer = createWriteStream(tempPath, { flags: 'w' });
  for (const { line } of latest.values()) {
    writer.write(line + '\n');
  }
  await new Promise<void>((resolve, reject) => {
    writer.end(resolve);
    writer.on('error', reject);
  });
  await fs.rename(tempPath, filePath);
}
