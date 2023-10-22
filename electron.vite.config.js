import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

// https://electron-vite.org/config/

export default defineConfig(({ command, mode }) => {
	const building = command === 'build'
	const serving = command === 'serve'

	console.log(command, mode)

	return {
		main: {
			build: {
				outDir: './dist/main',
				lib: { entry: './src/main/main.ts' },
				watch: serving && {},
				minify: building,
			},
			plugins: [externalizeDepsPlugin()],
		},
		preload: {
			build: {
				outDir: './dist/preload',
				lib: { entry: './src/preload/preload.ts' },
				watch: serving && {},
				minify: building,
			},
			plugins: [externalizeDepsPlugin()],
		},
		renderer: {
			resolve: {
				alias: {
					'@renderer': resolve('src/renderer/src'),
				},
			},
			build: {
				outDir: './dist/renderer',
				lib: { entry: './src/renderer/index.html' },
				watch: serving && {},
				minify: building,
			},
			plugins: [react()],
		},
	}
})
