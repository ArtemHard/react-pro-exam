import { useNavigate } from 'react-router-dom';
import { WithProtection } from '../../../shared/store/HOCs/WithProtection';
import { ButtonBack } from '../../../shared/ui/ButtonBack';
import { ProductList } from '../../../features/products';

export const FavoritesPage = WithProtection(() => {
	const navigate = useNavigate();

	return (
		<>
			<br />
			<ButtonBack onClick={() => navigate(-1)} />
			<ProductList title='Избранные товары' />
		</>
	);
});
