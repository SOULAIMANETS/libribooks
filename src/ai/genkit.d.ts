declare module 'genkit' {
  export function genkit(config?: any): any;
  export function definePrompt(config: any): any;
  export function defineFlow(config: any, handler: any): any;
  export const z: any;
}

declare module '@genkit-ai/googleai' {
  export function googleAI(config?: any): any;
}