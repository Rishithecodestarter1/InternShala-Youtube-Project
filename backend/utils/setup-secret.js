import { info, warn } from './colorLog.js'

info('Run this command from the project root to create or replace your JWT secret:')
info('npm run secret:generate')
warn('After it runs, keep backend/.env private. Do not commit it to GitHub.')
