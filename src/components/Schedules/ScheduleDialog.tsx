import { useContext, useState } from 'react';
import GlobalContext from '../../context/global/GlobalContext';
import GlobalContextInterface from '../../context/global/index.model';

import { uniqueID } from '../../util/reusable-funcs';
import ScheduleMainContent from './components/ScheduleMainContent';
import Event from './Event';
import Task from './Task';

export function ScheduleDialog() {
	const {
		selectedScheduleType,
		calendarList,
		defaultDateTime,
	} = useContext(GlobalContext) as GlobalContextInterface;
	console.log(calendarList);
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
	console.log(scheduleProps);
	return (
		<div>
			<ScheduleMainContent
				title={scheduleProps.title}
				setTitle={setTitle}
			/>
			{
				selectedScheduleType === 'event'
					? <Event
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
				// <Task
				// 	calendarId={scheduleProps.calendarId}
				//  completed={scheduleProps.completed}
				// 	dateTime={scheduleProps.dateTime}
				// 	description={scheduleProps.description}
				// 	setScheduleProps={setScheduleProps}
				// />
			}
		</div>
	)
}