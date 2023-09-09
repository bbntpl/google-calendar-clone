import {
	DocumentData,
	FirestoreError,
	WithFieldValue,
	doc,
	setDoc,
	writeBatch,
} from 'firebase/firestore';
import { db } from '../../firebase.config';

interface BaseAddDocumentProps {
	collectionName: string
	userId: string
}

interface AddDocumentProps<T> extends BaseAddDocumentProps {
	item: T
}

interface AddMultipleDocumentsProps<T> extends BaseAddDocumentProps {
	items: T[]
}

export async function addDocument<
	T extends WithFieldValue<DocumentData>
>(props: AddDocumentProps<T>) {
	const { collectionName, item, userId } = props;
	try {
		const docRef = doc(db, collectionName, item.id.toString());
		await setDoc(docRef, {
			...item,
			userId,
		});
	} catch (e) {
		const error: FirestoreError = e as FirestoreError;
		throw new Error(`Error adding a document to collection '${collectionName}': ${error.message}`);
	}
}

export async function addMultipleDocuments<
	T extends WithFieldValue<DocumentData>
>(props: AddMultipleDocumentsProps<T>) {
	const { collectionName, items, userId } = props;
	try {
		const batch = writeBatch(db);

		items.forEach(async (item) => {
			const docRef = doc(db, collectionName, item.id.toString());
			batch.set(docRef, {
				...item,
				userId,
			});
		});

		await batch.commit();
	} catch (e) {
		const error: FirestoreError = e as FirestoreError;
		throw new Error(`Error adding multiple documents to collection '${collectionName}': ${error.message}`);
	}
}