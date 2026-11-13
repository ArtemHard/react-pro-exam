import { ProductList } from '../../../features/products';
import { WithProtection } from '../../../shared/store/HOCs/WithProtection';

export const HomePage = WithProtection(() => {
	return <ProductList title='Главная страница' withLoadMore />;
});
