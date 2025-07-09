// src/lib/firebase.ts - 更強健的 Firebase 配置
import { initializeApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth"

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
  console.error('Firebase 配置不完整:', {
    ...firebaseConfig,
    apiKey: firebaseConfig.apiKey ? '***已設定***' : '未設定',
  });
  console.error('缺失的欄位:', missingFields);
  throw new Error(`Firebase 配置不完整，缺失: ${missingFields.join(', ')}`);
}


let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  if (error instanceof Error) {
    console.error('Firebase 應用初始化失敗:', error.message);
  } else {
    console.error('Firebase 應用初始化失敗:', error);
  }
  throw error;
}

export const db: Firestore = getFirestore(app);


const auth: Auth = getAuth(app)
const googleProvider: GoogleAuthProvider = new GoogleAuthProvider()
export { auth }
export { googleProvider }