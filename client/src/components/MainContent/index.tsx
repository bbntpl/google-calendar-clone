import { useEffect } from 'react';

import { calendar_v3 } from '@googleapis/calendar';
import { useAppConfig } from '../../contexts/AppConfigContext';
import { useStore, useStoreUpdater } from '../../contexts/StoreContext';
import { ExternalHolidayEvent, SelectedHoliday } from './index.model';

import withScheduleDialogToggle from '../Schedules/ScheduleHOC';
import MiniScheduleButton from '../Schedules/Buttons/MiniScheduleButton';
import DialogController from '../Schedules/DialogController';
import Loading from '../Loading';
import Header from '../Header';
import Calendar from '../Calendar';
import Sidebar from '../Sidebar/index';

import {
  convertExternalEventToSchedule,
  getHolidayEventsByRegion,
} from '../../api/holiday';
import { UserAction } from '../../contexts/StoreContext/index.model';

const CreateSchedule = withScheduleDialogToggle(MiniScheduleButton);

interface MainContentProps {
  isInitialLoad: boolean
}

export default function MainContent(props: MainContentProps):
  JSX.Element | undefined {
  const { isInitialLoad } = props

  // Responsible for preventing to fetch external holiday events repeatedly
  const { visibilities } = useAppConfig();
  const { calendars, status } = useStore();
  const { dispatchSchedules, setStatus } = useStoreUpdater();

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

  useEffect(() => {
    if (
      !status.isUserChanged ||
      !status.isCalendarsInitialized ||
      !status.isFetchedDataInitialized ||
      status.isExternalEventsInitialized
    ) return;

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
        console.log('Fetched holiday schedules are stored in memory', schedules.length, ' items');
      })
      .catch(error => {
        console.error('Error while fetching external holiday events:', error);
      })
      .finally(() => {
        setStatus(prevStatus => ({
          ...prevStatus,
          isExternalEventsInitialized: true,
        }))
      })
  }, [status])

  if (isInitialLoad) return <Loading />
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
}