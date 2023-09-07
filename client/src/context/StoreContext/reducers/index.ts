import { UserAction } from '../index.model';
import { Calendar, CalendarListActions } from '../types/calendar';
import { Schedule, ScheduleActions } from '../types/schedule';

import * as LocalStorageHelper from '../../../util/local-storage';

const {
	appendItemToArray,
	appendArrayItemToArray,
	editItemInArray,
	removeItemFromArrayById,
	remove,
} = LocalStorageHelper;

interface ExecuteActionProps<S, A> {
	state: S[] | []
	action: A
	propKey: string
}

export default function executeAction<
	State extends Schedule | Calendar,
	Action extends CalendarListActions | ScheduleActions
>(props: ExecuteActionProps<State, Action>):
	State[] | [] {
	const {
		state,
		action,
		propKey,
	} = props;

	switch (action.type) {
		case UserAction.ADD:
			appendItemToArray<State>(
				propKey,
				action.payload as State,
			);

			return [...state, action.payload as State];
		case UserAction.ADD_MULTIPLE:
			const { addedItems, whereTo } = action.payload;
			const addedArr = [...state, ...addedItems] as State[];
			if (whereTo === 'storage' || whereTo === 'both') {
				appendArrayItemToArray<State>(
					propKey,
					addedItems as Array<State>,
				);
			}
			return whereTo === 'memory' || whereTo === 'both'
				? addedArr : state;
		case UserAction.EDIT:
			const editedArr = [...state.map((object: State) => {
				if (object.id === action.payload.id) {
					return Object.assign(action.payload);
				}
				return object;
			})];
			editItemInArray<State>(propKey, action.payload as State);

			return editedArr;
		case UserAction.REMOVE:
			const reducedArr = state.filter((obj: State) => {
				return obj.id !== action.payload.id;
			});
			const itemToBeRemoved = state.find(obj => action.payload.id === obj.id);
			if (!itemToBeRemoved) return reducedArr;
			reducedArr.length > 0
				? removeItemFromArrayById<State>(propKey, itemToBeRemoved)
				: remove(propKey);

			return reducedArr;
		default:
			throw new Error('The user made an unknown action');
	}
}