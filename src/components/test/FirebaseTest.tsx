import { useEffect, useState } from 'react';
import { app, auth, db } from '../../firebase';
import { getFirestore, collection, getDocs, FirestoreError } from 'firebase/firestore';

const FirebaseTest = () => {
  const [firebaseStatus, setFirebaseStatus] = useState({
    app: false,
    auth: false,
    firestore: false,
    collections: [] as string[],
    error: ''
  });

  useEffect(() => {
    const testFirebase = async () => {
      try {
        // Test Firebase App
        const appName = app.name;
        
        // Test Auth
        const authUser = auth.currentUser;
        
        // Test Firestore
        const db = getFirestore(app);
        let collections: string[] = [];
        
        try {
          const querySnapshot = await getDocs(collection(db, 'test'));
          collections = querySnapshot.docs.map(doc => doc.id);
        } catch (error) {
          // It's okay if test collection doesn't exist
          const firebaseError = error as FirestoreError;
          if (firebaseError.code !== 'not-found') throw error;
        }

        setFirebaseStatus({
          app: !!appName,
          auth: true, // If we got here, auth is working
          firestore: true, // If we got here, firestore is working
          collections,
          error: ''
        });
      } catch (error) {
        console.error('Firebase test failed:', error);
        setFirebaseStatus(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'An unknown error occurred'
        }));
      }
    };

    testFirebase();
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto mt-10 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Firebase Configuration Test</h2>
      
      <div className="space-y-3">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${firebaseStatus.app ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>Firebase App: {firebaseStatus.app ? 'Connected' : 'Not Connected'}</span>
        </div>
        
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${firebaseStatus.auth ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>Authentication: {firebaseStatus.auth ? 'Connected' : 'Not Connected'}</span>
        </div>
        
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${firebaseStatus.firestore ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>Firestore: {firebaseStatus.firestore ? 'Connected' : 'Not Connected'}</span>
        </div>
        
        {firebaseStatus.error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            <p className="font-bold">Error:</p>
            <p className="text-sm">{firebaseStatus.error}</p>
          </div>
        )}
        
        <div className="mt-4">
          <p className="font-medium">Environment Variables:</p>
          <div className="text-sm bg-gray-50 p-2 rounded mt-1 overflow-x-auto">
            <pre>{JSON.stringify({
              projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing',
              apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing',
              authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing',
              storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing'
            }, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseTest;
