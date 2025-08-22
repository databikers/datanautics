import { EventEmitter } from 'events';
import { existsSync, writeFileSync, readFileSync, watch } from 'fs';
import { PropertyAccessor } from 'property-accessor';

import { DUMP_EVENT, defaultDatanauticsOptions, falsyValues, numberRegExp, intRegExp, boolRegExp } from '@const';
import { DatanauticsOptions } from '@options';

export class Datanautics {
  protected options: DatanauticsOptions;
  protected data: Record<string, any>;
  protected eventEmitter: EventEmitter;

  constructor(options?: DatanauticsOptions) {
    this.options = { ...defaultDatanauticsOptions, ...(options || {}) };
    this.data = {};
    this.eventEmitter = new EventEmitter();
    if (existsSync(this.options.dumpPath)) {
      this.useDump();
    } else {
      writeFileSync(this.options.dumpPath, '', 'utf8');
    }
    if (options.writer) {
      this.eventEmitter.on(DUMP_EVENT, async () => {
        this.createDump();
        setTimeout(() => {
          this.eventEmitter.emit(DUMP_EVENT);
        }, this.options.dumpInterval);
      });
      this.eventEmitter.emit(DUMP_EVENT);
    } else {
      watch(this.options.dumpPath, () => {
        this.useDump();
      });
    }
  }

  public store() {
    return this.createDump();
  }

  protected createDump() {
    try {
      const flat: Record<string, string> = PropertyAccessor.flat(this.data);
      const data: any[] = [];
      for (const key in flat) {
        const value = PropertyAccessor.get(key, this.data);
        if (value || falsyValues.includes(value)) {
          data.push(`${key} ${value.toString()}`);
        }
      }
      writeFileSync(this.options.dumpPath, data.join('\n'), 'utf8');
    } catch (e) {
      if (this.options.verbose) {
        this.options.logger.error(e);
      }
    }
  }

  protected useDump() {
    const data = readFileSync(this.options.dumpPath).toString('utf8');
    const lines: string[] = data.split('\n');
    for (const line of lines) {
      const [
        k,
        ...rest
      ] = line.split(' ');
      const v = rest.join(' ');
      const key = k.trim();
      if (v !== undefined) {
        let value: any = v.trim();
        if (numberRegExp.test(value)) {
          value = intRegExp.test(value) ? BigInt(value) : parseFloat(value);
        } else if (boolRegExp.test(value)) {
          value = value === 'true';
        }
        PropertyAccessor.set(key, value, this.data);
      }
    }
  }

  public set(key: string, value: any): boolean {
    return PropertyAccessor.set(key, value, this.data);
  }

  public get(key: string): any {
    return PropertyAccessor.get(key, this.data);
  }
}
