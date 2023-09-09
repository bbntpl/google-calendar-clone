import { DocumentData, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase.config';

interface RetrieveDocsProps<T> {
	collectionName: string
	userId: string
	setData: (collectionName: string, arr: T[] | DocumentData[]) => void,
}

export async function retrieveDocs<T>(props: RetrieveDocsProps<T>) {
	const { collectionName, userId, setData } = props;
	try {
		const queriedCollection
			= query(collection(db, collectionName), where('userId', '==', userId));
		const querySnapshot = await getDocs(queriedCollection);
		if (querySnapshot.empty) {
			setData(collectionName, []);
			return [];
		} else {
			const dataArray = querySnapshot.docs.map((doc) => doc.data());
			setData(collectionName, dataArray);
			return dataArray;
		}
	} catch (error) {
		console.error('Error retrieving data:', error);
	}
};