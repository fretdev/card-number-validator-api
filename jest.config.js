export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "babel-jest"
  },moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  }
};