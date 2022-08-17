import { forwardRef } from 'react';
import './styles.scss';

interface AlertProps {
	handleHideComponent: () => void,
	handleAction: () => void,
	action: string,
	name: string,
}

const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
	const { handleAction, handleHideComponent, action, name } = props;
	return (
		<div className='alert-wrapper flex-centered'>
			<div ref={ref} className='alert'>
				<p>{`Are you sure you want to ${action} ${name}`}</p>
				<span className='btn-container row between-xs'>
					<button
						className='cancel-btn'
						onClick={handleHideComponent}
					>Cancel</button>
					<button
						className='action-btn'
						onClick={handleAction}
					>Remove Calendar</button>
				</span>
			</div>
		</div>
	)
})

Alert.displayName = 'Alert';

export default Alert;