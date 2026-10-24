import { initializeApp } from 'firebase/app';
import { collection, doc, getDoc, onSnapshot, setDoc, updateDoc, deleteDoc, Timestamp, terminate, getFirestore } from 'firebase/firestore';
import { existsSync, readFileSync } from 'node:fs';
if (existsSync('.env')) process.loadEnvFile('.env');
const publicConfig = JSON.parse(readFileSync(new URL('../config/firebase.public.json', import.meta.url), 'utf8'));
const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || publicConfig.projectId;
if (!projectId) throw new Error('Set the Firebase project values in .env first.');
const app = initializeApp({ projectId, apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || publicConfig.apiKey, appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || publicConfig.appId });
const db = getFirestore(app);
const tasks = [
  ['sample-lab07', { name: 'Finish mobile app lab', assignedTo: 'Dion', completed: false, dueDate: Timestamp.fromDate(new Date('2026-10-26T17:00:00+03:00')), dateAdded: Timestamp.fromDate(new Date('2026-10-24T12:00:00+03:00')) }],
  ['sample-reading', { name: 'Read Firestore documentation', assignedTo: 'Dion', completed: false, dueDate: Timestamp.fromDate(new Date('2026-10-25T17:00:00+03:00')), dateAdded: Timestamp.fromDate(new Date('2026-10-24T12:00:00+03:00')) }],
];
// Seed deterministic IDs once so rerunning this script never duplicates the samples.
for (const [id, data] of tasks) {
  const ref = doc(db, 'tasks', id);
  if (!(await getDoc(ref)).exists()) await setDoc(ref, data);
}
console.log('Two sample task documents are present with Firestore Timestamp fields.');
if (process.argv.includes('--verify')) {
  const ref = doc(collection(db, 'tasks'));
  let unsubscribe;
  // Wait for a real snapshot to confirm remote updates reach a subscribed client.
  const completionObserved = new Promise(function waitForCompletion(resolve, reject) {
    unsubscribe = onSnapshot(ref, function observe(snapshot) {
      if (snapshot.exists() && snapshot.data().completed === true) resolve(true);
    }, reject);
  });
  try {
    await setDoc(ref, { ...tasks[0][1], name: 'Integration verification task' });
    const created = await getDoc(ref);
    if (!(created.data().dueDate instanceof Timestamp) || !(created.data().dateAdded instanceof Timestamp)) throw new Error('Timestamp round trip failed.');
    console.log('PASS create/read + timestamp round trip');
    await updateDoc(ref, { name: 'Updated verification task', completed: true });
    const updated = await getDoc(ref);
    if (updated.data().name !== 'Updated verification task' || !updated.data().completed) throw new Error('Update failed.');
    console.log('PASS edit + completion');
    let timeout;
    // Bound the listener check so a network failure cannot hang verification forever.
    await Promise.race([completionObserved, new Promise(function boundWait(_resolve, reject) { timeout = setTimeout(function timedOut() { reject(new Error('Snapshot timeout')); }, 15000); })]).finally(function clearWait() { clearTimeout(timeout); });
    console.log('PASS real-time snapshot listener');
    await deleteDoc(ref);
    if ((await getDoc(ref)).exists()) throw new Error('Delete failed.');
    console.log('PASS delete');
  } finally {
    unsubscribe?.();
    // Only remove this run\'s disposable verification document.
    await deleteDoc(ref);
  }
}
await terminate(db);
