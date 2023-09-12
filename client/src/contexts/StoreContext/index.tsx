/* eslint-disable max-lines */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';

import * as StoreModel from './index.model';
import * as GlobalContextTypes from '../index.model';
import { Schedule } from './types/schedule';

import { isInitial, isUser, useFirebaseAuth } from '../FirebaseAuthContext';
import calendarListReducer from './reducers/calendar-reducer';
import scheduleReducer from './reducers/schedule-reducer';
import { Calendar } from './types/calendar';

import { retrieveDocs } from '../../functions/firestore/retrieve-data';
import { get } from '../../util/local-storage';
import { useInitializeCalendars } from './hooks/useInitializeCalendars';

const StoreContext =
  createContext<StoreModel.ContextState | null>(null);
const StoreDispatchContext =
  createContext<StoreModel.DispatchContextState | null>(null);

const localStorageNamespace = 'gccbvrbryn445-storage';

const initialStatus: StoreModel.StoreStatus = {
  isUserChanged: false, // if user context is not 'INITIAL' anymore
  isFetchedDataInitialized: false,
  isCalendarsInitialized: false,
  isExternalEventsInitialized: false,
};

export default function StoreProvider({ children }:
  GlobalContextTypes.ContextProviderProps):
  JSX.Element {
  const user = useFirebaseAuth();
  const [savedSchedules, dispatchSchedules] = useReducer(scheduleReducer, [])
  const [calendars, dispatchCalendars] = useReducer(calendarListReducer, []);
  // If user is either null or User then the user is changed
  const [status, setStatus] = useState<StoreModel.StoreStatus>(initialStatus);

  useInitializeCalendars({
    status,
    localStorageNamespace,
    setStatus,
    dispatchCalendars,
  });

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
    status,
  }

  const dispatchContextValues: StoreModel.DispatchContextState = {
    dispatchSchedules,
    dispatchCalendars,
    setStatus,
  }

  const saveLocalItemsToCloud = () => {
    const savedSchedules = get<Array<Schedule>>(`${localStorageNamespace}_savedSchedules`) || [];
    const calendars = get<Array<Calendar>>(`${localStorageNamespace}_calendars`) || [];
    dispatchSchedules({
      type: StoreModel.UserAction.ADD_MULTIPLE,
      payload: { addedItems: savedSchedules, whereTo: 'storage' },
    })
    dispatchCalendars({
      type: StoreModel.UserAction.ADD_MULTIPLE,
      payload: { addedItems: calendars, whereTo: 'storage' },
    })

    return calendars.length > 0;
  }

  const initializeLocalItems = () => {
    const savedSchedules = get<Array<Schedule>>(`${localStorageNamespace}_savedSchedules`) || [];
    const calendars = get<Array<Calendar>>(`${localStorageNamespace}_calendars`) || [];
    dispatchSchedules({
      type: StoreModel.UserAction.REPLACE_ALL,
      payload: savedSchedules,
    })
    dispatchCalendars({
      type: StoreModel.UserAction.REPLACE_ALL,
      payload: calendars,
    })

    return calendars.length > 0;
  }

  function initializeCalendarsAndUpdateStatus(initializeFn: () => boolean) {
    const isCalendarsInitialized = initializeFn();
    setStatus(prevStatus => ({
      ...prevStatus,
      ...(isCalendarsInitialized ? { isCalendarsInitialized } : {}),
      isFetchedDataInitialized: true,
    }));
  }

  // It monitor changes in the user object and set the isUserChanged 
  // flag accordingly
  useEffect(() => {
    if (isInitial(user)) return;
    setStatus(prevStatus => ({ ...prevStatus, isUserChanged: true }));
  }, [user])

  // It responds to user changes by resetting various statuses
  // State user changes when the user signed out or signed in.
  useEffect(() => {
    if (!status.isUserChanged) return;
    setStatus(prevStatus => ({
      ...prevStatus,
      isFetchedDataInitialized: false,
      isCalendarsInitialized: false,
      isExternalEventsInitialized: false,
    }))
  }, [user])

  // It handles data fetching and initialization based on user change and
  // the first initialization of data when the user has accessed this website
  useEffect(() => {
    if (!status.isUserChanged) return;
    if (isUser(user)) {
      Promise.all([
        retrieveDocs({
          collectionName: `${localStorageNamespace}_savedSchedules`,
          userId: user.uid,
        }),
        retrieveDocs({
          collectionName: `${localStorageNamespace}_calendars`,
          userId: user.uid,
        }),
      ]).then(([fetchedSchedules, fetchedCalendars]) => {
        if (fetchedCalendars && fetchedCalendars.length === 0) {
          initializeCalendarsAndUpdateStatus(saveLocalItemsToCloud);
        } else {
          if (fetchedSchedules && fetchedCalendars) {
            dispatchSchedules({
              type: StoreModel.UserAction.REPLACE_ALL,
              payload: fetchedSchedules as Schedule[],
            })
            dispatchCalendars({
              type: StoreModel.UserAction.REPLACE_ALL,
              payload: fetchedCalendars as Calendar[],
            })
            setStatus(prevStatus => ({
              ...prevStatus,
              isCalendarsInitialized: true,
              isFetchedDataInitialized: true,
            }));
          }
        }
        setStatus(prevStatus => ({ ...prevStatus, isFetchedDataInitialized: true }));
      }).catch(error => {
        console.error('Error retrieving documents:', error);
      });
    } else {
      initializeCalendarsAndUpdateStatus(initializeLocalItems);
    }
  }, [user, status.isUserChanged]);

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
export const getLocalStorageNamespace = () => localStorageNamespace;