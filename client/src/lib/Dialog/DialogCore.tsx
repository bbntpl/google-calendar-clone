import React, {
	RefObject,
	useEffect,
	useState,
	forwardRef,
} from 'react';
import Draggable from 'react-draggable';

import { WrappedDialogProps } from './index.model';
import { ElementsToRef, Position } from '../../contexts/index.model';
import { useAppConfig } from '../../contexts/AppConfigContext';

import useDialogAdjuster from '../../hooks/useDialogAdjuster';
import {
	removeMatchedTxtOnArr,
} from '../../util/reusable-funcs';

import './styles.scss';
import MultiplyIcon from '../../assets/icons/multiply.png';

type CloseBtnProps = {
	eventHandler: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const CloseBtn = ({ eventHandler }: CloseBtnProps) => (
	<button
		className='clear-btn--no-effects close-btn'
		onClick={eventHandler}
	>
		<img className='icon--small' src={MultiplyIcon} />
	</button>
);

const DialogCore = forwardRef<ElementsToRef, WrappedDialogProps>(
	({ Component, props }, ref) => {
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
			hasInitTransition,
		} = flags;
		const { handle, positionOffset } = draggableProps;
		const { position: cursorPosition } = useAppConfig();

		// If x and y in positionOffset are string then they should be
		// converted to number
		if (positionOffset !== undefined && typeof positionOffset.x !== 'number') {
			positionOffset.x = Number(positionOffset.x) || 0;
		}
		if (positionOffset !== undefined && typeof positionOffset.y !== 'number') {
			positionOffset.y = Number(positionOffset.y) || 0;
		}

		// State container for dom rect obj
		const [rect, setRect] = useState<DOMRect | null>(null);
		const [windowDim, setWindowDim] = useState({
			width: window.innerWidth,
			height: window.innerHeight,
		});
		const [classNames, setClassNames] = useState([
			`dialog-inner--${stylePosition}`,
			hasInitTransition ? 'initial-dialog-transition' : '',
		]);

		// The size of the referenced component
		const componentRefSize = {
			width: rect?.width || 0,
			height: rect?.height || 0,
		};

		// THis is a custom hook that adjusts the position/behavior of the dialog
		const { adjustedDialogPos, bounds, isPosAdjusted }
			= useDialogAdjuster({
				dialogDim: componentRefSize,
				initCursorPos: (positionOffset as Position || cursorPosition),
				delta,
				windowDim,
			});

		// Update the height and width of window when it gets resized
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

		// Check whether ref contains a dom node in its "current" property
		useEffect(() => {
			const refCurrent = (ref as RefObject<ElementsToRef>).current;
			if (refCurrent && !rect) {
				setRect(refCurrent.getBoundingClientRect());
			}
		}, [(ref as RefObject<ElementsToRef>).current]);

		// Remove the specified class name of the component
		// when a certain flag value became positive
		useEffect(() => {
			if (isSelfAdjustable && isPosAdjusted) {
				setTimeout(() => {
					const newClassNames = removeMatchedTxtOnArr(classNames, 'initial-dialog-transition');
					setClassNames(([
						...newClassNames,
					]));
				}, 500);
			}
		}, [isPosAdjusted]);

		return (
			<Draggable
				{...draggableProps}
				positionOffset={isSelfAdjustable ? adjustedDialogPos : positionOffset}
				bounds={bounds}
				nodeRef={ref as RefObject<ElementsToRef>}
				defaultClassName={!isDraggable ? 'react-draggable-transform-none': ''}
			>
				<div ref={ref} className={classNames.join(' ')}>
					{
						(isDraggable || isCloseable) &&
						<div className='row middle-xs handle-wrapper'>
							{isDraggable && <div className={`o-wrapper ${handle?.slice(1)}`} />}
							{isCloseable && <CloseBtn eventHandler={toggleDialog} />}
						</div>
					}
					<Component {...componentProps} />
				</div>
			</Draggable>
		)
	})

DialogCore.displayName = 'DialogCore';
export default DialogCore;