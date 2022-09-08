import React from 'react';

import '../styles.scss';

interface DataItemProps {
	readonly condition: boolean;
	readonly icon: string;
	readonly DataElement: React.ComponentType;
}

export default function DataItem(props: DataItemProps) {
	const {
		condition,
		icon,
		DataElement,
	} = props;

	return(
		condition ?
		<div className='schedule-input-list'>
			<span>
				<img src={icon} />
			</span>
			<DataElement />
		</div> : null
	)
}