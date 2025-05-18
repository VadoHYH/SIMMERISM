import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

const SPOONACULAR_API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

console.log('✅ 環境變數檢查：', SPOONACULAR_API_KEY, FIREBASE_CONFIG);
console.log('Firebase Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY);