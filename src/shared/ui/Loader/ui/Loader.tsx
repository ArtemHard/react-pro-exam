import classNames from 'classnames';
import s from './Loader.module.css';

type LoaderProps = {
	className?: string;
};

export const Loader = ({ className }: LoaderProps) => {
	return (
		<div className={classNames(s['wrapper'], className)}>
			<div className={s['loader']}>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
};
