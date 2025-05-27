// 📦 環境準備：需先安裝 firebase + axios
// npm install firebase axios dotenv

import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import dotenv from 'dotenv';
dotenv.config();

// 🔑 Spoonacular API Key & Firebase config from .env
const SPOONACULAR_API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

// 🔥 初始化 Firebase
const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

// 🧪 取得食譜資料（一次 1~50 筆）
async function fetchRecipes(count = 23) {
  const url = `https://api.spoonacular.com/recipes/random?number=${count}&apiKey=${SPOONACULAR_API_KEY}`;
  const res = await axios.get(url);
  return res.data.recipes;
}

// ➕ 輔助：清除 HTML 標籤
function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

// ➕ 輔助：將 HTML <li> 拆成列點
function parseInstructions(html) {
  const matches = html.match(/<li>(.*?)<\/li>/g);
  if (!matches) return [];
  return matches.map((li, idx) => `Step ${idx + 1}: ${stripHtml(li)}`);
}

// 🏗️ 格式化資料，取出中英文結構
function formatRecipe(recipe) {
  return {
    title: { en: recipe.title },
    summary: { en: stripHtml(recipe.summary) },
    instructions: { 
      en: parseInstructions(recipe.instructions).length > 0 
        ? parseInstructions(recipe.instructions)
        : [stripHtml(recipe.instructions)] // 如果沒 <li> 就用整段清乾淨
    },
    ingredients: {
      en: recipe.extendedIngredients.map(i => ({
        name: i.name,
        amount: `${i.amount} ${i.unit}${i.measures?.metric?.amount ? `(${i.measures.metric.amount}${i.measures.metric.unitShort})` : ''}`
      }))
    },
    image: recipe.image,
    readyInMinutes: recipe.readyInMinutes,
    servings: recipe.servings,
    diets: recipe.diets.map(d => ({ en: d })),
    dishTypes: recipe.dishTypes.map(t => ({ en: t })),
    cuisines: recipe.cuisines.map(c => ({ en: c })),
    equipment: extractEquipment(recipe.analyzedInstructions),
    sourceUrl: recipe.sourceUrl
  };
}

// 🔍 萃取設備（從 analyzedInstructions 中找）
function extractEquipment(instructions) {
  const equipmentSet = new Set();
  if (!instructions || !Array.isArray(instructions)) return [];
  instructions.forEach(instr => {
    instr.steps?.forEach(step => {
      step.equipment?.forEach(eq => equipmentSet.add(eq.name));
    });
  });
  return Array.from(equipmentSet).map(e => ({ en: e }));
}

// 🚀 主程式（含更多錯誤偵錯資訊）
async function run() {
  try {
    const recipes = await fetchRecipes(23); // ⬅️ 可改抓多筆
    console.log(`🔍 共取得 ${recipes.length} 筆食譜`);

    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      const formatted = formatRecipe(recipe);
      console.log(`📄 正在處理第 ${i + 1} 筆：${formatted.title.en}`);

      try {
        // 先檢查是否有不合法的欄位（可自行補充條件）
        if (!formatted.title?.en || !formatted.image || !formatted.instructions) {
          console.warn(`⚠️ 資料缺少關鍵欄位，略過此筆：`, formatted);
          continue;
        }

        // 寫入 Firestore
        const docRef = await addDoc(collection(db, 'recipes'), formatted);
        console.log(`✅ 已新增食譜：${formatted.title.en}，ID：${docRef.id}`);
      } catch (err) {
        console.error(`❌ 新增失敗：${formatted.title?.en || '無標題'}，錯誤：`, err.message);
        console.debug('⚠️ 錯誤詳細資料：', err);
      }
    }
  } catch (outerErr) {
    console.error('❌ 整體流程失敗：', outerErr.message);
  }
}

run();
