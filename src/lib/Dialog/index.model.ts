/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Dispatch, SetStateAction } from 'react';
import { DraggableProps } from 'react-draggable';
import { Position } from '../../context/global/index.model';

type CommonTypes = string | number | boolean | null;

interface PositionOffset {
	x: number | string,
	y: number | string
}

interface DialogFlags {
	draggable: boolean,
	closeable: boolean,
}

interface EventHandlers {
	[key: string]: () => void,
}

export interface UseComponentVisibleAsProps {
	isDialogVisible: boolean,
	setIsDialogVisible: Dispatch<SetStateAction<boolean>>,
}

interface ComponentProps {
	[key: string]: CommonTypes | Record<string, any> | any
}

export interface DialogProps {
	delta: Position,
	draggableProps: DraggableProps,
	flags: DialogFlags,
	eventHandlers: EventHandlers,
	stylePosition: string,
}

export interface ComponentWithVisibleControl extends
	ComponentProps, UseComponentVisibleAsProps { }

interface DialogAndWrappedComponentProps {
	componentProps: ComponentWithVisibleControl,
	dialogProps: DialogProps,
}

export interface DialogCoreArgs {
	Component: (props: any) => JSX.Element,
	props: DialogAndWrappedComponentProps,
}

export interface DialogArgs extends
	UseComponentVisibleAsProps {
	componentProps: ComponentProps,
	Component: (props: any) => JSX.Element,
	closeable?: boolean,
	defaultPosition?: DraggableProps['defaultPosition'],
	delta?: Position,
  draggable?: boolean,
	positionOffset?: DraggableProps['positionOffset'],
	stylePosition?: 'absolute' | 'fixed'
}