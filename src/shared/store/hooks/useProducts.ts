import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { userSelectors } from '../slices/user';
import { useAppSelector } from '../utils';
import { isLiked } from '../../utils';
import { productsSelectors } from '../slices/products';
import { useGetProductsQuery } from '../api/productsApi';

export const useProducts = () => {
	const { pathname } = useLocation();

	const { searchText, page, perPage, sort } = useAppSelector(
		productsSelectors.getProductsState
	);

	const isFavoritesPage = pathname === '/favorites';
	const { isLoading, isError, error, data, isFetching } = useGetProductsQuery({
		searchText,
		sort,
		page,
		perPage: isFavoritesPage ? undefined : perPage,
	});

	const rawProducts = data?.products;
	const user = useAppSelector(userSelectors.getUser);
	const userId = user?.id;

	const products = useMemo(() => {
		const list = rawProducts ?? [];

		if (!isFavoritesPage) {
			return list;
		}

		return list.filter((product) => isLiked(product.likes, userId));
	}, [rawProducts, isFavoritesPage, userId]);

	const productsCount = data?.length || 0;

	return {
		products,
		isLoading,
		isError,
		isFetching,
		error,
		productsCount,
	};
};
