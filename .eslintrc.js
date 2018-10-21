// npm i -g eslint eslint-config-semistandard eslint-config-standard eslint-plugin-import eslint-plugin-node eslint-plugin-standard eslint-plugin-react eslint-plugin-promise

module.exports = {
  env: { node: true, es6: true },
  extends: 'semistandard',
  globals: {
    ArgumentsProcessor: true,
    TickProcessor: true
  },
  rules: {
    "no-lone-blocks": 0
  }
}
