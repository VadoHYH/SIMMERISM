import fs from 'fs';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = JSON.parse(fs.readFileSync('./serviceAccountKey.json', 'utf8'));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function exportData() {
  const snapshot = await db.collection('recipes').get();
  const data = [];

  snapshot.forEach(doc => {
    data.push({
      id: doc.id,
      ...doc.data()
    });
  });

  fs.writeFileSync('recipes_export.json', JSON.stringify(data, null, 2));
  console.log('✅ 匯出完成：recipes_export.json');
}

exportData();
