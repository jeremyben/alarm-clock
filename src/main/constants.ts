import path from 'path'

export const PRELOAD_PATH = path.join(__dirname, '..', 'preload', 'preload.js')
export const RENDERER_PATH = path.join(__dirname, '..', 'renderer', 'index.html')
export const RENDERER_HMR_URL = process.env['ELECTRON_RENDERER_URL']
