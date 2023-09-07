import SectionText from '../SectionText';
import HolidayCheckboxList from './HolidayCheckboxList';

export default function ExternalCalendars() {
  return <div>
    <SectionText text='External Calendars' />
    <div>
      <p>Toggle holiday events to be added to the
        <b>{' Other Calendars '}</b>
         list.</p>
         <HolidayCheckboxList />
    </div>
  </div>
}