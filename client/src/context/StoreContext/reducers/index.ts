import { UserAction } from '../index.model';
import { Calendar, CalendarListActions } from '../types/calendar';
import { Schedule, ScheduleActions } from '../types/schedule';

import {
	deleteLocalStorage,
	updateStorageItem,
} from '../../../util/local-storage';

// import { useFirebaseAuth } from '../../FirebaseAuthContext';
import { getLocalStorageName } from '..';

interface ExecuteActionProps<S, A> {
	state: S[] | []
	action: A
	updatedState: S[]
	stateName: string
}

export default function executeAction<
	State extends Schedule | Calendar,
	Action extends CalendarListActions | ScheduleActions
>(props: ExecuteActionProps<State, Action>):
	State[] | [] {
	const {
		state,
		action,
		updatedState,
		stateName,
	} = props;

	const storageKey = getLocalStorageName();
	const itemKey = stateName;
	const updatedArr = updatedState;

	switch (action.type) {
		case UserAction.ADD:
			updateStorageItem<State>({ storageKey, itemKey, updatedArr });

			return updatedState;
		case UserAction.EDIT:
			const editedArr = [...state.map((object: State) => {
				if (object.id === action.payload.id) {
					return Object.assign(action.payload);
				}
				return object;
			})];
			updateStorageItem<State>({ storageKey, itemKey, updatedArr });

			return editedArr;
		case UserAction.REMOVE:
			const reducedArr = [...state.filter((obj: State) => {
				return obj.id !== action.payload.id;
			})];
			reducedArr.length > 0
				? updateStorageItem<State>({ storageKey, itemKey, updatedArr })
				: deleteLocalStorage(stateName);

			return reducedArr;
		default:
			throw new Error('The user made an unknown action');
	}
}