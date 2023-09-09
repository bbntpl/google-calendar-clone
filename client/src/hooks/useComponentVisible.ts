import {
	useState,
	useEffect,
	useRef,
	RefObject,
} from 'react';
import { ElementsToRef } from '../contexts/index.model';

interface ComponentVisibleHookProps {
	initialVisibility?: boolean
}

// A custom hook that controls the visibility 
// of the referenced component
function useComponentVisible({ initialVisibility = false }:
	ComponentVisibleHookProps = {}) {
	const [isComponentVisible, setIsComponentVisible]
		= useState<boolean>(initialVisibility);
	const linkRef = useRef<HTMLButtonElement | null>(null);
	const componentRef = useRef<ElementsToRef | null>(null);

	const handleHideDropdown = (e: KeyboardEvent) => {
		if (e.key !== 'Escape') return;
		setIsComponentVisible(false);
	};

	const handleCurrentTarget = (
		ref: RefObject<ElementsToRef | HTMLButtonElement | null>,
		{ target }: MouseEvent,
	) => {
		if (ref.current != null) {
			return (!ref.current.contains(target as Node))
		}
	}

	const isAlertElsClicked = (event: MouseEvent) => {
		const clickedElement = event.target as HTMLElement;
		let currentNode: ElementsToRef | HTMLElement | null = clickedElement;
		while (currentNode) {
			if (currentNode.classList.contains('alert')) {
				return true;
			}
			currentNode = currentNode.parentElement;
		}
	}

	const handleClickOutside = (event: MouseEvent) => {

		const clickedWithinComponent = componentRef.current &&
			handleCurrentTarget(componentRef, event);
		const clickedToggleVisibilityBtn
			= linkRef.current === null || handleCurrentTarget(linkRef, event);

		if (clickedWithinComponent && !isAlertElsClicked(event)
			&& clickedToggleVisibilityBtn) {
			setIsComponentVisible(false);
		}
	};

	useEffect(() => {
		document.addEventListener('keydown', handleHideDropdown, true);
		document.addEventListener('click', handleClickOutside, true);
		return () => {
			document.removeEventListener('keydown', handleHideDropdown, true);
			document.removeEventListener('click', handleClickOutside, true);
		};
	});

	return [
		componentRef,
		isComponentVisible,
		setIsComponentVisible,
		linkRef,
	] as const;
}

export default useComponentVisible;