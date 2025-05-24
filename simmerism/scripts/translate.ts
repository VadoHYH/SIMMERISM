// translate.ts
import dotenv from 'dotenv';
import path from 'path';
import * as fs from 'fs';

dotenv.config();

if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  throw new Error("❌ 缺少 Firebase API 金鑰，請確認 .env 已正確載入！");
}

console.log("✅ Firebase API Key:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log("✅ Firebase PROJECT ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

import { translateAndWriteRecipes } from '../src/lib/translateAndWrite';

const run = async () => {
  try {
    // 確認當前工作目錄
    console.log("當前工作目錄:", process.cwd());
    
    // 嘗試不同的路徑
    const possiblePaths = [
      './recipes_export.json',
      './scripts/recipes_export.json',
      '../recipes_export.json',
      path.join(process.cwd(), 'recipes_export.json'),
      path.join(process.cwd(), 'scripts', 'recipes_export.json')
    ];

    let jsonFilePath = '';
    let recipeData = null;

    // 找到正確的文件路徑
    for (const filePath of possiblePaths) {
      try {
        if (fs.existsSync(filePath)) {
          console.log(`✅ 找到文件: ${filePath}`);
          jsonFilePath = filePath;
          recipeData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          break;
        } else {
          console.log(`❌ 文件不存在: ${filePath}`);
        }
      } catch (err) {
        console.log(`❌ 讀取文件失敗 ${filePath}:`, err);
      }
    }

    if (!recipeData) {
      console.error('❌ 找不到 recipes_export.json 文件！');
      console.log('請確認文件是否存在於以下任一位置：');
      possiblePaths.forEach(p => console.log(`  - ${p}`));
      return;
    }

    console.log(`📁 使用文件: ${jsonFilePath}`);
    console.log(`📊 找到 ${Array.isArray(recipeData) ? recipeData.length : '未知數量'} 筆資料`);

    const result = await translateAndWriteRecipes(recipeData);
    console.log(`✅ 共寫入 ${result.length} 筆翻譯資料`);
    
  } catch (error) {
    console.error('❌ 執行失敗:', error);
  }
};

run();