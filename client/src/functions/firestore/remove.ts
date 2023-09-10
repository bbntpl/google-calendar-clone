import {
	FirestoreError,
	deleteDoc,
	doc,
	getDoc,
} from 'firebase/firestore';
import { db } from '../../firebase.config';

interface RemoveDocumentProps {
	collectionName: string
	docId: number | string
	userId: string
}

interface RemoveMultipleDocsProps {
	collectionName: string
	ids: (number | string)[]
	userId: string
}

export async function removeDocument(props: RemoveDocumentProps) {
	const { collectionName, docId, userId } = props;
	try {
		const stringifiedDocId = typeof docId === 'number'
			? docId.toString()
			: docId;
		const docRef = doc(db, collectionName, stringifiedDocId);

		const docSnapshot = await getDoc(docRef);
		const areUserIdsMatched = docSnapshot.exists()
			&& docSnapshot.data().userId === userId;
		if (areUserIdsMatched) {
			await deleteDoc(docRef);
		}
	} catch (e) {
		const error: FirestoreError = e as FirestoreError;
		throw new Error(`Error removing a document in the collection '${collectionName}: ${error.message}`);
	}
}

export async function removeMultipleDocuments(props: RemoveMultipleDocsProps) {
	const { collectionName, ids, userId } = props;
	try {
		for (const docId of ids) {
			const stringifiedDocId = typeof docId === 'number'
				? docId.toString()
				: docId;
			const docRef = doc(db, collectionName, stringifiedDocId);

			const docSnapshot = await getDoc(docRef);
			const areUserIdsMatched = docSnapshot.exists()
				&& docSnapshot.data().userId === userId;
			if (areUserIdsMatched) {
				await deleteDoc(docRef);
			}
		}
	} catch (e) {
		const error: FirestoreError = e as FirestoreError;
		throw new Error(
			`Error removing multiple documents in the collection '${collectionName}: ${error.message}`,
		);
	}
}