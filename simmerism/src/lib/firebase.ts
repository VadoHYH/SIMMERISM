// src/lib/firebase.ts - 更強健的 Firebase 配置
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth"

// 在非 Next.js 環境中手動載入環境變數
if (typeof window === 'undefined' && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  try {
    const { config } = require('dotenv');
    const { resolve } = require('path');
    
    // 嘗試載入不同的環境檔案
    const envFiles = ['.env.local', '.env.development.local', '.env'];
    for (const envFile of envFiles) {
      config({ path: resolve(process.cwd(), envFile) });
    }
  } catch (error) {
    console.warn('⚠️ 無法載入 dotenv，請確保環境變數已正確設定');
  }
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// 檢查必要的配置是否存在
const requiredFields = ['apiKey', 'projectId', 'appId'];
const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);

if (missingFields.length > 0) {
  console.error('❌ Firebase 配置不完整:', {
    ...firebaseConfig,
    apiKey: firebaseConfig.apiKey ? '***已設定***' : '未設定',
  });
  console.error('缺失的欄位:', missingFields);
  throw new Error(`Firebase 配置不完整，缺失: ${missingFields.join(', ')}`);
}

// console.log('✅ Firebase 配置檢查通過:', {
//   apiKey: firebaseConfig.apiKey ? '***已設定***' : '未設定',
//   projectId: firebaseConfig.projectId,
//   authDomain: firebaseConfig.authDomain,
//   appId: firebaseConfig.appId ? '***已設定***' : '未設定',
// });

let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase 應用初始化成功');
} catch (error) {
  console.error('❌ Firebase 應用初始化失敗:', error);
  throw error;
}

export const db = getFirestore(app);
console.log('✅ Firestore 初始化成功');

const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()
export { auth }
export { googleProvider }