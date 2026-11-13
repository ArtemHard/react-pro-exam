import { ChangeEvent, useCallback } from 'react';
import { cartActions } from '../../../../../shared/store/slices/cart';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../../shared/store/utils';

const MIN_COUNT = 1;
const MAX_COUNT = 99;

export const useCount = (productId: string) => {
	const dispatch = useDispatch();
	const count = useAppSelector(
		(state) => state.cart.products.find((p) => p.id === productId)?.count ?? 0
	);
	const stock = useAppSelector(
		(state) => state.cart.products.find((p) => p.id === productId)?.stock ?? 0
	);

	const id = productId;
	const handleIncrement = useCallback(() => {
		const newCount = count + 1;
		const validCount = newCount > MAX_COUNT ? MAX_COUNT : newCount;
		dispatch(cartActions.setCartProductCount({ id, count: validCount }));
	}, [count, dispatch, id]);
	const handleDecrement = useCallback(() => {
		if (count <= MIN_COUNT) {
			dispatch(cartActions.deleteCartProduct(id));
			return;
		}

		dispatch(cartActions.setCartProductCount({ id, count: count - 1 }));
	}, [count, dispatch, id]);
	const handleSetCount = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			if (e.target.value === '') {
				return;
			}

			const newCount = +e.target.value;

			if (newCount <= 0) {
				dispatch(cartActions.deleteCartProduct(id));
				return;
			}

			const validCount = newCount > MAX_COUNT ? MAX_COUNT : newCount;
			dispatch(cartActions.setCartProductCount({ id, count: validCount }));
		},
		[dispatch, id]
	);
	return { count, stock, handleSetCount, handleIncrement, handleDecrement };
};
