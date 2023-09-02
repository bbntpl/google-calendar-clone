import { getScheduleTimeOptions } from '../../../util/calendar-arrangement';
import TimeLabel from './TimeLabel';

export default function TimeLabelCol() {
	return <>
		{
			getScheduleTimeOptions().map(({ timeWithoutMinutes }, index) => {
				if (index % 4 !== 0) return;
				return <TimeLabel
					key={`time-label-${index / 4}`}
					time={timeWithoutMinutes}
				/>
			})
		}
	</>
}