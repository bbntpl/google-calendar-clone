import { forwardRef } from 'react';
import './styles.scss';

interface AlertProps {
	handleHideComponent: () => void;
	handleAction: () => void;
	action: string;
	name: string;
	type: string,
	isVisible: boolean;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
	const {
		handleAction,
		handleHideComponent,
		action,
		type,
		name,
		isVisible,
	} = props;
	return (
		isVisible
			? <div className='alert-wrapper flex-centered'>
				<div ref={ref} className='alert'>
					<p>
						{`Are you sure you want to ${action} the`}
						<b> {name} </b>
						{`${type} ?`}
					</p>
					<span className='btn-container row between-xs'>
						<button
							className='cancel-btn'
							onClick={handleHideComponent}
						>Cancel</button>
						<button
							className='action-btn'
							onClick={handleAction}
						>{`${action.toUpperCase()} ${type.toUpperCase()}`}</button>
					</span>
				</div>
			</div>
			: null
	)
})

Alert.displayName = 'Alert';

export default Alert;