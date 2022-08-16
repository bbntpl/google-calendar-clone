import { useState } from 'react';
import {
	UserActionType,
	CalendarLabelType,
	COLORS,
} from '../../../context/global/index.model';
import useComponentVisible from '../../../hooks/useComponentVisible';
import { uniqueID } from '../../../util/reusable-funcs';
import { AddNewCalendarProps, InitCalendarLblProps } from '../index.model';
import { ModalArgs } from '../../../lib/modal/index.model';
import '../styles.scss';


import Modal from '../../../lib/modal';
import Options from './Options';

const initCalendarLblProps: InitCalendarLblProps = {
	name: '',
	color: 'black',
	selected: false,
	removable: true,
}

export default function NewCalendar(props: AddNewCalendarProps) {
	const {
		setShowAddLblBtn,
		calendarList,
		dispatchCalendarList,
		recordPos,
	} = props;

	const [newCalendar, setNewCalendar] = useState(initCalendarLblProps);
	const [modalRef, isModalVisible, setIsModalVisible] = useComponentVisible(false);

	// event handlers
	const addCalendar = () => {
		dispatchCalendarList({
			type: UserActionType.ADD,
			payload: { ...newCalendar, id: uniqueID() },
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

	const handleColorChange = (color: COLORS) => {
		setNewCalendar({ ...newCalendar, color });
	}

	// props to be passed on the reusable modal component
	const componentProps = {
		flags: { options: false, colors: true },
		calendarProps: newCalendar as CalendarLabelType,
		globalContextProps: {
			calendarList,
			dispatchCalendarList,
		},
		eventHandlers: {
			setNewCalendar,
			handleColorChange,
		},
	}

	const modalOptionsProps: ModalArgs = {
		componentProps,
		Component: Options,
		isModalVisible,
		setIsModalVisible,
	}

	return (
		<>
			<li className='row between-xs middle-xs'>
				<input
					placeholder='Add calendar name'
					onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyUp(e)}
					onChange={handleCalendarChange}
				/>
				<button
					className={`${newCalendar.color} rounded-color`}
					onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
						recordPos(e);
						setIsModalVisible(visible => !visible);
					}}
				/>
				<Modal ref={modalRef} {...modalOptionsProps} />
			</li>
		</>
	)
}