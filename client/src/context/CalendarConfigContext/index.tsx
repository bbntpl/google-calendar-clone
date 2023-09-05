import React,
{
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import * as CalendarConfigModel from './index.model';
import { ContextProviderProps } from '../index.model';
import { ContextState } from './index.model';
import { convertDateUnitsToString, dateToday } from '../../util/calendar-arrangement';
import { ScheduleType, SelectedSchedule } from '../StoreContext/types/schedule';
import useComponentVisible from '../../hooks/useComponentVisible';

const CalendarConfigContext =
  createContext<CalendarConfigModel.ContextState | null>(null);

const CalendarConfigDispatchContext =
  createContext<CalendarConfigModel.DispatchContextState | null>(null);

export default function CalendarConfigProvider({
  children,
}: ContextProviderProps):
  JSX.Element {
  const [
    scheduleDialogRef,
    isScheduleDialogVisible,
    setIsScheduleDialogVisible,
  ] = useComponentVisible();

  const [selectedCalendarUnit, setSelectedCalendarUnit] =
    useState<CalendarConfigModel.CalendarUnits>('day');

  const [defaultDateTime, setDefaultDateTime] = useState({
    date: convertDateUnitsToString(dateToday),
    time: {
      start: new Date().getHours(),
      end: new Date().getHours(),
    },
  });

  const [selectedSchedule, setSelectedSchedule]
    = useState<SelectedSchedule>(null);

  const [selectedDate, setSelectedDate] = useState(dateToday);

  const [selectedScheduleType, setSelectedScheduleType]
    = useState<ScheduleType>('event');

  useEffect(() => {
    setDefaultDateTime(defaultDateTime => ({
      ...defaultDateTime,
      date: convertDateUnitsToString(selectedDate),
    }));
  }, [selectedDate]);

  const contextValues: ContextState = {
    selectedCalendarUnit,
    defaultDateTime,
    selectedSchedule,
    selectedDate,
    selectedScheduleType,
    scheduleDialogRef,
    isScheduleDialogVisible,
  }

  const dispatchContextValues: CalendarConfigModel.DispatchContextState = {
    setSelectedCalendarUnit,
    setDefaultDateTime,
    setSelectedDate,
    setSelectedSchedule,
    setSelectedScheduleType,
    setIsScheduleDialogVisible,
  }

  return <CalendarConfigContext.Provider value={contextValues}>
    <CalendarConfigDispatchContext.Provider value={dispatchContextValues}>
      {children}
    </CalendarConfigDispatchContext.Provider>
  </CalendarConfigContext.Provider>
}

export function useCalendarConfig() {
  const context = useContext(CalendarConfigContext);
  if (!context) {
    throw new Error('useCalendarConfig must be used within CalendarConfigProvider');
  }
  return context;
}

export function useCalendarConfigUpdater() {
  const context = useContext(CalendarConfigDispatchContext);
  if (!context) {
    throw new Error('useCalendarConfig must be used within CalendarConfigProvider');
  }

  return context;
}
