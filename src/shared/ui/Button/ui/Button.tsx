import { ButtonHTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';
import s from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'light' | 'border';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: ButtonVariant;
	wide?: boolean;
	size?: 'default' | 'large';
	children: ReactNode;
};

export const Button = ({
	variant = 'primary',
	wide = false,
	size = 'default',
	className,
	type = 'button',
	children,
	...rest
}: ButtonProps) => {
	return (
		<button
			type={type}
			className={classNames(
				s['button'],
				s[`button_type_${variant}`],
				{
					[s['button_type_wide']]: wide,
					[s['button_size_large']]: size === 'large',
				},
				className
			)}
			{...rest}>
			{children}
		</button>
	);
};
