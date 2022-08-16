/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Dispatch, SetStateAction } from 'react';
import { Position } from '../../context/global/index.model';

type CommonTypes = string | number | boolean | null;

// React-Draggable component types
type DraggableEventHandler = (e: Event, data: DraggableData) => void | false;
type DraggableData = {
	node: HTMLElement,
	// lastX + deltaX === x
	x: number, y: number,
	deltaX: number, deltaY: number,
	lastX: number, lastY: number
};

// https://github.com/react-grid-layout/react-draggable for more info
interface DraggableProps {
	allowAnyClick?: boolean,
	axis?: string,
	bounds?: { left?: number, top?: number, right?: number, bottom?: number } | string,
	cancel?: string,
	defaultClassName?: string,
	defaultClassNameDragging?: string,
	defaultClassNameDragged?: string,
	defaultPosition?: Position,
	disabled?: boolean,
	grid?: [number, number],
	handle: string,
	offsetParent?: HTMLElement,
	onMouseDown?: (e: MouseEvent) => void,
	// Called when dragging starts. If `false` is returned any handler,
	// the action will cancel.
	onStart?: DraggableEventHandler,
	// Called while dragging.
	onDrag?: DraggableEventHandler,
	// Called when dragging stops.
	onStop?: DraggableEventHandler,
	nodeRef?: React.Ref<typeof React.Component>,
	position?: Position,
	positionOffset?: { x: number | string, y: number | string },
	scale?: number
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
	defaultPosition: Position | null,
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
	defaultPosition?: Position | null,
	delta?: Position,
  draggable?: boolean,
	stylePosition?: 'absolute' | 'fixed'
}