import React from 'react';
import ScheduleTypeSelector from './ScheduleTypeSelector';

interface MainContentProps {
	title: string,
	scheduleType: string
}

export default function ScheduleMainContent(props: MainContentProps) {
	const { title, scheduleType } = props;
	return (
		<>
			<dl>
				<dt></dt>
				<dd>
					<input type='text' placeholder='Add a title' />
				</dd>
			</dl>
			<dl>
				<dt></dt>
				<dd>
				<ScheduleTypeSelector scheduleType={scheduleType} />
				</dd>
			</dl>
		</>
	)
}