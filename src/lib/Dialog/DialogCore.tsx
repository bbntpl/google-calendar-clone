import React, {
	MutableRefObject,
	useContext,
	useEffect,
	useState,
} from 'react';
import Draggable from 'react-draggable';
import { forwardRef } from 'react';
import { WrappedDialogProps } from './index.model';
import './styles.scss';

import MultiplyIcon from '../../assets/icons/multiply.png';
import GlobalContext from '../../context/global/GlobalContext';
import GlobalContextInterface from '../../context/global/index.model';
import useDialogAdjuster from '../../hooks/useDialogAdjuster';

const CloseBtn = ({ eventHandler }: { eventHandler: () => void }) => (
	<button
		className='clear-btn--no-effects close-btn'
		onClick={eventHandler}
	>
		<img className='icon--small' src={MultiplyIcon} />
	</button>
);

const DialogCore = forwardRef<HTMLDivElement, WrappedDialogProps>(
	({ Component, props }, ref) => {
		// eslint-disable-next-line react/display-name
		const { componentProps, dialogProps } = props;
		const {
			delta,
			flags,
			draggableProps,
			eventHandlers,
			stylePosition,
		} = dialogProps;
		const { toggleDialog } = eventHandlers;
		const {
			isCloseable,
			isDraggable,
			isSelfAdjustable,
		} = flags;
		const { handle } = draggableProps;
		const { position: cursorPosition }
			= useContext(GlobalContext) as GlobalContextInterface;

		// state container for dom rect obj
		const [rect, setRect] = useState<DOMRect | null>(null);
		const [windowDim, setWindowDim] = useState({
			width: window.innerWidth,
			height: window.innerHeight,
		});

		// size of the referenced component
		const componentRefSize = {
			width: rect?.width || 0,
			height: rect?.height || 0,
		};

		// custom hooks that adjust the position or behavior of the dialog
		const { adjustedDialogPos, bounds, isPosAdjusted }
			= useDialogAdjuster(
				componentRefSize,
				cursorPosition,
				delta,
				windowDim,
			);

		const componentClassNames = `dialog-inner--${stylePosition} 
		initial-dialog-transition`;

		// auto update window width and height by resize update
		useEffect(() => {
			const resizeWatcher = () => {
				const { innerWidth, innerHeight } = window;
				setWindowDim({
					width: innerWidth,
					height: innerHeight,
				});
			};
			window.addEventListener('resize', resizeWatcher);
			return () => {
				window.removeEventListener('resize', resizeWatcher);
			};
		}, []);

		// check whether ref contains a dom node in current
		useEffect(() => {
			const refCurrent = (ref as MutableRefObject<HTMLDivElement>).current;
			if (refCurrent && !rect) {
				setRect(refCurrent.getBoundingClientRect());
			}
		}, [(ref as MutableRefObject<HTMLDivElement>).current]);

		// remove the specified class name of the component
		// when a certain flag value became positive
		useEffect(() => {
			if (isSelfAdjustable && isPosAdjusted) {
				setTimeout(() => {
					(ref as MutableRefObject<HTMLDivElement>)
						.current.classList.remove('initial-dialog-transition');
				}, 1000);
			}
		}, [isPosAdjusted]);

		return (
			<Draggable
				{...draggableProps}
				positionOffset={
					isSelfAdjustable
						? adjustedDialogPos
						: draggableProps.positionOffset
				}
				bounds={bounds}
			>
				<div ref={ref} className={componentClassNames}>
					{
						(isDraggable || isCloseable) &&
						<div className='row middle-xs handle-wrapper'>
							{isDraggable && <div className={`o-wrapper ${handle?.slice(1)}`} />}
							{isCloseable && <CloseBtn eventHandler={toggleDialog} />}
						</div>
					}
					<div>
						<Component {...componentProps} />
					</div>
				</div>
			</Draggable>
		)
	})

DialogCore.displayName = 'DialogCore';
export default DialogCore;