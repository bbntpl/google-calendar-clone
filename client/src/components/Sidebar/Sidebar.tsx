import './styles.scss';

import MiniCalendar from '../MiniCalendar';
import CalendarList from '../CalendarList';
import withScheduleDialogToggle from '../Schedules/ScheduleHOC';
import { DefaultScheduleButton } from '../Schedules/Buttons';

const CreateSchedule
	= withScheduleDialogToggle(DefaultScheduleButton);

export default function Sidebar(): JSX.Element {
	return (
		<div className='sidebar'>
			<div>
				<CreateSchedule />
			</div>
			<MiniCalendar rootElModifier={'by-content'} />
			<CalendarList />
		</div>
	)
}