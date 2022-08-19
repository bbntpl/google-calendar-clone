import { DialogProps } from './index.model';
import React, { forwardRef, MutableRefObject, useContext, useEffect, useState } from 'react';
import GlobalContext from '../../context/global/GlobalContext';
import GlobalContextInterface from '../../context/global/index.model';

import DialogCore from './DialogCore';
import usePositionDialog from '../../hooks/usePositionDialog';

type ComponentToPassRef = HTMLDivElement | null;
const DialogOptions = forwardRef<ComponentToPassRef, DialogProps>(
	(props, ref) => {
		const { position } = useContext(GlobalContext) as GlobalContextInterface;
		const {
			closeable = true,
			componentProps,
			Component,
			defaultPosition = null,
			// represents change in x or/and y
			delta = { x: 0, y: 0 },
			draggable = true,
			isDialogVisible,
			positionOffset = { x: 0, y: 0 },
			setIsDialogVisible,
			stylePosition = 'fixed',
		} = props;

		const [dialogDim, setDialogDim] = useState({ width: 0, height: 0 });
		const cursorPosition = usePositionDialog(position, delta, dialogDim);
		const refCurrent = (ref as MutableRefObject<HTMLDivElement>).current;

		useEffect(() => {
			if (refCurrent) {
				const { clientHeight, clientWidth } = refCurrent;
				setDialogDim({
					width: clientWidth,
					height: clientHeight,
				});
			}
		}, []);

		// props to be passed on the dialog component
		const dialogProps = {
			delta,
			draggableProps: {
				defaultPosition: defaultPosition || cursorPosition,
				...(!draggable && { disabled: true }),
				handle: '.handle',
				...(positionOffset && { positionOffset }),
			},
			eventHandlers: {
				toggleDialog: () => {
					setIsDialogVisible((visible: boolean) => !visible)
				},
			},
			flags: { draggable, closeable },
			stylePosition,
		}

		const componentPropsWithVisibilityControl = {
			...componentProps,
			isDialogVisible,
			setIsDialogVisible,
		}

		const dialogCoreArgs = {
			Component,
			props: {
				componentProps: componentPropsWithVisibilityControl,
				dialogProps,
			},
		};

		return (
			<>
				{
					isDialogVisible
						? <DialogCore ref={ref} {...dialogCoreArgs} />
						: null
				}
			</>
		)
	})

DialogOptions.displayName = 'DialogOptions';

export default DialogOptions;