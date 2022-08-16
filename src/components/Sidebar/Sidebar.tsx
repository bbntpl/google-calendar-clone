import './styles.scss';
import SortDown from '../../assets/icons/sort-down.png';

import MiniCalendar from '../MiniCalendar';
import { GooglePlus } from '../../lib/icons';
import CalendarList from '../CalendarList';
import withScheduleDialogToggle, { ScheduleCreationProps } from '../Schedules/components/ScheduleHOC';

function ScheduleBtn(props: ScheduleCreationProps): JSX.Element {
	const { hocMethods } = props;
	const { toggleVisibility } = hocMethods;
	return (
		<div className='create-schedule-wrapper'>
			<div className='create-schedule-inner'>
				<button
					className='create-schedule row center-xs middle-xs'
					onClick={toggleVisibility}
				>
					<GooglePlus />
					Create
					<img className='icon--small' src={SortDown} />
				</button>
			</div>
		</div>
	)
}

const CreateSchedule = withScheduleDialogToggle(ScheduleBtn);

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