module.exports = {
  preset: 'react-native',
  transform: {'^.+\\.[jt]sx?$': 'babel-jest'},
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|immer|react-redux)/)',
  ],
};
