module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
  ],
  env: {
    test: {
      plugins: ['transform-require-context'],
    },
  },
}
