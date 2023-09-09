import { User } from 'firebase/auth';
import { db } from '../../firebase.config';
import { FirestoreError, doc, getDoc, setDoc } from 'firebase/firestore';

export async function doesUserExist(user: User): Promise<boolean> {
	try {
		const docRef = doc(db, 'users', user.uid);
		const docSnapshot = await getDoc(docRef);
		return docSnapshot.exists();
	} catch (e) {
		const error: FirestoreError = e as FirestoreError;
		throw new Error(`Error checking if user exists already: ${error.message}`);
	}
}

export async function saveUserToCloud(user: User) {
	try {
		const docRef = doc(db, 'users', user.uid);
		await setDoc(docRef, { id: user.uid });
	} catch (e) {
		const error: FirestoreError = e as FirestoreError;
		throw new Error(`Error adding user to collection users: ${error.message}`);
	}
}