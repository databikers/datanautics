import * as console from 'console';
import { resolve } from 'path';

import { DatanauticsOptions } from '@options';

export const defaultDatanauticsOptions: DatanauticsOptions = {
  verbose: true,
  logger: console,
  pathToDumpFile: resolve(__dirname, '../../data/data'),
  storingInterval: 10000,
  writer: true,
};
