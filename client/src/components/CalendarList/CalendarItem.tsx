import { useState } from 'react';
import useComponentVisible from '../../hooks/useComponentVisible';
import { LabelProps } from './index.model';

import './styles.scss';
import MenuVertical from '../../assets/icons/menu-vertical.png';
import MultiplyIcon from '../../assets/icons/multiply.png';

import Alert from '../../lib/Alert/Alert';
import { DialogProps } from '../../lib/Dialog/index.model';
import Dialog from '../../lib/Dialog';
import Options from './Options';
import { createPortal } from 'react-dom';
import { UserAction } from '../../context/StoreContext/index.model';
import {
	useAppConfigUpdater,
} from '../../context/AppConfigContext';

export default function CalendarItem(props: LabelProps): JSX.Element {
	const { recordPosition } = useAppConfigUpdater();
	const { calendarProps, globalContextProps } = props;
	const { dispatchCalendarList } = globalContextProps;
	const { id, selected, colorOption, name, removable } = calendarProps;

	const [showOptions, setShowOptions] = useState(false);
	const [
		alertRef,
		isAlertVisible,
		setIsAlertVisible,
		alertLinkRef,
	] = useComponentVisible();

	const [
		dialogRef,
		isCalendarLblOptsVisible,
		setIsCalendarLblOptsVisible,
		dialogLinkRef,
	] = useComponentVisible();

	const handleToggleCbox = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.stopPropagation();
		dispatchCalendarList({
			type: UserAction.EDIT,
			payload: {
				...calendarProps,
				selected: e.target.checked,
			},
		})
	};

	const deleteCalendar = () => {
		dispatchCalendarList({ type: UserAction.REMOVE, payload: { id } });
		setIsAlertVisible(false);
	};

	// Props that'll be passed to the wrapped component
	const calendarLblOptsProps: DialogProps = {
		componentProps: {
			flags: { options: true, colors: true },
			...props,
		},
		Component: Options,
		delta: { x: 20, y: 0 },
		isSelfAdjustable: true,
		isDialogVisible: isCalendarLblOptsVisible,
		hasInitTransition: true,
		setIsDialogVisible: setIsCalendarLblOptsVisible,
		stylePosition: 'fixed',
	}

	return (
		<>
			<li
				className='row middle-xs start-xs'
				// Display label options when hovered
				onMouseOver={() => setShowOptions(true)}
				onMouseOut={() => setShowOptions(false)}
				style={{ position: 'relative' }}
			>
				<span>
					<input
						type='checkbox'
						style={{ accentColor: colorOption.value }}
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
										ref={alertLinkRef}
										onClick={() => setIsAlertVisible(true)}
										className='clear-btn--no-effects'
									>
										<img className='icon--small' src={MultiplyIcon} />
									</button>
									: null
							}
							<button
								ref={dialogLinkRef}
								onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
									recordPosition(e);
									setIsCalendarLblOptsVisible(visible => !visible);
								}}
								className='clear-btn--no-effects'
							>
								<img className='icon--small' src={MenuVertical} />
							</button>
						</span> : <span />
				}
				<Dialog ref={dialogRef} {...calendarLblOptsProps} />
			</li>
			{
				createPortal(
					<Alert
						ref={alertRef}
						name={`${name}'s `}
						action='delete'
						type='Calendar'
						handleAction={deleteCalendar}
						handleHideComponent={() => setIsAlertVisible(false)}
						isVisible={isAlertVisible}
					/>,
					document.body,
				)
			}
		</>
	)
}