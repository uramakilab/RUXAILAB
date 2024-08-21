const { defineConfig } = require('cypress')
require('dotenv').config()

module.exports = defineConfig({
  projectId: 'xmf2jf',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    // add environment variables here
    ...process.env,
    url: 'http://localhost:8080',
  },
})
