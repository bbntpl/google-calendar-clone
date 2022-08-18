import React from 'react';
import ScheduleTypeSelector from './ScheduleTypeSelector';

interface MainContentProps {
	title: string,
	setTitle: (title: string) => void
}

export default function ScheduleMainContent(props: MainContentProps) {
	const { title, setTitle } = props;
	return (
		<>
			<dl>
				<dt></dt>
				<dd>
					<input
						type='text'
						placeholder='Add a title'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</dd>
			</dl>
			<dl>
				<dt></dt>
				<dd>
					<ScheduleTypeSelector />
				</dd>
			</dl>
		</>
	)
}