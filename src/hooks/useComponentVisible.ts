import { useState, useEffect, useRef } from 'react';

type ElementsToRef = HTMLDivElement | HTMLElement | HTMLButtonElement;

// a custom hook that controls the visibility 
// of the referenced component
function useComponentVisible(initialIsVisible: boolean) {
	const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
	const linkRef = useRef<HTMLButtonElement | null>(null);
	const componentRef = useRef<HTMLDivElement | null>(null);

	const handleHideDropdown = (e: KeyboardEvent) => {
		if (e.key !== 'Escape') return;
		setIsComponentVisible(false);
	};
	
	const handleCurrentTarget = (
		ref: React.MutableRefObject<ElementsToRef | null>,
		{ target }: MouseEvent,
	) => {
		if (ref.current != null) {
			return (!ref.current.contains(target as Node))
		}
	}

	const handleClickOutside = (event: MouseEvent) => {
		if (
			componentRef.current &&
			handleCurrentTarget(componentRef, event) &&
			// when somewhat loses the ref to link, allow to untoggle component anyway
			(linkRef.current === null || handleCurrentTarget(linkRef, event))) {
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