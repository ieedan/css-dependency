import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['esm'],
	platform: 'node',
	target: 'esnext',
	outDir: 'dist',
	clean: true,
	treeshake: true,
	splitting: true,
	sourcemap: true,
	dts: true,
});
