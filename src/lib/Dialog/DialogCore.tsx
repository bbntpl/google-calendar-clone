import React, {
	MutableRefObject,
	useContext,
	useEffect,
	useState,
	forwardRef,
} from 'react';
import Draggable from 'react-draggable';
import { WrappedDialogProps } from './index.model';
import GlobalContext from '../../context/global/GlobalContext';
import GlobalContextInterface from '../../context/global/index.model';
import useDialogAdjuster from '../../hooks/useDialogAdjuster';

import './styles.scss';
import MultiplyIcon from '../../assets/icons/multiply.png';

import {
	arrayElsToString,
	removeMatchedTxtOnArr,
} from '../../util/reusable-funcs';

const CloseBtn = ({ eventHandler }:
	{
		eventHandler: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
	}) => (
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
			hasInitTransition,
		} = flags;
		const { handle, positionOffset } = draggableProps;
		const { position: cursorPosition }
			= useContext(GlobalContext) as GlobalContextInterface;

		// state container for dom rect obj
		const [rect, setRect] = useState<DOMRect | null>(null);
		const [windowDim, setWindowDim] = useState({
			width: window.innerWidth,
			height: window.innerHeight,
		});
		const [classNames, setClassNames] = useState([
			`dialog-inner--${stylePosition}`,
			hasInitTransition ? 'initial-dialog-transition' : '',
		]);

		// size of the referenced component
		const componentRefSize = {
			width: rect?.width || 0,
			height: rect?.height || 0,
		};
		
		// custom hooks that adjust the position or behavior of the dialog
		const { adjustedDialogPos, bounds, isPosAdjusted }
			= useDialogAdjuster(
				componentRefSize,
				(positionOffset || cursorPosition),
				delta,
				windowDim,
			);

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
				positionOffset={
					isSelfAdjustable
						? adjustedDialogPos
						: positionOffset
				}
				bounds={bounds}
			>
				<div ref={ref} className={arrayElsToString(classNames)}>
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