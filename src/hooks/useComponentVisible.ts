import {
	useState,
	useEffect,
	useRef,
	RefObject,
} from 'react';

type ElementsToRef = HTMLDivElement | HTMLElement
	| HTMLButtonElement;

// A custom hook that controls the visibility 
// of the referenced component
function useComponentVisible(initialIsVisible: boolean) {
	const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
	const linkRef = useRef<HTMLButtonElement | null>(null);
	// HTMLDivElement || React.Ref<typeof React.Component>
	const componentRef = useRef<HTMLDivElement | null>(null);

	const handleHideDropdown = (e: KeyboardEvent) => {
		if (e.key !== 'Escape') return;
		setIsComponentVisible(false);
	};

	const handleCurrentTarget = (
		ref: RefObject<ElementsToRef | null>,
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
			// When it somewhat loses the ref to link, 
			// it allows to untoggle component anyway
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