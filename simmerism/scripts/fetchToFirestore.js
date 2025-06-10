// 📦 環境準備：需先安裝 firebase + axios + dotenv
// npm install firebase axios dotenv

import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import dotenv from 'dotenv';
dotenv.config();

// 🔑 API 金鑰與 Firebase 設定（從 .env 載入）
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
async function fetchRecipes(count = 50) {
  const url = `https://api.spoonacular.com/recipes/random?number=${count}&apiKey=${SPOONACULAR_API_KEY}`;
  const res = await axios.get(url);
  return res.data.recipes;
}

// ➕ 輔助：清除 HTML 標籤
function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

// ➕ 輔助：將 HTML <li> 拆成列點步驟
function parseInstructions(html) {
  if (!html) return [];
  const matches = html.match(/<li>(.*?)<\/li>/g);
  if (matches && matches.length > 0) {
    return matches.map((li, idx) => `Step ${idx + 1}: ${stripHtml(li)}`);
  } else {
    // 若沒有 <li> 就依標點斷句
    const sentences = stripHtml(html)
      .split(/(?<=[.!?。！？])\s+/)
      .map((s, i) => `Step ${i + 1}: ${s.trim()}`)
      .filter(Boolean);
    return sentences;
  }
}

// ➕ 輔助：解析 summary 成段落
function parseSummary(html) {
  const plain = stripHtml(html);
  const paragraphs = plain
    .split(/(?<=[.!?。！？])\s+/)
    .map(p => p.trim())
    .filter(Boolean);
  return paragraphs;
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

// 🏗️ 格式化資料（含步驟、簡介分段）
function formatRecipe(recipe) {
  return {
    title: { en: recipe.title },
    summary: { en: parseSummary(recipe.summary) },
    instructions: {
      en: parseInstructions(recipe.instructions)
    },
    ingredients: {
      en: recipe.extendedIngredients.map(i => ({
        name: i.name,
        amount: `${i.amount} ${i.unit}${i.measures?.metric?.amount ? ` (${i.measures.metric.amount}${i.measures.metric.unitShort})` : ''}`
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

// 🚀 主程式
async function run() {
  try {
    const recipes = await fetchRecipes(50);
    console.log(`🔍 共取得 ${recipes.length} 筆食譜`);

    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      const formatted = formatRecipe(recipe);
      console.log(`📄 正在處理第 ${i + 1} 筆：${formatted.title.en}`);

      try {
        if (!formatted.title?.en || !formatted.image || !formatted.instructions?.en?.length) {
          console.warn(`⚠️ 略過資料：缺少欄位`, formatted);
          continue;
        }

        const docRef = await addDoc(collection(db, 'recipes'), formatted);
        console.log(`✅ 已新增：${formatted.title.en}，ID：${docRef.id}`);
      } catch (err) {
        console.error(`❌ 寫入失敗：${formatted.title?.en || '無標題'}，錯誤：`, err.message);
        console.debug('⚠️ 詳細錯誤：', err);
      }
    }
  } catch (outerErr) {
    console.error('❌ 爬蟲流程失敗：', outerErr.message);
  }
}

run();
