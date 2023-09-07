import { useEffect } from 'react';

import { useAppConfig } from '../../context/AppConfigContext';
import { useStore, useStoreUpdater } from '../../context/StoreContext';
import { ExternalHolidayEvent, SelectedHoliday } from './index.model';
import { calendar_v3 } from '@googleapis/calendar';

import withScheduleDialogToggle from '../Schedules/ScheduleHOC';
import MiniScheduleButton from '../Schedules/Buttons/MiniScheduleButton';
import DialogController from '../Schedules/DialogController';
import Loading from '../Loading';
import Header from '../Header';
import Calendar from '../Calendar';
import Sidebar from '../Sidebar/index';

import { getHolidayEventsByRegion } from '../../api/holiday';
import { uniqueID } from '../../util/reusable-funcs';
import { UserAction } from '../../context/StoreContext/index.model';
import { ScheduleType } from '../../context/StoreContext/types/schedule';
import { getColorOption } from '../../util/color-options';
import { CalendarType } from '../../context/StoreContext/types/calendar';
import { DateTimeInputs } from '../../context/CalendarConfigContext/index.model';

const CreateSchedule = withScheduleDialogToggle(MiniScheduleButton);

interface MainContentProps {
  isInitialDataFetched: boolean
  toggleIsDataFetched: () => void
}

export default function MainContent(props: MainContentProps):
  JSX.Element | undefined {
  const {
    isInitialDataFetched,
    toggleIsDataFetched,
  } = props

  const { visibilities } = useAppConfig();
  const { calendars } = useStore();
  const { dispatchSchedules } = useStoreUpdater();

  const selectedHolidays: SelectedHoliday[] | []
    = calendars.filter(calendar => {
      return Object.hasOwn(calendar, 'region')
    })
      .map(calendar => {
        if ('region' in calendar) {
          return {
            calendarId: calendar.id,
            region: calendar.region,
          };
        }
        return {
          calendarId: calendar.id,
          region: '',
        };
      })

  const fetchExternalHolidayEvents = async () => {
    const holidaysWithPromiseEvents = selectedHolidays.map(({ calendarId, region }) => {
      const promise = getHolidayEventsByRegion(region);
      return {
        calendarId,
        events: promise,
      };
    });

    try {
      const holidayCalendars = await Promise.all(holidaysWithPromiseEvents.map(h => h.events));
      const externalEvents: ExternalHolidayEvent[] = [];

      holidayCalendars.forEach((calendar: calendar_v3.Schema$Events, index) => {
        const { items } = calendar;
        if (items !== undefined) {
          const updatedItems =
            items.map(item => {
              return {
                ...item,
                calendarId: holidaysWithPromiseEvents[index].calendarId,
              }
            })
          externalEvents.push(...updatedItems);
        }
      })

      return externalEvents;
    } catch (error) {
      throw error;
    }
  }

  // Extract values from holiday event properties and
  // set it as values for holiday schedule event
  const convertExternalEventToSchedule = (externalEvent: ExternalHolidayEvent) => {
    let date, locationName: string = '';

    if (externalEvent.organizer && externalEvent.organizer.displayName) {
      const calenadarName = externalEvent.organizer.displayName;
      locationName = calenadarName.split('in')[1].trim();
    }

    if (externalEvent.start && externalEvent.start.date) {
      const [year, month, day] = externalEvent.start.date.split('-');
      date = `${year}${month}${day}`;
    }

    return {
      id: uniqueID(),
      title: externalEvent.summary || '',
      description: externalEvent.description || '',
      calendarId: externalEvent.calendarId,
      calendarType: 'holiday' as CalendarType,
      dateTime: {
        allDay: false,
        once: true,
        date,
        time: { start: -1, end: -1 },
      } as DateTimeInputs,
      type: 'event' as ScheduleType,
      isExternal: true,
      location: locationName,
      colorOption: getColorOption(),
    }
  }

  useEffect(() => {
    if (isInitialDataFetched) return;

    fetchExternalHolidayEvents()
      .then((externalEvents) => {
        const schedules = externalEvents.map(convertExternalEventToSchedule);
        dispatchSchedules({
          type: UserAction.ADD_MULTIPLE,
          payload: {
            addedItems: schedules,
            whereTo: 'memory',
          },
        });
      })
      .catch(error => {
        throw error;
      })
      .finally(() => {
        toggleIsDataFetched();
      })
  }, [])

  if (isInitialDataFetched) {
    return (
      <>
        <Header />
        <main className='main'>
          {
            visibilities.sidebar
              ? <Sidebar />
              : <CreateSchedule />
          }
          <Calendar />
          <DialogController />
        </main>
      </>
    )
  } else {
    return <Loading />
  }
}