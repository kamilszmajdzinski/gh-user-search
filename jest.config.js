export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.app.json",
    },
  },
  transformIgnorePatterns: ["/node_modules/(?!@tanstack/react-query)"],
};
