const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom", // 用於瀏覽器模擬，如 dom 測試
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // 讓 @ 別名能正常解析
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"], // 支援各種檔案副檔名
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(test).[tj]s?(x)"], // 找到 test 檔
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest", // 處理 TypeScript 檔案
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json", // 指定 tsconfig 路徑（如有需要）
    },
  },
}
