import s from '../CartPage.module.css';
import classNames from 'classnames';
import { useAppSelector } from '../../../../shared/store/utils';
import { cartSelectors } from '../../../../shared/store/slices/cart';
import { CartList } from '../CartList';
import { CartAmount } from '../CartAmount';

export const Cart = () => {
	const products = useAppSelector(cartSelectors.getCartProducts);

	if (!products.length) {
		return <h1 className='header-title'>В корзине пока ничего нет</h1>;
	}

	return (
		<div className={classNames(s['content'], s['container'])}>
			<div className={classNames(s['content-cart'])}>
				<div className={classNames(s['cart-title'])}>
					<span>{products.length}</span> товара
				</div>
				<CartList />
				<CartAmount />
			</div>
		</div>
	);
};
