import { readFileSync, writeFileSync } from 'fs';
import { SEPARATOR } from '@const';

export function normalizeDump(targetPath: string) {
  const targetContent = readFileSync(targetPath).toString('utf8').split(SEPARATOR);
  const normalizedLines: string[] = [];
  targetContent.forEach((line) => {
    if (line) {
      /^\d{13}\s/.test(line) ? normalizedLines.push(line) : normalizedLines.push(`${Date.now()} ${line}`);
    }
  });
  writeFileSync(targetPath, normalizedLines.join('\n'), 'utf8');
}
