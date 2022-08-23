import { getScheduleTimeOptions } from '../../../util/calendar-arrangement';
import TimeLabel from './TimeLabel';

export default function TimeLabelCol() {
	return <>
		{
			getScheduleTimeOptions().map(({ time, timeWithoutMinutes }, index) => {
				if (index % 4 !== 0) return;
				return <TimeLabel
					key={`${time}-${index}`}
					time={timeWithoutMinutes}
				/>
			})
		}
	</>
}