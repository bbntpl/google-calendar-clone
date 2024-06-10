import { UserAction } from '../index.model';
import { Calendar, CalendarListActions } from '../types/calendar';
import { Schedule, ScheduleActions } from '../types/schedule';

import { ExecuteActionProps } from './model';
import * as LocalStorageHelper from '../../../util/local-storage';
import { getLocalStorageNamespace } from '..';

import {
	addDocument,
	addMultipleDocuments,
} from '../../../functions/firestore/add';
import {
	editDocument,
} from '../../../functions/firestore/edit'
import {
	removeDocument,
	removeMultipleDocuments,
} from '../../../functions/firestore/remove';

const {
	appendItemToArray,
	appendArrayItemToArray,
	editItemInArray,
	removeItemFromArrayById,
	removeItemsFromArrayByIds,
	remove,
	get,
} = LocalStorageHelper;

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
	const namespace = getLocalStorageNamespace();
	const authenticatedUserId: string | undefined = get(`${namespace}_authenticatedUserId`);

	switch (action.type) {
		case UserAction.ADD:
			const { addedItem } = action.payload;
			action.payload.whereTo = action.payload.whereTo ?? 'both';
			const addedObject = [...state, addedItem as State];

			if (action.payload.whereTo === 'cloud' || action.payload.whereTo === 'both') {
				if (authenticatedUserId) {
					addDocument({
						collectionName: propKey,
						item: addedItem,
						userId: authenticatedUserId,
					})
				} else {
					appendItemToArray<State>(
						propKey,
						addedItem as State,
					);
				}
			}

			return action.payload.whereTo === 'local' || action.payload.whereTo === 'both'
				? addedObject : state;
		case UserAction.ADD_MULTIPLE:
			const { addedItems } = action.payload;
			action.payload.whereTo = action.payload.whereTo ?? 'both';
			const addedArr = [...state, ...addedItems] as State[];

			if (action.payload.whereTo === 'cloud' || action.payload.whereTo === 'both') {
				if (authenticatedUserId) {
					addMultipleDocuments({
						collectionName: propKey,
						items: addedItems,
						userId: authenticatedUserId,
					})
				} else {
					appendArrayItemToArray<State>(
						propKey,
						addedItems as Array<State>,
					);
				}
			}
			return action.payload.whereTo === 'local' || action.payload.whereTo === 'both'
				? addedArr : state;
		case UserAction.EDIT:
			const editedArr = [...state.map((object: State) => {
				if (object.id === action.payload.id) {
					return Object.assign(action.payload);
				}
				return object;
			})];
			if (authenticatedUserId) {
				editDocument({
					collectionName: propKey,
					updatedItem: action.payload,
					userId: authenticatedUserId,
				})
			}
			editItemInArray<State>(propKey, action.payload as State);

			return editedArr;
		case UserAction.REMOVE:
			const reducedArr = state.filter((obj: State) => {
				return obj.id !== action.payload.id;
			});
			const itemToBeRemoved = state.find(obj => action.payload.id === obj.id);
			if (!itemToBeRemoved) return reducedArr;
			if (reducedArr.length > 0) {
				if (authenticatedUserId) {
					removeDocument({
						collectionName: propKey,
						docId: action.payload.id,
						userId: authenticatedUserId,
					});
				} else {
					removeItemFromArrayById<State>(propKey, itemToBeRemoved);
				}
			} else {
				if (!authenticatedUserId) {
					remove(propKey);
				}
			}

			return reducedArr;
		case UserAction.REMOVE_MULTIPLE:
			const objectIdsToRemove = action.payload.map(ap => ap.id);
			const objectsToKeep = state.filter((obj: State) => {
				return !objectIdsToRemove.includes(obj.id);
			});

			if (authenticatedUserId) {
				removeMultipleDocuments({
					collectionName: propKey,
					ids: objectIdsToRemove,
					userId: authenticatedUserId,
				});
			} else {
				removeItemsFromArrayByIds<State>(propKey, objectIdsToRemove);
			}

			return objectsToKeep;
		case UserAction.CLEAR:
			return [];
		case UserAction.REPLACE_ALL:
			return action.payload as State[];
		default:
			throw new Error('The user made an unknown action');
	}
}