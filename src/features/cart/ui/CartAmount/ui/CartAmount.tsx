import { useMemo } from 'react';
import s from '../../CartPage.module.css';
import classNames from 'classnames';
import { useAppSelector } from '../../../../../shared/store/utils';
import { cartSelectors } from '../../../../../shared/store/slices/cart';
import { Button } from '../../../../../shared/ui/Button';

export const CartAmount = () => {
	const products = useAppSelector(cartSelectors.getCartProducts);

	const { allPrice, allDiscount, totalPrice } = useMemo(() => {
		const totals = products.reduce(
			(acc, p) => {
				acc.allPrice += p.price * p.count;
				acc.allDiscount += p.discount * p.count;
				return acc;
			},
			{ allPrice: 0, allDiscount: 0 }
		);

		return { ...totals, totalPrice: totals.allPrice - totals.allDiscount };
	}, [products]);

	const handleSubmitCart = () => {
		const order = products.map((p) => ({ id: p.id, count: p.count }));
		console.log(
			'Заказ оформлен. Состав заказа: ',
			JSON.stringify(order, null, 2)
		);
	};

	return (
		<div className={classNames(s['cart-amount'])}>
			<h1 className={classNames(s['cart-amount__title'])}>Ваша корзина</h1>
			<div className={classNames(s['cart-amount__table'])}>
				<div className={classNames(s['cart-amount__table-row'])}>
					<span className={classNames(s['cart-amount__table-title'])}>
						{`Товары (${products.length})`}
					</span>
					<span className={classNames(s['cart-amount__table-value'])}>
						{`${allPrice} ₽`}
					</span>
				</div>
				<div className={classNames(s['cart-amount__table-row'])}>
					<span className={classNames(s['cart-amount__table-title'])}>
						Скидка
					</span>
					<span
						className={classNames(
							s['cart-amount__table-value'],
							s['cart-amount__table-value-discount']
						)}>
						{`${allDiscount} ₽`}
					</span>
				</div>
			</div>
			<div className={classNames(s['cart-amount__total-cost'])}>
				<h2 className={classNames(s['cart-amount__total-cost-title'])}>
					Итого к оплате
				</h2>
				<span className={classNames(s['cart-amount__total-cost-value'])}>
					{`${totalPrice} ₽`}
				</span>
			</div>
			<Button
				onClick={handleSubmitCart}
				variant='primary'
				wide
				className={classNames(s['button'], s['button_type_wide'])}>
				Оформить заказ
			</Button>
		</div>
	);
};
