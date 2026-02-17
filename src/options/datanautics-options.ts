interface Logger {
  log(...args: any[]): void;
  error(...args: any[]): void;
}

export type DatanauticsOptions = {
  pathToDumpFile?: string;
  storingInterval?: number;
  verbose?: boolean;
  logger?: Logger;
  writer?: boolean;
};
