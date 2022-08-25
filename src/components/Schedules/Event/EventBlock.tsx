import React, { useContext } from 'react';
import GlobalContext from '../../../context/global/GlobalContext';
import GlobalContextInterface, {
	COLORS,
} from '../../../context/global/index.model';
import {
	COLOR_NAMES,
} from '../../../util/calendar-arrangement';
import { getIndexByProp } from '../../../util/reusable-funcs';

import '../styles.scss';
import DescIcon from '../../../assets/icons/desc.png';
import CalendarIcon from '../../../assets/icons/calendar.png';

import DateTimeInputs from './DateTimeInputs';
import { ScheduleEventProps } from '../index.model';

const SelectColors = () => {
	return <>{
		COLOR_NAMES.map((color, cIndex) => {
			return <option
				key={`calendar-${cIndex + 1}`}
				value={color}>
				{color}
			</option>
		})
	}</>
}

export default function EventBlock(props: ScheduleEventProps): JSX.Element {
	const { calendarList } = useContext(GlobalContext) as GlobalContextInterface;
	const { evtProps, setScheduleProps } = props;
	const {
		location,
		description,
		color,
		calendarId,
		dateTime,
	} = evtProps;

	const defaultCalendarColor = () => {
		const matchingIndex = getIndexByProp({
			arr: calendarList,
			key: 'id',
			value: calendarId,
		});
		return calendarList[matchingIndex].color;
	};

	return (
		<div className='calendar-schedule__event schedule-block'>
			<DateTimeInputs
				dateTime={dateTime}
				setScheduleProps={setScheduleProps}
			/>
			<div className='schedule-input-list'>
				<span>
					<img src={DescIcon} />
				</span>
				<div>
					<input placeholder={'Add description'} />
				</div>
			</div>
			<div className='schedule-input-list'>
				<span>
					<img src={CalendarIcon} />
				</span>
				<div>
					<div>
						<div>
							{/* {defaultDateTime} */}
						</div>
						<select>
							{
								calendarList.map(({ name }, cIndex) => {
									return <option
										key={`calendar-${cIndex + 1}`}
										value={name}>
										{name}
									</option>
								})
							}
						</select>
						<select
							value={defaultCalendarColor()}
							onChange={(e) => setScheduleProps(state => ({
								...state,
								color: e.target.value as COLORS,
							}))}
						>
							<SelectColors />
						</select>
					</div>
				</div>
			</div>
		</div >
	)
}