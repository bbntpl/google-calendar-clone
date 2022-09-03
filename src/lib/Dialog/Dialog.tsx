import React, { forwardRef } from 'react';
import { DialogProps } from './index.model';

import DialogCore from './DialogCore';

type ComponentToPassRef = HTMLDivElement | null;
const DialogOptions = forwardRef<ComponentToPassRef, DialogProps>(
	(props, ref) => {
		const {
			isCloseable = true,
			componentProps,
			Component,
			// represents change in x or/and y
			delta = { x: 0, y: 0 },
			isDraggable = true,
			isDialogVisible,
			isSelfAdjustable = false,
			hasInitTransition = false,
			positionOffset = null,
			setIsDialogVisible,
			stylePosition = 'fixed',
		} = props;

		// props to be passed on the dialog component
		const dialogProps = {
			delta,
			draggableProps: {
				...(!isDraggable && { disabled: true }),
				handle: '.handle',
				...(positionOffset && { positionOffset }),
			},
			eventHandlers: {
				toggleDialog: () => {
					setIsDialogVisible((visible: boolean) => !visible)
				},
			},
			flags: { 
				isDraggable, 
				isCloseable, 
				isSelfAdjustable,
				hasInitTransition, 
			},
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