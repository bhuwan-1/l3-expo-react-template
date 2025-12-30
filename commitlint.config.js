module.exports = {
  extends: ['@commitlint/config-conventional', './commitlint.extra.config'],
  rules: {
    'scope-empty': [2, 'never'],
  },
};
