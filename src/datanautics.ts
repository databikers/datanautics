import { existsSync, writeFileSync, watch, createWriteStream, WriteStream } from 'fs';
import { PropertyAccessor } from 'property-accessor';

import { defaultDatanauticsOptions, numberRegExp, intRegExp, boolRegExp, objRegEx, objExtractRegEx } from '@const';
import { DatanauticsOptions } from '@options';
import { processFileByLine, serializeValue } from '@helper';


export class Datanautics {
  protected options: DatanauticsOptions;
  protected data: Record<string, any>;
  protected lines: Map<string, string>;

  constructor(options?: DatanauticsOptions) {
    this.options = { ...defaultDatanauticsOptions, ...(options || {}) };
    this.data = {};
    this.lines = new Map<string, string>();
    if (!existsSync(this.options.pathToDumpFile)) {
      writeFileSync(this.options.pathToDumpFile, '', 'utf8');
    }
  }

  public async init() {
    await this.restore();
    if (!this.options.writer) {
      watch(this.options.pathToDumpFile, async () => {
        await this.restore();
      });
    }
  }

  public async store() {
    const stream: WriteStream = createWriteStream(this.options.pathToDumpFile,{
      flags: 'w',
      encoding: 'utf8',
      autoClose: true
    });
    const lines = this.lines.values();
    for (const line of lines) {
      if (!stream.write(line)) {
        await new Promise(resolve => stream.once('drain', () => resolve(true)));
      }
    }
    await new Promise(resolve => stream.end(resolve));
  }

  protected async restore() {
    await processFileByLine(this.options.pathToDumpFile, (line: string) => {
      if (!line) {
        return;
      }
      const lineData: string[] = line.split(' ');
      let k: string;
      let rest: any;
      if (lineData.length > 2) {
        [
          ,
          k,
          ...rest
        ] = lineData;
      } else {
        [
          k,
          ...rest
        ] = lineData;
      }
      const key = k.trim().replace(/␣/g, ' ');
      const v = rest.join(' ');
      if (key && v !== undefined) {
        let value: any = v.trim();
        if (numberRegExp.test(value)) {
          if (intRegExp.test(value)) {
            const valueInt: number = Number.parseInt(value, 10);
            if (!Number.isSafeInteger(valueInt)) {
              value = BigInt(value);
            } else {
              value = valueInt;
            }
          } else {
            value = parseFloat(value);
          }
        } else if (boolRegExp.test(value)) {
          value = value === 'true';
        } else if (objRegEx.test(value)) {
          try {
            value = JSON.parse(value.replace(objExtractRegEx, ''));
          } catch (e) {
            value = value.toString();
          }
        }
        PropertyAccessor.set(key, value, this.data);
      } else {
        PropertyAccessor.delete(key, this.data);
      }
      this.storeKeyValue(k, v);
    });
  }

  public set(key: string, value: any): boolean {
    const result: boolean = PropertyAccessor.set(key, value, this.data);
    if (this.options.writer) {
      this.storeKeyValue(key, value);
    }
    return result;
  }

  private storeKeyValue(key: string, value: any) {
    const now = Date.now();
    const keys: string[] = PropertyAccessor.collectKeys(key, value);
    for (const k of keys) {
      const nk: string = k.replace(/\s/g, '␣');
      const v = PropertyAccessor.get(k, this.data);
      this.lines.set(k, `${now} ${nk} ${serializeValue(v)}\n`);
    }
  }

  public get(key: string): any {
    return PropertyAccessor.get(key, this.data);
  }
}
