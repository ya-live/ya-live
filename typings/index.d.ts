type CSSModule = Record<string, string>;

declare module '*.css' {
  const value: CSSModule;
  export = value;
}
