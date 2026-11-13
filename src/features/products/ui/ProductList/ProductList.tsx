import { WithQuery } from '../../../../shared/store/HOCs/WithQuery';
import { useProducts } from '../../../../shared/store/hooks/useProducts';
import { CardList } from '../CardList';
import { LoadMore } from '../LoadMore';

const CardListWithQuery = WithQuery(CardList);

type ProductListProps = {
	title: string;
	withLoadMore?: boolean;
};

export const ProductList = ({
	title,
	withLoadMore = false,
}: ProductListProps) => {
	const { products, isLoading, isError, error } = useProducts();

	return (
		<>
			<CardListWithQuery
				title={title}
				products={products}
				isLoading={isLoading}
				isError={isError}
				error={error}
			/>
			{withLoadMore && <LoadMore />}
		</>
	);
};
