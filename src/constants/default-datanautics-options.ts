import * as console from 'console';
import { resolve } from 'path';

import { DatanauticsOptions } from '@options';
import { DEFAULT_DUMP_INTERVAL } from './interval';

export const defaultDatanauticsOptions: DatanauticsOptions = {
  dumpInterval: DEFAULT_DUMP_INTERVAL,
  verbose: true,
  logger: console,
  dumpPath: resolve(__dirname, '../../data/data'),
  writer: true,
};
