import {
  ReactElement,
  useEffect,
  useState,
} from 'react';

import regionListFile from '../../../data/localized-holiday-events.txt';
import { readTextFile } from '../../../util/reusable-funcs';
import { HolidayItem } from './index.model';
import { useStore } from '../../../context/StoreContext';
import CheckboxItem from './CheckboxItem';


interface RenderCboxItemsProps {
  filterBySelected?: boolean;
  displayAll?: boolean
}

interface RenderCboxListProps extends RenderCboxItemsProps {
  listDesc: ReactElement;
}


export default function HolidayCheckboxList() {
  const { calendars } = useStore();
  const selectedHolidayCalendars: string[] | []
    = calendars.filter(calendar => Object.hasOwn(calendar, 'region'))
      .map(calendar => {
        if ('region' in calendar) {
          return calendar.region;
        }
        return '';
      })
  const [regionalHolidays, setRegionalHolidays]
    = useState<Array<HolidayItem> | []>([]);

  const [fullViewCheckList, setFullViewCheckList]
    = useState(false);

  const convertFileOutputToArr = (result: Array<string>) => {
    return result.map(element => {
      const elementTuple = element.split(',');
      const holidayRegionName = elementTuple[0];
      const calendarRegion = elementTuple[1];

      return {
        name: holidayRegionName,
        region: calendarRegion,
        selected: selectedHolidayCalendars.includes(calendarRegion),
      }
    })
  }

  useEffect(() => {
    readTextFile(regionListFile)
      .then((output) => {
        const result: Array<HolidayItem> = convertFileOutputToArr(output)
        setRegionalHolidays(result);
      });
  }, [])

  useEffect(() => {
    console.log(regionalHolidays.filter(h => h.selected));
  }, [regionalHolidays])

  const toggleIsHolidaySelected = (regionName: string) => () => {
    setRegionalHolidays(prevRegionalHolidays => {
      return prevRegionalHolidays.map(holiday => {
        if (regionName === holiday.region) {
          return {
            ...holiday,
            selected: !holiday.selected,
          }
        }
        return holiday;
      })
    })
  }

  const renderCboxItems = ({ filterBySelected, displayAll }: RenderCboxItemsProps) => {
    return regionalHolidays
      .filter(holiday => (!filterBySelected ? true : holiday.selected))
      .slice(0, displayAll ? regionalHolidays.length : 10)
      .map((holiday) => (
        <CheckboxItem
          key={holiday.name}
          holidayItem={holiday}
          handleCboxToggle={toggleIsHolidaySelected}
        />
      ))
  }

  const renderCboxList = ({
    listDesc,
    displayAll = true,
    filterBySelected = false,
  }: RenderCboxListProps) => {
    return <ul className='checkbox-list'>
      <li>
        {listDesc}
      </li>
      {renderCboxItems({ filterBySelected, displayAll })}
    </ul>
  }

  return <div>
    {renderCboxList({
      listDesc: <b>Currently added Holliday Calendars: </b>,
      filterBySelected: true,
    })}
    {renderCboxList({
      listDesc: <i>Check the following regional holiday events that you want to be added: </i>,
      displayAll: fullViewCheckList,
    })}
    {
      !fullViewCheckList &&
      <button
        className='clear-btn--no-effects view-more-btn'
        onClick={() => setFullViewCheckList(true)}
      >
        view more...
      </button>
    }
  </div>
}