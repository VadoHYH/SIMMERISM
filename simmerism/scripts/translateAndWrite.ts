import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import axios from 'axios';

// 使用 Google Translate API 翻譯文字
async function chromeTranslate(text: string, to = 'zh-TW'): Promise<string> {
  try {
    const cleanText = text
      .replace(/^(步驟\s*\d+[:：]?|第\s*[一二三四五六七八九十百千萬零〇壹貳參肆伍陸柒捌玖十]+\s*步[:：]?)\s*/gim, '')
      .replace(/\s*第\s*([一二三四五六七八九十百千萬零〇壹貳參肆伍陸柒捌玖十]+)\s*步/gi, '')
      .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
      .trim();

    if (!cleanText) return text;

    const res = await axios.get('https://translate.googleapis.com/translate_a/single', {
      params: {
        client: 'gtx', sl: 'auto', tl: to, dt: 't', q: cleanText,
      },
      timeout: 10000,
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
  instructions: MultiLangString | { en: string; zh?: string | string[] };
  dishTypes?: MultiLangString[];
  cuisines?: MultiLangString[];
  equipment?: MultiLangString[];
  diets?: MultiLangString[];
  intolerances?: MultiLangString[];
  image?: string;
  readyInMinutes?: number;
  servings?: number;
  sourceUrl?: string;
  translated?: boolean;
  createdAt?: string;
  favoriteCount?: number;
}

function cleanForFirestore(obj: any): any {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) {
    const cleaned = obj.map(cleanForFirestore).filter(item => item != null);
    return cleaned.length ? cleaned : null;
  }
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('__')) continue;
      const cleanedValue = cleanForFirestore(value);
      if (cleanedValue != null && !(typeof cleanedValue === 'string' && cleanedValue.trim() === '')) {
        cleaned[key] = cleanedValue;
      }
    }
    return Object.keys(cleaned).length ? cleaned : null;
  }
  if (typeof obj === 'string') return obj.trim() || null;
  return obj;
}

function cleanRecipeData(recipe: any): Recipe {
  const cleanMultiLangArray = (arr: any[]): MultiLangString[] => {
    if (!Array.isArray(arr)) return [];
    const uniqueItems = Array.from(new Set(
      arr.map((item: any) => typeof item === 'string' ? item : item?.en).filter(Boolean)
    ));
    return uniqueItems.map(item => ({ en: item as string }));
  };

  const cleanIngredients = Array.isArray(recipe.ingredients?.en)
    ? {
        en: recipe.ingredients.en.map((item: any) => ({
          name: { en: item.name || '' },
          amount: { en: item.amount || '' },
        })),
      }
    : { en: [] };

  return {
    id: String(recipe.id),
    title: { en: recipe.title?.en || recipe.title || '', zh: recipe.title?.zh },
    summary: {
      en: Array.isArray(recipe.summary?.en)
        ? recipe.summary.en
        : typeof recipe.summary === 'string'
        ? [recipe.summary]
        : typeof recipe.summary?.en === 'string'
        ? [recipe.summary.en]
        : [],
      zh: recipe.summary?.zh,
    },
    instructions: {
      en: Array.isArray(recipe.instructions?.en)
        ? recipe.instructions.en.join('\n')
        : typeof recipe.instructions === 'string'
        ? recipe.instructions
        : recipe.instructions?.en || '',
      zh: recipe.instructions?.zh,
    },
    ingredients: cleanIngredients,
    dishTypes: cleanMultiLangArray(recipe.dishTypes || []),
    cuisines: cleanMultiLangArray(recipe.cuisines || []),
    equipment: cleanMultiLangArray(recipe.equipment || []),
    diets: cleanMultiLangArray(recipe.diets || []),
    intolerances: cleanMultiLangArray(recipe.intolerances || []),
    image: recipe.image,
    readyInMinutes: recipe.readyInMinutes,
    servings: recipe.servings,
    sourceUrl: recipe.sourceUrl,
  };
}

function validateRecipeData(recipe: Recipe): string[] {
  const errors: string[] = [];
  if (!recipe.id) errors.push('缺少 id');
  if (!recipe.title?.en) errors.push('缺少 title.en');
  if (!recipe.summary?.en) errors.push('缺少 summary.en');
  if (!recipe.instructions?.en) errors.push('缺少 instructions.en');
  return errors;
}

export async function translateAndWriteRecipes(recipes: any[]) {
  const recipeCollection = collection(db, 'recipes');
  const result = [];

  for (const rawRecipe of recipes) {
    const recipe = cleanRecipeData(rawRecipe);
    const errors = validateRecipeData(recipe);
    if (errors.length) {
      console.warn(`⚠️ ID ${recipe.id} 發現異常欄位：\n`, errors.join('\n'));
      continue;
    }

    try {
      // 檢查是否已翻譯過
      const existingDoc = await getDoc(doc(recipeCollection, recipe.id));
      if (existingDoc.exists() && existingDoc.data()?.translated === true) {
        console.log(`⏭️ 已翻譯過，跳過: ${recipe.id}`);
        continue;
      }

      const [title_zh] = await Promise.all([
        chromeTranslate(recipe.title.en),
        chromeTranslate(recipe.summary.en),
      ]);

      const summaryParts = Array.isArray(recipe.summary.en) ? recipe.summary.en : [recipe.summary.en];
      let summary_zh: string | string[];
      if (summaryParts.length > 1) {
        const translatedParts = await Promise.all(summaryParts.map(part => chromeTranslate(part)));
        summary_zh = translatedParts;
      } else {
        const translatedSummary = await chromeTranslate(summaryParts[0]);
        summary_zh = translatedSummary;
      }

      // instructions 判斷是否 array，維持 array 翻譯
      const instructionSteps = recipe.instructions.en.split('\n').filter(step => step.trim());
      let instructions_zh: string | string[];
      if (instructionSteps.length > 1) {
        const translatedSteps = await Promise.all(instructionSteps.map(step => chromeTranslate(step)));
        instructions_zh = translatedSteps;
      } else {
        const translatedInstruction = await chromeTranslate(recipe.instructions.en);
        instructions_zh = translatedInstruction;
      }

      // 共同工具函數
      const translateList = async (list: MultiLangString[]) =>
        await Promise.all(list.map((item) => chromeTranslate(item.en)));

      const translatedRecipe: any = {
        title: { en: recipe.title.en, zh: title_zh || recipe.title.en },
        summary: { en: recipe.summary.en, zh: summary_zh || recipe.summary.en },
        instructions: { en: recipe.instructions.en, zh: instructions_zh },
        image: recipe.image,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
        sourceUrl: recipe.sourceUrl,
        translated: true,
        createdAt: new Date().toISOString(),
        favoriteCount: 0,
      };

      if (recipe.ingredients?.en?.length) {
        const names_zh = await translateList(recipe.ingredients.en.map(i => i.name));
        const amounts_zh = await translateList(recipe.ingredients.en.map(i => i.amount));

        translatedRecipe.ingredients = {
          en: recipe.ingredients.en,
          zh: recipe.ingredients.en.map((item, i) => ({
            name: { en: item.name.en, zh: names_zh[i] },
            amount: { en: item.amount.en, zh: amounts_zh[i] },
          })),
        };
      }

      const fields = ['dishTypes', 'cuisines', 'equipment', 'diets', 'intolerances'] as const;
      for (const field of fields) {
        const items = recipe[field];
        if (items?.length) {
          const translations = await translateList(items);
          translatedRecipe[field] = items.map((item, i) => ({ en: item.en, zh: translations[i] }));
        }
      }

      const cleaned = cleanForFirestore(translatedRecipe);
      await setDoc(doc(recipeCollection, recipe.id), cleaned);
      console.log(`✅ 已寫入: ${recipe.id}`);
      result.push(recipe.id);
    } catch (err) {
      console.error(`❌ 翻譯或寫入錯誤（${recipe.id}）:`, err);
    }
  }

  return result;
}
