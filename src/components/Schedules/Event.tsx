import React, { useContext } from 'react';

import ClockIcon from '../../assets/icons/clock.png';
import LocationIcon from '../../assets/icons/location.png';
import DescIcon from '../../assets/icons/menu-vertical.png';
import CalendarIcon from '../../assets/icons/calendar.png';
import GlobalContext from '../../context/global/GlobalContext';
import GlobalContextInterface from '../../context/global/index.model';

export default function Event(): JSX.Element {
	const { calendarList } = useContext(GlobalContext) as GlobalContextInterface;
	return (
		<div className='event-box schedule-modal'>
			<dl>
				<dd>
					<img src={ClockIcon} />
				</dd>
				<dt></dt>
			</dl>
			<dl>
				<dd>
					<img src={LocationIcon} />
				</dd>
				<dt></dt>
			</dl>
			<dl>
				<dd>
					<img src={DescIcon} />
				</dd>
				<dt>
					<input placeholder={'Add location'} />
				</dt>
			</dl>
			<dl>
				<dd>
					<img src={CalendarIcon} />
				</dd>
				<dt>
					<div>
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
				</dt>
			</dl>
		</div>
	)
}