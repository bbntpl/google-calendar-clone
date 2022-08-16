import { useContext, useState } from 'react';
import useComponentVisible from '../../../hooks/useComponentVisible';
import GlobalContext from '../../../context/global/GlobalContext';
import GlobalContextInterface, { UserActionType } from '../../../context/global/index.model';
import { LabelProps } from '../index.model';
import { ModalArgs } from '../../../lib/modal/index.model';

import '../styles.scss';
import MenuVertical from '../../../assets/icons/menu-vertical.png';
import MultiplyIcon from '../../../assets/icons/multiply.png';

import Alert from '../../../lib/alert/Alert';
import Modal from '../../../lib/modal';
import Options from './Options';

export default function Label(props: LabelProps): JSX.Element {
	const { recordPos } = useContext(GlobalContext) as GlobalContextInterface;
	const { calendarProps, globalContextProps } = props;
	const { dispatchCalendarList } = globalContextProps;
	const { id, selected, color, name, removable } = calendarProps;

	const [showOptions, setShowOptions] = useState(false);
	const [alertRef, isAlertVisible, setIsAlertVisible] = useComponentVisible(false);
	const [modalRef, isModalVisible, setIsModalVisible] = useComponentVisible(false);

	const handleToggleCbox = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.stopPropagation();
		dispatchCalendarList({
			type: UserActionType.EDIT,
			payload: { id, selected: e.target.checked },
		})
	};

	const removeCalendar = () => {
		dispatchCalendarList({ type: UserActionType.REMOVE, payload: id });
		setIsAlertVisible(false);
	};

	// props to be passed on the wrapped component
	const componentProps: ModalArgs = {
		componentProps: {
			flags: { options: true, colors: true },
			...props,
		},
		Component: Options,
		delta: { x: 20, y: 0 },
		stylePosition: 'fixed',
		isModalVisible,
		setIsModalVisible,
	}

	return (
		<>
			<li
				className='row middle-xs start-xs'
				onMouseOver={() => setShowOptions(true)}
				onMouseOut={() => setShowOptions(false)}
			>
				<span>
					<input
						type='checkbox'
						className={`filter-${color}`}
						checked={selected}
						onChange={handleToggleCbox}
					/>
				</span>
				<div className='calendar-label'>
					<span>{name}</span>
				</div>
				{
					showOptions ?
						<span className='calendar-options row end-xs align-stretch'>
							{
								removable
									? <button
										onClick={() => setIsAlertVisible(true)}
										className='clear-btn--no-effects'
									>
										<img className='icon--small' src={MultiplyIcon} />
									</button>
									: null
							}
							<button
								onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
									recordPos(e);
									setIsModalVisible(true);
								}}
								className='clear-btn--no-effects'
							>
								<img className='icon--small' src={MenuVertical} />
							</button>
						</span> : <span />
				}
			</li>
			{
				isAlertVisible
					? <Alert
						ref={alertRef}
						name={`${name} Calendar`}
						action={'remove'}
						handleAction={removeCalendar}
						handleHideComponent={() => setIsAlertVisible(false)}
					/>
					: null
			}
			<Modal ref={modalRef} {...componentProps} />
		</>
	)
}