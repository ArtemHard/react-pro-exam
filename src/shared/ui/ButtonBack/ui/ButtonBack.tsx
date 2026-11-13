import { ReactComponent as BackSvg } from './../../../assets/icons/back.svg';

type ButtonBackProps = {
	onClick: () => void;
};

export const ButtonBack = ({ onClick }: ButtonBackProps) => {
	return (
		<button type='button' onClick={onClick}>
			<BackSvg />
		</button>
	);
};
