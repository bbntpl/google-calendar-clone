/* eslint-disable max-lines */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import * as StoreModel from './index.model';
import * as GlobalContextTypes from '../index.model';
import { Schedule } from './types/schedule';

import { useFirebaseAuth } from '../FirebaseAuthContext';
import calendarListReducer from './reducers/calendar-reducer';
import scheduleReducer from './reducers/schedule-reducer';

import useStoreData from './hooks/useFetchStoredData';
import { uniqueID } from '../../util/reusable-funcs';
import { getColorOption, getRandomColorOption } from '../../util/color-options';
import { Calendar, CalendarType } from './types/calendar';
import { has } from '../../util/local-storage';

const StoreContext =
  createContext<StoreModel.ContextState | null>(null);

const StoreDispatchContext =
  createContext<StoreModel.DispatchContextState | null>(null);

const localStorageNamespace = 'gccbvrbryn445-storage';

export const getLocalStorageNamespace = () => localStorageNamespace;

const initialCalendars: Array<Calendar> = [
  {
    id: uniqueID(),
    name: 'Your Calendar',
    colorOption: getColorOption(),
    selected: true,
    removable: false,
    type: 'default' as CalendarType,
  },
  {
    id: uniqueID(),
    name: 'Holidays in United States',
    colorOption: getRandomColorOption(),
    selected: true,
    removable: true,
    type: 'holiday' as CalendarType,
    timeZone: 'UTC',
    description: 'Holidays and Observances in United States',
    region: 'en.usa',
  },
];

export default function StoreProvider({ children }:
  GlobalContextTypes.ContextProviderProps):
  JSX.Element {
  const user = useFirebaseAuth();
  const fetchedData = useStoreData({ user, localStorageNamespace });
  const [savedSchedules, dispatchSchedules] = useReducer(scheduleReducer, [])
  const [calendars, dispatchCalendars] = useReducer(calendarListReducer, []);

  const initializeCalendars = () => {
    dispatchCalendars({
      type: StoreModel.UserAction.ADD_MULTIPLE,
      payload: {
        addedItems: initialCalendars,
        whereTo: 'both',
      },
    })
  }

  const replaceCalendars = (arr: Calendar[]) => {
    dispatchCalendars({
      type: StoreModel.UserAction.REPLACE_ALL,
      payload: arr,
    });
  }

  const replaceSchedules = (arr: Schedule[]) => {
    dispatchSchedules({
      type: StoreModel.UserAction.REPLACE_ALL,
      payload: arr,
    });
  }

  useEffect(() => {
    const areCalendarsInLocalStorage = has(`${localStorageNamespace}_calendars`);
    // Initialize the calendars with default ones if no documents were
    // fetched from either cloud firestore or local storage
    if (!fetchedData.isFetching
      && !areCalendarsInLocalStorage
      && !calendars.length) {
      initializeCalendars();
    }
  }, [fetchedData.isFetching, calendars])

  useEffect(() => {
    if (!fetchedData.isFetching) {
      replaceCalendars(fetchedData.calendars);
      replaceSchedules(fetchedData.savedSchedules);
    }
  }, [user]);

  const filteredSchedules = useMemo(() => {
    const calendarIds = calendars
      .filter((calendar: { selected: boolean; }) => calendar.selected)
      .map((calendar: { id: number; }) => calendar.id);
    return savedSchedules.filter((schedule: Schedule) => {
      return calendarIds.includes(schedule.calendarId);
    });
  }, [savedSchedules, calendars]);

  const contextValues: StoreModel.ContextState = {
    savedSchedules,
    calendars,
    filteredSchedules,
  }

  const dispatchContextValues: StoreModel.DispatchContextState = {
    dispatchSchedules,
    dispatchCalendars,
  }

  return (
    <StoreContext.Provider value={contextValues}>
      <StoreDispatchContext.Provider value={dispatchContextValues}>
        {children}
      </StoreDispatchContext.Provider>
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

export function useStoreUpdater() {
  const context = useContext(StoreDispatchContext);
  if (!context) {
    throw new Error('useStoreUpdater must be used within a StoreProvider');
  }
  return context;
}