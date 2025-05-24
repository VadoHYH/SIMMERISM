// simpleTest.ts - 直接寫入最簡單的資料測試
import dotenv from 'dotenv';
dotenv.config();

import { db } from '../src/lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

const simpleTestData = {
  title: "Test Recipe",
  summary: "This is a test recipe",
  translated: true,
  createdAt: new Date().toISOString(),
  favoriteCount: 0
};

const simpleTest = async () => {
  try {
    console.log('測試寫入最簡單的資料...');
    
    const recipeCollection = collection(db, 'recipes');
    await setDoc(doc(recipeCollection, 'simple-test-001'), simpleTestData);
    
    console.log('✅ 簡單測試寫入成功');
  } catch (error) {
    console.error('❌ 簡單測試寫入失敗:', error);
  }
};

simpleTest();