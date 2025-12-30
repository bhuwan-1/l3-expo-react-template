// add the scopes here otherwise husky wont allow you to commit.
const scopes = ['dev-infra', 'ui-kit'];

module.exports = {
  rules: {
    'scope-enum': [2, 'always', [...scopes]],
  },
};
