import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { DocumentData } from 'firebase/firestore';

import * as StoreModel from '../index.model';
import { Calendar } from '../types/calendar';
import { Schedule } from '../types/schedule';

import { retrieveDocs } from '../../../functions/firestore/retrieve-data';
import * as LocalStorageHelper from '../../../util/local-storage';

const { get } = LocalStorageHelper;

interface UseStoreDataProps {
	user: User | null
	localStorageNamespace: string
}

export default function useFetchStoredData(props: UseStoreDataProps) {
	const { user, localStorageNamespace } = props;
	const [storeState, setStoreState] = useState<StoreModel.StoreState>({
		savedSchedules: [],
		calendars: [],
	});
	const [isFetching, setIsFetching] = useState(true);

	const updateStoreCollection = (
		collectionName: string,
		arr: Schedule[] | Calendar[] | DocumentData[],
	) => {
		setStoreState(prevStoreState => ({
			...prevStoreState,
			[collectionName]: arr,
		}))
	}

	useEffect(() => {
		if (user) {
			Promise.all([
				retrieveDocs<Schedule>({
					collectionName: 'savedSchedules',
					userId: user.uid,
					setData: updateStoreCollection,
				}),
				retrieveDocs<Calendar>({
					collectionName: 'calendars',
					userId: user.uid,
					setData: updateStoreCollection,
				}),
			]).then(() => {
				setIsFetching(false);
			})
		} else {
			const savedSchedules
				= get<Array<Schedule>>(`${localStorageNamespace}_savedSchedules`)
				|| [];
			const calendars
				= get<Array<Calendar>>(`${localStorageNamespace}_calendars`);

			if (savedSchedules) {
				updateStoreCollection('savedSchedules', savedSchedules);
			}
			if (calendars) {
				updateStoreCollection('calendars', calendars);
			}
			setIsFetching(false);
		}
	}, [user]);

	return { ...storeState, isFetching };
}