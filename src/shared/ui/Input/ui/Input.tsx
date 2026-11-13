import { InputHTMLAttributes, forwardRef } from 'react';
import classNames from 'classnames';
import s from './Input.module.css';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
	isError?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, isError = false, ...rest }, ref) => {
		return (
			<input
				ref={ref}
				className={classNames(
					s['input'],
					{ [s['input_error']]: isError },
					className
				)}
				{...rest}
			/>
		);
	}
);

Input.displayName = 'Input';
