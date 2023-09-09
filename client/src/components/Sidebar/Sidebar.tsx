import './styles.scss';

import MiniCalendar from '../MiniCalendar';
import CalendarList from '../CalendarList';
import withScheduleDialogToggle from '../Schedules/ScheduleHOC';
import { DefaultScheduleButton } from '../Schedules/Buttons';
import { useStore } from '../../contexts/StoreContext';

const CreateSchedule
	= withScheduleDialogToggle(DefaultScheduleButton);

export default function Sidebar(): JSX.Element {
	const { calendars } = useStore();

	const personalCalendars = calendars.filter(c => c.type === 'default');
	const holidayCalendars = calendars.filter(c => c.type === 'holiday');

	return (
		<div className='sidebar'>
			<div>
				<CreateSchedule />
			</div>
			<MiniCalendar rootElModifier={'by-content'} />
			<CalendarList
				calendars={personalCalendars} 
				type='default'
			/>
			<CalendarList
				title='Other Calendars'
				calendars={holidayCalendars}
				type='holiday'
				limit={50}
			/>
		</div>
	)
}