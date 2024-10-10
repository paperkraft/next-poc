declare global {
    interface Window {
      grecaptcha: {
        execute: (siteKey: string, options?: { action: string }) => Promise<string>;
      };
    }
  }
  
export {};
  