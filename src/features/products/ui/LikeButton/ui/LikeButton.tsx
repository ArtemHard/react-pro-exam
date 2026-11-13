import { memo, startTransition, useOptimistic } from 'react';
import s from './LikeButton.module.css';
import { ReactComponent as LikeSvg } from '../../../../../shared/assets/icons/like.svg';
import classNames from 'classnames';
import { useAppSelector } from '../../../../../shared/store/utils';
import { userSelectors } from '../../../../../shared/store/slices/user';
import {
	useSetLikeProductMutation,
	useDeleteLikeProductMutation,
} from '../../../../../shared/store/api/productsApi';
import { toast } from 'react-toastify';

const getErrorMessage = (error: unknown) => {
	if (error && typeof error === 'object' && 'data' in error) {
		const data = (error as { data?: { message?: string } }).data;
		if (data?.message) {
			return data.message;
		}
	}

	return 'Не удалось обновить избранное';
};

type TLikeButtonProps = {
	product: Product;
};
export const LikeButton = memo(({ product }: TLikeButtonProps) => {
	const accessToken = useAppSelector(userSelectors.getAccessToken);
	const user = useAppSelector(userSelectors.getUser);

	const [setLike] = useSetLikeProductMutation();
	const [deleteLike] = useDeleteLikeProductMutation();

	const isLike = product?.likes.some((l) => l.userId === user?.id);

	const [optimisticIsLike, setOptimisticIsLike] = useOptimistic(
		isLike,
		(_currentIsLike, nextIsLike: boolean) => nextIsLike
	);

	const toggleLike = () => {
		if (!accessToken) {
			toast.warning('Вы не авторизованы');
			return;
		}

		startTransition(async () => {
			const nextIsLike = !optimisticIsLike;
			setOptimisticIsLike(nextIsLike);

			try {
				const response = nextIsLike
					? await setLike({ id: `${product.id}` })
					: await deleteLike({ id: `${product.id}` });

				if (response.error) {
					toast.error(getErrorMessage(response.error));
				}
			} catch {
				toast.error('Не удалось обновить избранное');
			}
		});
	};

	return (
		<button
			className={classNames(s['card__favorite'], {
				[s['card__favorite_is-active']]: optimisticIsLike,
			})}
			aria-pressed={optimisticIsLike}
			onClick={toggleLike}>
			<LikeSvg />
		</button>
	);
});

LikeButton.displayName = 'LikeButton';
