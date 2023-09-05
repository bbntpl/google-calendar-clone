import {
  createContext,
  useContext,
  useMemo,
  useReducer,
} from 'react';

import * as StoreModel from './index.model';
import * as GlobalContextTypes from '../index.model';
import { Calendar, CalendarType } from './types/calendar';

import { useFirebaseAuth } from '../FirebaseAuthContext';
import calendarListReducer from './reducers/calendar-reducer';
import scheduleReducer from './reducers/schedule-reducer';

import { getItemFromLocal } from '../../util/local-storage';
import { uniqueID } from '../../util/reusable-funcs';
import { getColorOption } from '../../util/color-options';
import { Schedule } from './types/schedule';

const StoreContext =
  createContext<StoreModel.ContextState | null>(null);

const StoreDispatchContext =
  createContext<StoreModel.DispatchContextState | null>(null);

const localStorageItemName = 'gccbvrbryn445-storage';

const initialCalendar: Calendar = {
  id: uniqueID(),
  name: 'Your Calendar',
  colorOption: getColorOption(),
  selected: true,
  removable: false,
  type: 'default' as CalendarType,
};

export const getLocalStorageName = () => localStorageItemName;

const getStoreData = (user: unknown) => {
  if (user) {
    return getItemFromLocal(localStorageItemName);
  } else {
    return getItemFromLocal(localStorageItemName);
  }
}

export default function StoreProvider({ children }: GlobalContextTypes.ContextProviderProps):
  JSX.Element {
  const user = useFirebaseAuth();
  const storeData = getStoreData(user);

  const getInitialCalendars = (calendars: Array<Calendar>) => {
    return calendars && calendars.length > 0 ? calendars : [initialCalendar];
  }

  const getInitialSchedules = (schedules: Array<Schedule>) => {
    return schedules && schedules.length > 0 ? schedules : [];
  };

  const [savedSchedules, dispatchSchedules] = useReducer(
    scheduleReducer,
    getInitialSchedules(storeData.schedules),
  )

  const [calendars, dispatchCalendars] = useReducer(
    calendarListReducer,
    getInitialCalendars(storeData.calendars),
  )

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