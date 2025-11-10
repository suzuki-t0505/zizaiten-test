import { defineConfig } from 'vite'

// const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] 
export default defineConfig({
  // base: repo ? `/${repo}/` : '/',
  base: './',
  server: {
    host: "0.0.0.0",
  }
})