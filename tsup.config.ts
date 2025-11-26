import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm"],
	dts: true,
	minify: true,
	sourcemap: true,
	clean: true,
	external: [],
	treeshake: true,
	outDir: "dist",
	splitting: false,
});
