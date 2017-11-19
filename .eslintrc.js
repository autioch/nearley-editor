module.exports = {
  'extends': 'qb',
  parser: 'babel-eslint',
  rules: {
    'id-blacklist': ['off'],
    'id-length': ['off']
  },
  ecmaFeatures: {
    classes: true,
    jsx: true
  },
  plugins: [
    'react'
  ]
};
