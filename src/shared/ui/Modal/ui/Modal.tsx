import { MouseEvent, ReactNode, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import CloseIcon from '@mui/icons-material/Close';
import classNames from 'classnames';
import s from './Modal.module.css';

type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: ReactNode;
	className?: string;
};

const FOCUSABLE_ELEMENTS_SELECTOR = [
	'a[href]',
	'button:not([disabled])',
	'textarea:not([disabled])',
	'input:not([disabled])',
	'select:not([disabled])',
	'[tabindex]:not([tabindex="-1"])',
].join(', ');

export const Modal = ({
	isOpen,
	onClose,
	title,
	children,
	className,
}: ModalProps) => {
	const titleId = useId();
	const dialogRef = useRef<HTMLDivElement>(null);
	const closeButtonRef = useRef<HTMLButtonElement>(null);
	const triggerElementRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		triggerElementRef.current = document.activeElement as HTMLElement | null;
		closeButtonRef.current?.focus();

		return () => {
			const triggerElement = triggerElementRef.current;
			triggerElementRef.current = null;

			if (triggerElement?.isConnected) {
				triggerElement.focus();
			}
		};
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				event.preventDefault();
				onClose();
				return;
			}

			if (event.key !== 'Tab') {
				return;
			}

			const dialog = dialogRef.current;

			if (!dialog) {
				return;
			}

			const focusableElements = Array.from(
				dialog.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS_SELECTOR)
			);

			if (focusableElements.length === 0) {
				event.preventDefault();
				return;
			}

			const firstElement = focusableElements[0];
			const lastElement = focusableElements[focusableElements.length - 1];

			if (event.shiftKey && document.activeElement === firstElement) {
				event.preventDefault();
				lastElement.focus();
				return;
			}

			if (!event.shiftKey && document.activeElement === lastElement) {
				event.preventDefault();
				firstElement.focus();
				return;
			}

			if (!dialog.contains(document.activeElement)) {
				event.preventDefault();
				firstElement.focus();
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen, onClose]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [isOpen]);

	if (!isOpen) {
		return null;
	}

	const portalTarget = document.getElementById('modal-root') ?? document.body;

	const handleOverlayMouseDown = (event: MouseEvent<HTMLDivElement>) => {
		if (event.target === event.currentTarget) {
			onClose();
		}
	};

	return createPortal(
		<div
			role='presentation'
			className={s['overlay']}
			onMouseDown={handleOverlayMouseDown}>
			<div
				ref={dialogRef}
				role='dialog'
				aria-modal='true'
				aria-labelledby={title ? titleId : undefined}
				aria-label={title ? undefined : 'Модальное окно'}
				className={classNames(s['modal'], className)}>
				<button
					ref={closeButtonRef}
					type='button'
					className={s['close']}
					aria-label='Закрыть модальное окно'
					onClick={onClose}>
					<CloseIcon fontSize='inherit' />
				</button>
				{title && (
					<h2 id={titleId} className={s['title']}>
						{title}
					</h2>
				)}
				<div className={s['content']}>{children}</div>
			</div>
		</div>,
		portalTarget
	);
};
