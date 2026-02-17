import { readFileSync } from 'fs';
import { SEPARATOR } from '@const';

export function twoFilesDiff(sourcePath: string, targetPath: string) {
  const targetContent = readFileSync(targetPath).toString('utf8').split(SEPARATOR);
  const sourceContent = readFileSync(sourcePath).toString('utf8').split(SEPARATOR);
  const tMap = new Map();
  const ttMap = new Map();
  const sMap = new Map();
  const tsMap = new Map();
  targetContent.forEach((line) => {
    const [
      timestamp,
      key,
      ...valueArray
    ] = line.split(' ');
    if (key) {
      tMap.set(key, valueArray?.join(' ') || undefined);
      ttMap.set(key, parseInt(timestamp, 10));
    }
  });
  sourceContent.forEach((line) => {
    const [
      timestamp,
      key,
      ...valueArray
    ] = line.split(' ');
    if (key) {
      sMap.set(key, valueArray.join(' '));
      tsMap.set(key, parseInt(timestamp, 10));
    }
  });
  const tKeys = Array.from(tMap.keys());
  const sKeys = Array.from(sMap.keys());
  const remove = tKeys.filter((tKey) => !sMap.has(tKey));
  const set = sKeys.filter(
    (sKey) => !tMap.has(sKey) || (tMap.get(sKey) !== sMap.get(sKey) && tsMap.get(sKey) > ttMap.get(sKey)),
  );
  const patch: Record<string, any> = {};
  remove.forEach((key) => {
    patch[key] = undefined;
  });
  set.forEach((key) => {
    patch[key] = `${tMap.get(key)} ${sMap.get(key)}`;
  });
  return patch;
}
