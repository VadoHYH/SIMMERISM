//src/lib/translateAndWrite.ts
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import axios from 'axios';

async function chromeTranslate(text: string, to = 'zh-TW'): Promise<string> {
  try {
    // 清理輸入文字
    const cleanText = text.replace(/[\x00-\x1F\x7F-\x9F]/g, '').trim();
    if (!cleanText) return text;
    
    const res = await axios.get('https://translate.googleapis.com/translate_a/single', {
      params: {
        client: 'gtx',
        sl: 'auto',
        tl: to,
        dt: 't',
        q: cleanText,
      },
      timeout: 10000, // 10秒超時
    });
    
    const translated = res.data[0].map((item: [string]) => item[0]).join('');
    return translated || text;
  } catch (err) {
    console.error('翻譯錯誤:', err);
    return text;
  }
}

interface MultiLangString {
  en: string;
  zh?: string;
}

interface IngredientObject {
  name: MultiLangString;
  amount: MultiLangString;
}

interface Recipe {
  id: string;
  title: MultiLangString;
  summary: MultiLangString;
  ingredients?: {
    en: IngredientObject[];
    zh?: IngredientObject[];
  };
  instructions: MultiLangString;
  dishTypes?: MultiLangString[];
  cuisines?: MultiLangString[];
  equipment?: MultiLangString[];
  diets?: MultiLangString[];
  intolerances?: MultiLangString[];
  
  // 其他欄位
  image?: string;
  readyInMinutes?: number;
  servings?: number;
  sourceUrl?: string;
  translated?: boolean;
  createdAt?: string;
  favoriteCount?: number;
}

// 清理資料以符合 Firestore 要求
function cleanForFirestore(obj: any): any {
  if (obj === null || obj === undefined) {
    return null;
  }
  
  if (Array.isArray(obj)) {
    const cleaned = obj
      .map(item => cleanForFirestore(item))
      .filter(item => item !== null && item !== undefined);
    return cleaned.length > 0 ? cleaned : null;
  }
  
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      // 跳過 Firestore 保留字段
      if (key.startsWith('__')) continue;
      
      const cleanedValue = cleanForFirestore(value);
      if (cleanedValue !== null && cleanedValue !== undefined) {
        // 確保字串不是空的
        if (typeof cleanedValue === 'string' && cleanedValue.trim() === '') {
          continue;
        }
        cleaned[key] = cleanedValue;
      }
    }
    return Object.keys(cleaned).length > 0 ? cleaned : null;
  }
  
  if (typeof obj === 'string') {
    return obj.trim() || null;
  }
  
  return obj;
}

// 清理和正規化資料的函數
function cleanRecipeData(recipe: any): Recipe {
  // 清理函數：將各種格式統一為 MultiLangString
  const cleanMultiLangArray = (arr: any[]): MultiLangString[] => {
    if (!Array.isArray(arr)) return [];
    
    const uniqueItems = Array.from(new Set(
      arr.map((item: any) => {
        if (typeof item === 'string') return item;
        if (item && typeof item.en === 'string') return item.en;
        return null;
      }).filter(Boolean)
    ));
    
    return uniqueItems.map(item => ({ en: item as string }));
  };

  // 移除重複的 equipment 項目
  const cleanEquipment = cleanMultiLangArray(recipe.equipment || []);

  // 移除重複的 cuisines 項目  
  const cleanCuisines = cleanMultiLangArray(recipe.cuisines || []);
  
  // 清理其他陣列欄位
  const cleanIngredients = Array.isArray(recipe.ingredients?.en)
  ? {
      en: recipe.ingredients.en.map((item: any) => ({
        name: { en: item.name || '' },
        amount: { en: item.amount || '' },
      })),
    }
  : { en: [] };
  const cleanDishTypes = cleanMultiLangArray(recipe.dishTypes || []);
  const cleanDiets = cleanMultiLangArray(recipe.diets || []);
  const cleanIntolerances = cleanMultiLangArray(recipe.intolerances || []);

  // 確保 title 和 summary 格式正確
  const cleanTitle: MultiLangString = {
    en: recipe.title?.en || recipe.title || '',
    ...(recipe.title?.zh && { zh: recipe.title.zh })
  };

  const cleanSummary: MultiLangString = {
    en: recipe.summary?.en || recipe.summary || '',
    ...(recipe.summary?.zh && { zh: recipe.summary.zh })
  };

  const cleanInstructions: MultiLangString = {
    en: Array.isArray(recipe.instructions?.en)
      ? recipe.instructions.en.join('\n')
      : typeof recipe.instructions === 'string'
      ? recipe.instructions
      : recipe.instructions?.en || '',
    zh: recipe.instructions?.zh
  };

  return {
    id: String(recipe.id),
    title: cleanTitle,
    summary: cleanSummary,
    ingredients: cleanIngredients,
    instructions: cleanInstructions,
    dishTypes: cleanDishTypes,
    cuisines: cleanCuisines,
    equipment: cleanEquipment,
    diets: cleanDiets,
    intolerances: cleanIntolerances,
    image: recipe.image,
    readyInMinutes: recipe.readyInMinutes,
    servings: recipe.servings,
    sourceUrl: recipe.sourceUrl,
  };
}

export async function translateAndWriteRecipes(recipes: any[]) {
  const recipeCollection = collection(db, 'recipes');
  const existingSnapshot = await getDocs(recipeCollection);

  const existingIds = new Set<string>();
  existingSnapshot.forEach(doc => {
    existingIds.add(doc.id);
  });

  const translatedResults = [];

  for (const rawRecipe of recipes) {
    // if (existingIds.has(rawRecipe.id.toString())) {
    //   console.log(`略過重複 ID: ${rawRecipe.id}`);
    //   continue;
    // }

    // 先清理資料
    const recipe = cleanRecipeData(rawRecipe);

    const errors = validateRecipeData(recipe);
    if (errors.length > 0) {
      console.warn(`⚠️ ID ${recipe.id} 發現異常欄位：\n`, errors.join('\n'));
      console.log('🚀 instructions:', recipe.instructions);
      continue;
    }

    try {
      const [title_zh, summary_zh, instructions_zh] = await Promise.all([
        chromeTranslate(recipe.title.en),
        chromeTranslate(recipe.summary.en),
        chromeTranslate(recipe.instructions.en),
      ]);

      

      const ingredientNames_zh = await Promise.all(
        (recipe.ingredients?.en || []).map((item) => chromeTranslate(item.name.en))
      );
      
      const ingredientAmounts_zh = await Promise.all(
        (recipe.ingredients?.en || []).map((item) => chromeTranslate(item.amount.en))
      );

      const dishTypes_zh = await Promise.all(
        (recipe.dishTypes || []).map((item) => chromeTranslate(item.en))
      );

      const cuisines_zh = await Promise.all(
        (recipe.cuisines || []).map((item) => chromeTranslate(item.en))
      );

      const equipment_zh = await Promise.all(
        (recipe.equipment || []).map((item) => chromeTranslate(item.en))
      );

      const diets_zh = await Promise.all(
        (recipe.diets || []).map((item) => chromeTranslate(item.en))
      );

      const intolerances_zh = await Promise.all(
        (recipe.intolerances || []).map((item) => chromeTranslate(item.en))
      );

      // 建立翻譯後的資料，只包含必要欄位
      const translatedRecipe: any = {
        title: { en: recipe.title.en, zh: title_zh },
        summary: { en: recipe.summary.en, zh: summary_zh },
        instructions: { en: recipe.instructions.en, zh: instructions_zh },
        translated: true,
        createdAt: new Date().toISOString(),
        favoriteCount: 0,
      };

      // 只有當欄位存在且不為空時才加入
      if (recipe.ingredients?.en && recipe.ingredients.en.length > 0) {
        translatedRecipe.ingredients = {
          en: recipe.ingredients.en,
          zh: recipe.ingredients.en.map((item, idx) => ({
            name: { en: item.name.en, zh: ingredientNames_zh[idx] },
            amount: { en: item.amount.en, zh: ingredientAmounts_zh[idx] },
          })),
        };
      }

      
      translatedRecipe.title = {
        en: recipe.title.en,
        zh: title_zh || recipe.title.en,
      };
      
      translatedRecipe.summary = {
        en: recipe.summary.en,
        zh: summary_zh || recipe.summary.en,
      };
      
      translatedRecipe.instructions = {
        en: recipe.instructions?.en || "",
        zh: instructions_zh || recipe.instructions?.en || "",
      };

      if (recipe.dishTypes && recipe.dishTypes.length > 0) {
        translatedRecipe.dishTypes = recipe.dishTypes.map((item, idx) => ({
          en: item.en,
          zh: dishTypes_zh[idx],
        }));
      }

      if (recipe.cuisines && recipe.cuisines.length > 0) {
        translatedRecipe.cuisines = recipe.cuisines.map((item, idx) => ({
          en: item.en,
          zh: cuisines_zh[idx],
        }));
      }

      if (recipe.equipment && recipe.equipment.length > 0) {
        translatedRecipe.equipment = recipe.equipment.map((item, idx) => ({
          en: item.en,
          zh: equipment_zh[idx],
        }));
      }

      if (recipe.diets && recipe.diets.length > 0) {
        translatedRecipe.diets = recipe.diets.map((item, idx) => ({
          en: item.en,
          zh: diets_zh[idx],
        }));
      }

      if (recipe.intolerances && recipe.intolerances.length > 0) {
        translatedRecipe.intolerances = recipe.intolerances.map((item, idx) => ({
          en: item.en,
          zh: intolerances_zh[idx],
        }));
      }

      // 其他簡單欄位 - 過濾掉可能有問題的值
      if (recipe.image && typeof recipe.image === 'string') {
        translatedRecipe.image = recipe.image;
      }
      if (recipe.readyInMinutes && typeof recipe.readyInMinutes === 'number' && recipe.readyInMinutes > 0) {
        translatedRecipe.readyInMinutes = recipe.readyInMinutes;
      }
      if (recipe.servings && typeof recipe.servings === 'number' && recipe.servings > 0) {
        translatedRecipe.servings = recipe.servings;
      }
      if (recipe.sourceUrl && typeof recipe.sourceUrl === 'string') {
        translatedRecipe.sourceUrl = recipe.sourceUrl;
      }

      // 清理資料 - 移除 undefined, null, 空字串等
      const cleanedRecipe = cleanForFirestore(translatedRecipe);

      console.log(`正在寫入 ID: ${recipe.id}`);
      // console.log('資料預覽:', JSON.stringify(cleanedRecipe, null, 2).substring(0, 500) + '...');
      console.log('🚀 instructions:', translatedRecipe.instructions);
      await setDoc(doc(recipeCollection, recipe.id.toString()), cleanedRecipe);
      console.log(`✅ 寫入成功 ID: ${recipe.id}`);
      translatedResults.push(cleanedRecipe);

      // 加入延遲避免 API 限制
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (err) {
      console.error(`❌ 翻譯或寫入失敗 ID: ${recipe.id}`, err);
    }
  }

  return translatedResults;
}

function validateRecipeData(recipe: Recipe): string[] {
  const errors: string[] = [];

  const checkMultiLangField = (fieldName: string, field?: MultiLangString) => {
    if (!field) {
      errors.push(`${fieldName} 欄位缺失`);
      return;
    }
    if (typeof field.en !== 'string' || field.en.trim() === '') {
      errors.push(`${fieldName}.en 為空或格式錯誤`);
    }
    if (field.zh !== undefined && typeof field.zh !== 'string') {
      errors.push(`${fieldName}.zh 格式錯誤`);
    }
  };

  const checkMultiLangArray = (fieldName: string, field?: MultiLangString[]) => {
    if (!field) return; // 允許空值
    
    if (!Array.isArray(field)) {
      errors.push(`${fieldName} 不是陣列`);
      return;
    }
    
    field.forEach((item, index) => {
      if (!item) {
        errors.push(`${fieldName}[${index}] 為空`);
        return;
      }
      if (typeof item.en !== 'string' || item.en.trim() === '') {
        errors.push(`${fieldName}[${index}].en 為空或格式錯誤`);
      }
      if (item.zh !== undefined && typeof item.zh !== 'string') {
        errors.push(`${fieldName}[${index}].zh 格式錯誤`);
      }
    });
  };

  // 檢查必要欄位
  if (typeof recipe.id !== 'string' || recipe.id.trim() === '') {
    errors.push('id 欄位為空或格式錯誤');
  }

  checkMultiLangField('title', recipe.title);
  checkMultiLangField('summary', recipe.summary);
  checkMultiLangField('instructions', recipe.instructions)
  
  // // 檢查可選欄位
  // if (recipe.instructions) {
  //   checkMultiLangField('instructions', recipe.instructions);
  // }

  
  checkMultiLangArray('dishTypes', recipe.dishTypes);
  checkMultiLangArray('cuisines', recipe.cuisines);
  checkMultiLangArray('equipment', recipe.equipment);
  checkMultiLangArray('diets', recipe.diets);
  checkMultiLangArray('intolerances', recipe.intolerances);

  return errors;
}