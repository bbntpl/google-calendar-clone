import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import * as StoreModel from './index.model';
import * as GlobalContextTypes from '../index.model';
import { Calendar, CalendarType } from './types/calendar';
import { Schedule } from './types/schedule';

import { useFirebaseAuth } from '../FirebaseAuthContext';
import calendarListReducer from './reducers/calendar-reducer';
import scheduleReducer from './reducers/schedule-reducer';

import { uniqueID } from '../../util/reusable-funcs';
import { getColorOption } from '../../util/color-options';
import * as LocalStorageHelper from '../../util/local-storage';

const { get } = LocalStorageHelper;

const StoreContext =
  createContext<StoreModel.ContextState | null>(null);

const StoreDispatchContext =
  createContext<StoreModel.DispatchContextState | null>(null);

const localStorageNamespace = 'gccbvrbryn445-storage';

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
    colorOption: getColorOption(),
    selected: true,
    removable: true,
    type: 'holiday' as CalendarType,
    timeZone: 'UTC',
    description: 'Holidays and Observances in United States',
    region: 'en.usa',
  },
];

export const getLocalStorageNamespace = () => localStorageNamespace;

const getStoreData = (user: unknown) => {
  console.log(user);
  const savedSchedules
    = get<Array<Schedule>>(`${localStorageNamespace}_savedSchedules`) || [];
  const calendars
    = get<Array<Calendar>>(`${localStorageNamespace}_calendars`) || [];

  return { savedSchedules, calendars }
}

export default function StoreProvider({ children }:
  GlobalContextTypes.ContextProviderProps):
  JSX.Element {
  const user = useFirebaseAuth();
  const storeData = getStoreData(user);

  const getInitialCalendars = (calendars: Array<Calendar>) => {
    return calendars && calendars.length > 0 ? calendars : initialCalendars;
  }

  const getInitialSchedules = (schedules: Array<Schedule>) => {
    return schedules && schedules.length > 0 ? schedules : [];
  };

  const [savedSchedules, dispatchSchedules] = useReducer(
    scheduleReducer,
    getInitialSchedules(storeData.savedSchedules),
  )

  const [calendars, dispatchCalendars] = useReducer(
    calendarListReducer,
    getInitialCalendars(storeData.calendars),
  )

  useEffect(() => {
    if (!(storeData.calendars && storeData.calendars.length > 0)) {
      dispatchCalendars({
        type: StoreModel.UserAction.ADD_MULTIPLE,
        payload: {
          addedItems: getInitialCalendars(storeData.calendars),
          whereTo: 'storage',
        },
      })
    }
  }, [])

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