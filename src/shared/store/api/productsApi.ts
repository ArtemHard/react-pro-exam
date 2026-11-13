import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './config';
import { AppDispatch, RootState } from '../types';

export interface IErrorResponse {
	data: { statusCode: number; message: string; error: string };
	status: number;
}

interface ProductsResponse {
	products: Product[];
	length: number;
}

interface SetLikeResponse {
	like: {
		id: string;
		userId: string;
		productId: string;
	};
	message: string;
}
interface DeleteLikeResponse {
	product: {
		id: string;
		userId: string;
		productId: string;
	};
	message: string;
}
interface ProductRequest {
	page: number;
	perPage?: number;
	sort: Sort;
	searchText: string;
}

type LikeAction = 'add' | 'remove';

const changeProductLike = (
	product: Product,
	productId: string,
	userId: string,
	action: LikeAction
) => {
	if (product.id !== productId) {
		return;
	}

	if (action === 'add') {
		if (!product.likes.some((like) => like.userId === userId)) {
			product.likes.push({
				id: `optimistic-${productId}-${userId}`,
				userId,
				productId,
			} as Like);
		}
		return;
	}

	product.likes = product.likes.filter((like) => like.userId !== userId);
};

const patchLikeInCache = (
	productId: string,
	userId: string,
	action: LikeAction,
	dispatch: AppDispatch,
	getState: () => unknown
) => {
	const state = getState() as RootState;
	const patches: { undo: () => void }[] = [];

	Object.values(state.productsApi.queries).forEach((query) => {
		if (query?.endpointName === 'getProducts' && query.originalArgs) {
			patches.push(
				dispatch(
					productsApi.util.updateQueryData(
						'getProducts',
						query.originalArgs as ProductRequest,
						(draft) => {
							draft.products.forEach((product) =>
								changeProductLike(product, productId, userId, action)
							);
						}
					)
				)
			);
		}

		if (query?.endpointName === 'getProduct' && query.originalArgs) {
			patches.push(
				dispatch(
					productsApi.util.updateQueryData(
						'getProduct',
						query.originalArgs as Pick<Product, 'id'>,
						(draft) => {
							changeProductLike(draft, productId, userId, action);
						}
					)
				)
			);
		}
	});

	return patches;
};

export const productsApi = createApi({
	reducerPath: 'productsApi',
	baseQuery: customBaseQuery,
	tagTypes: ['Products'],
	endpoints: (builder) => ({
		getProducts: builder.query<ProductsResponse, ProductRequest>({
			query: ({ searchText: searchTerm, sort, page, perPage }) => {
				return {
					url: '/products',
					params: {
						sort,
						searchTerm: searchTerm.length ? searchTerm : undefined,
						perPage: perPage ? page * perPage : undefined,
					},
				};
			},
			providesTags: [{ type: 'Products', id: 'list' }],
		}),
		getProduct: builder.query<Product, Pick<Product, 'id'>>({
			query: ({ id }) => ({ url: `/products/${id}` }),
			providesTags: (productFromBE) => [
				{ type: 'Products', id: productFromBE?.id },
			],
		}),

		createProduct: builder.mutation<Product, Product>({
			query: (product) => ({
				url: '/products',
				method: 'POST',
				body: product,
			}),
			invalidatesTags: [{ type: 'Products', id: 'list' }],
		}),

		deleteProduct: builder.mutation<Product, Pick<Product, 'id'>>({
			query: ({ id }) => ({
				url: `/products/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (productFromBE) => [
				{ type: 'Products', id: 'list' },
				{ type: 'Products', id: productFromBE?.id },
			],
		}),
		setLikeProduct: builder.mutation<SetLikeResponse, Pick<Product, 'id'>>({
			query: ({ id }) => ({
				url: `/products/${id}/likes`,
				method: 'PUT',
			}),
			async onQueryStarted({ id }, { dispatch, getState, queryFulfilled }) {
				const userId = (getState() as RootState).user.user?.id;

				if (!userId) {
					return;
				}

				const patches = patchLikeInCache(
					id,
					userId,
					'add',
					dispatch as AppDispatch,
					getState
				);

				try {
					await queryFulfilled;
				} catch {
					patches.forEach((patch) => patch.undo());
				}
			},
		}),
		deleteLikeProduct: builder.mutation<
			DeleteLikeResponse,
			Pick<Product, 'id'>
		>({
			query: ({ id }) => ({
				url: `/products/${id}/likes`,
				method: 'DELETE',
			}),
			async onQueryStarted({ id }, { dispatch, getState, queryFulfilled }) {
				const userId = (getState() as RootState).user.user?.id;

				if (!userId) {
					return;
				}

				const patches = patchLikeInCache(
					id,
					userId,
					'remove',
					dispatch as AppDispatch,
					getState
				);

				try {
					await queryFulfilled;
				} catch {
					patches.forEach((patch) => patch.undo());
				}
			},
		}),
	}),
});

export const {
	useGetProductQuery,
	useGetProductsQuery,
	useSetLikeProductMutation,
	useDeleteLikeProductMutation,
} = productsApi;
