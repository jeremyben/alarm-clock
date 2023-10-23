import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

// https://electron-vite.org/config/

export default defineConfig(({ command, mode }) => {
	console.log(command, mode)

	return {
		main: {
			build: {
				outDir: './dist/main',
			},
			plugins: [externalizeDepsPlugin()],
		},
		preload: {
			build: {
				outDir: './dist/preload',
			},
			plugins: [externalizeDepsPlugin()],
		},
		renderer: {
			build: {
				outDir: './dist/renderer',
			},
			plugins: [react()],
		},
	}
})
