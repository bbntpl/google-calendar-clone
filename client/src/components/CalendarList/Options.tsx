import {
	EventHandlers,
	WrappedComponentProps,
} from './index.model';

import './styles.scss';
import CheckIcon from '../../assets/icons/check.png';
import {
	ColorOption,
	colorOptions,
} from '../../util/color-options';
import { UserAction } from '../../contexts/StoreContext/index.model';
import { useStore, useStoreUpdater } from '../../contexts/StoreContext';

export default function Options(props: WrappedComponentProps) {
	const {
		flags,
		calendarProps,
		setIsDialogVisible,
		eventHandlers = {} as EventHandlers,
	} = props;
	const { options, colors } = flags;
	const { calendars } = useStore();
	const { dispatchCalendars } = useStoreUpdater();

	const handleChange = (colorOption: ColorOption) => {
		// Update the context if the received calendar props has id
		if (calendarProps.id && Object.keys(eventHandlers).length === 0) {
			dispatchCalendars({
				type: UserAction.EDIT,
				payload: { ...calendarProps, colorOption },
			});
			return;
		}
		// Changing the color prop from the state of the parent
		eventHandlers.handleColorChange?.(colorOption);
	}

	const unselectAllExceptMatchedId = () => {
		calendars.forEach((calendar) => {
			const { id: calendarId } = calendar;
			dispatchCalendars({
				type: UserAction.EDIT,
				payload: {
					...calendar,
					id: calendarId,
					selected: calendarId === calendarProps.id,
				},
			})
		});
		setIsDialogVisible(visible => !visible);
	}

	return (
		<div className='dialog-calendar'>
			<ul className='dialog__options start-xs'>
				{
					options
						? <li>
							<button
								className='o-wrapper'
								onClick={unselectAllExceptMatchedId}
							>
								Only show this calendar
							</button>
						</li>
						: null
				}
			</ul>
			{
				colors ?
					<div className='o-wrapper color-selection'>
						{colorOptions.map((colorOption) => {
							const { color, value } = colorOption;
							const { colorOption: selectedColorOption } = calendarProps;
							const { color: selectedColor } = selectedColorOption
							return (
								<button
									className='rounded-color clear-btn'
									key={`color-${color}`}
									onClick={() => handleChange(colorOption)}
									style={{ backgroundColor: value }}
								>
									{
										color === selectedColor
										&& <div>
											<img className='status--checked' src={CheckIcon} />
										</div>
									}
								</button>)
						})}
					</div> : null
			}
		</div>
	)
}