import { useContext, useState } from 'react';
import './styles.scss';
import GlobalContext from '../../context/global/GlobalContext';
import GlobalContextInterface from '../../context/global/index.model';

import { uniqueID } from '../../util/reusable-funcs';
import ScheduleMainContent from './components/ScheduleMainContent';
import TaskBlock from './TaskBlock';
import EventBlock from './EventBlock';

export function ScheduleDialog() {
	const {
		selectedScheduleType,
		calendarList,
		defaultDateTime,
	} = useContext(GlobalContext) as GlobalContextInterface;
	const [scheduleProps, setScheduleProps] = useState({
		calendarId: calendarList[0].id,
		color: calendarList[0].color,
		completed: false,
		dateTime: {
			allDay: false,
			once: true,
			date: defaultDateTime.date,
			time: {
				start: defaultDateTime.time.start,
				end: defaultDateTime.time.end,
			},
		},
		description: '',
		id: uniqueID(),
		location: '',
		title: '',
		type: selectedScheduleType,
	});
	const setTitle = (title: string) => {
		setScheduleProps(setScheduleProps => ({ ...setScheduleProps, title }));
	}
	return (
		<div className='max-content'>
			<ScheduleMainContent
				title={scheduleProps.title}
				setTitle={setTitle}
			/>
			{
				selectedScheduleType === 'event'
					? <EventBlock
						evtProps={{
							calendarId: scheduleProps.calendarId,
							color: scheduleProps.color,
							dateTime: scheduleProps.dateTime,
							description: scheduleProps.description,
							location: scheduleProps.location,
						}}
						setScheduleProps={setScheduleProps}
					/>
					: <div></div>
				// <TaskBlock
				// 	calendarId={scheduleProps.calendarId}
				//  completed={scheduleProps.completed}
				// 	dateTime={scheduleProps.dateTime}
				// 	description={scheduleProps.description}
				// 	setScheduleProps={setScheduleProps}
				// />
			}
			<div>
				<button>
					Save
				</button>
			</div>
		</div>
	)
}