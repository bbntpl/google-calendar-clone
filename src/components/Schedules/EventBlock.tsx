import React, { Dispatch, SetStateAction, useContext, useCallback } from 'react';
import './styles.scss';
import GlobalContext from '../../context/global/GlobalContext';
import GlobalContextInterface, {
	COLORS,
	EventInterface, TaskInterface,
} from '../../context/global/index.model';

import ClockIcon from '../../assets/icons/clock.png';
import LocationIcon from '../../assets/icons/location.png';
import DescIcon from '../../assets/icons/desc.png';
import CalendarIcon from '../../assets/icons/calendar.png';

import {
	COLOR_NAMES,
	getScheduleTimeOptions,
} from '../../util/calendar-arrangement';
import { getIndexByProp } from '../../util/reusable-funcs';

interface ScheduleStates extends EventInterface, TaskInterface { }
interface ScheduleEventProps {
	evtProps: Omit<EventInterface, 'id' | 'type' | 'title'>,
	setScheduleProps: Dispatch<SetStateAction<ScheduleStates>>,
}

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

	const selectHoursEl = () => {
		return (
			<select>
				{
					getScheduleTimeOptions().map(({ hour }, hourIndex) => {
						return (
							<option
								key={`hour-${hourIndex}`}
							>{hour}</option>
						)
					})
				}
			</select>
		)
	}

	return (
		<div className='calendar-schedule__event schedule-block'>
			<div className='schedule-input-list flex-centered'>
				<span>
					<img src={ClockIcon} />
				</span>
				<span>
					<div>
						{/* {getShortDate(dayjsObj())} */}
					</div>
					<div>
						{selectHoursEl()}
						{selectHoursEl()}
					</div>
				</span>
			</div>
			<div className='schedule-input-list'>
				<span>
					<img src={LocationIcon} />
				</span>
				<div>
					<input
						type='text'
						placeholder='Add location of the event'
						value={location}
						onChange={(e) => {
							setScheduleProps(scheduleProps => ({
								...scheduleProps,
								location: e.target.value,
							}));
						}}
					/>
				</div>
			</div>
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
						})) }
						>
							<SelectColors />
						</select>
					</div>
				</div>
			</div>
		</div >
	)
}