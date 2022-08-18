import { DialogArgs } from './index.model';
import React, { forwardRef } from 'react';

import DialogCore from './DialogCore';

type ComponentToPassRef = HTMLDivElement | null;
const DialogOptions = forwardRef<ComponentToPassRef, DialogArgs>(
	(props, ref) => {
		const {
			closeable = true,
			componentProps,
			Component,
			defaultPosition = { x: 0, y: 0 },
			// represents change in x or/and y
			delta = { x: 0, y: 0 },
			draggable = true,
			isDialogVisible,
			positionOffset = { x: 0, y: 0 },
			setIsDialogVisible,
			stylePosition = 'fixed',
		} = props;

		// props to be passed on the dialog component
		const dialogProps = {
			delta,
			draggableProps: {
				defaultPosition,
				...(draggable && { disabled: true }),
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