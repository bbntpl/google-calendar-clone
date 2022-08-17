import React, { useContext, useState } from 'react';
import './styles.scss';

import ClockIcon from '../../assets/icons/clock.png';
import LocationIcon from '../../assets/icons/location.png';
import DescIcon from '../../assets/icons/menu-vertical.png';
import CalendarIcon from '../../assets/icons/calendar.png';

import GlobalContext from '../../context/global/GlobalContext';
import GlobalContextInterface from '../../context/global/index.model';
import { EventInterface } from '../../context/global/index.model';
import { uniqueID } from '../../util/reusable-funcs';
import { getDayHours, getShortDate } from '../../util/calendar-arrangement';

export default function Event(): JSX.Element {
	const {
		calendarList,
		defaultDate,
		defaultTimeIndex,
	} = useContext(GlobalContext) as GlobalContextInterface;
	const [evtProps, setEvtProps] = useState({
		calendarId: calendarList[0].id,
		color: calendarList[0].color,
		dateTime: {
			allday: false,
			once: true,
			date: String,
			time: {
				start: getDayHours()[defaultTimeIndex],
				end: getDayHours()[defaultTimeIndex],
			},
			timezone: '',
		},
		description: '',
		id: uniqueID(),
		location: '',
		type: 'event',
	})

	const selectHoursEl = () => {
		return (
			<select>
				{
					getDayHours().map((hour, hourIndex) => {
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
						{
							selectHoursEl();
							selectHoursEl();
						}
					</div>
				</span>
			</div>
			<div className='schedule-input-list'>
				<span>
					<img src={LocationIcon} />
				</span>
				<div>
					<input type='text' placeholder='Add location of the event' />
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
						{defaultDate}
						{defaultTimeIndex}
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
						<select>
							{
								calendarList.map(({ color }, cIndex) => {
									return <option
										key={`calendar-${cIndex + 1}`}
										value={color}>
										{color}
									</option>
								})
							}
						</select>
					</div>
				</div>
			</div>
		</div >
	)
}