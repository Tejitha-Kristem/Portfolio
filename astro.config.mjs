import { defineConfig } from 'astro/config';

// PREVIEW=1 builds flat .html files (used only for the shareable review link).
const preview = process.env.PREVIEW === '1';

export default defineConfig({
  build: { inlineStylesheets: 'always', format: preview ? 'file' : 'directory' },
  ...(preview ? { outDir: '../preview-dist' } : {}),
});
