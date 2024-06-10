import React, { useState } from 'react';

import useComponentVisible from '../../hooks/useComponentVisible';
import { Calendar } from '../../contexts/StoreContext/types/calendar';
import { UserAction } from '../../contexts/StoreContext/index.model';
import {
	AddNewCalendarProps,
	InitCalendarItemProps,
} from './index.model';

import { DialogProps } from '../../lib/Dialog/index.model';
import Dialog from '../../lib/Dialog';

import './styles.scss';

import Options from './Options';
import {
	ColorOption,
	getColorOption,
} from '../../util/color-options';
import { uniqueID } from '../../util/reusable-funcs';


type NewCalendar = InitCalendarItemProps | Calendar;
const initCalendarItemProps: InitCalendarItemProps = {
	name: '',
	colorOption: getColorOption(),
	selected: false,
	removable: true,
	type: 'default',
}

export default function NewCalendar(props: AddNewCalendarProps) {
	const {
		setShowAddLblBtn,
		dispatchCalendars,
		recordPosition,
	} = props;

	const [newCalendar, setNewCalendar] = useState<NewCalendar>(initCalendarItemProps);
	const [
		dialogRef,
		isDialogVisible,
		setIsDialogVisible,
		dialogLinkRef,
	] = useComponentVisible();

	const addCalendar = () => {
		dispatchCalendars({
			type: UserAction.ADD,
			payload: {
				addedItem: { ...newCalendar, id: uniqueID() },
				whereTo: 'both',
			},
		})
	}

	const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== 'Enter') return
		handleLblInput();
	};

	const handleLblInput = () => {
		addCalendar();
		setShowAddLblBtn(false);
	}

	const handleCalendarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewCalendar({ ...newCalendar, name: e.target.value });
	}

	const handleColorChange = (colorOption: ColorOption) => {
		setNewCalendar({ ...newCalendar, colorOption });
	}

	// Props that'll be passed to the reusable dialog component
	const componentProps = {
		flags: { options: false, colors: true },
		calendarProps: newCalendar,
		eventHandlers: {
			setNewCalendar,
			handleColorChange,
		},
	}

	const dialogProps: DialogProps = {
		componentProps,
		Component: Options,
		isDialogVisible,
		positionOffset: { x: 20, y: 20 },
		setIsDialogVisible,
		stylePosition: 'absolute',
	}

	return (
		<>
			<li className='row between-xs middle-xs'>
				<input
					placeholder='Add calendar name'
					onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyUp(e)}
					onChange={handleCalendarChange}
				/>
				<div style={{ position: 'relative' }}>
					<button
						ref={dialogLinkRef}
						className='rounded-color'
						style={{ backgroundColor: newCalendar.colorOption.value }}
						onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
							recordPosition(e);
							setIsDialogVisible(visible => !visible);
						}}
					/>
					<Dialog ref={dialogRef} {...dialogProps} />
				</div>
			</li>
		</>
	)
}