import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase.config';

interface RetrieveDocsProps {
	collectionName: string
	userId: string
}

export async function retrieveDocs(props: RetrieveDocsProps) {
	const { collectionName, userId } = props;
	try {
		const queriedCollection
			= query(collection(db, collectionName), where('userId', '==', userId));
		const querySnapshot = await getDocs(queriedCollection);
		if (querySnapshot.empty) {
			return [];
		} else {
			const dataArray = querySnapshot.docs.map((doc) => doc.data());
			return dataArray;
		}
	} catch (error) {
		console.error('Error retrieving data:', error);
	}
};