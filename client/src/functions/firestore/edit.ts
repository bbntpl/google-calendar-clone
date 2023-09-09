import {
	doc,
	DocumentData,
	WithFieldValue,
	updateDoc,
	FirestoreError,
	getDoc,
} from 'firebase/firestore';
import { db } from '../../firebase.config';

interface EditDocumentProps<T> {
	collectionName: string
	updatedItem: T
	userId: string
}

export async function editDocument<
	T extends WithFieldValue<DocumentData>
>(props: EditDocumentProps<T>) {
	const { collectionName, updatedItem, userId } = props;
	try {
		const docId = typeof updatedItem.id === 'number'
			? updatedItem.id.toString()
			: updatedItem.id;
		const docRef = doc(db, collectionName, docId);

		const docSnapshot = await getDoc(docRef);
		const areUserIdsMatched = docSnapshot.exists()
			&& docSnapshot.data().userId === userId;

		if (areUserIdsMatched) {
			await updateDoc(docRef, updatedItem);
		}
	} catch (e) {
		const error: FirestoreError = e as FirestoreError
		throw new Error(`Error editing document collection '${collectionName}: ${error.message}`);
	}
}