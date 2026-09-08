export {};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

declare module '*.css' {
  const content: any;
  export default content;
}