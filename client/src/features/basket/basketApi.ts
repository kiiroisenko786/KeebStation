import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { Item, type Basket } from "../../app/models/basket";
import type { Product } from "../../app/models/product";

// Typeguard: If the product is a BasketItem, it will have a quantity property
// This is because a (Basket)Item is an item in the basket that has a quantity, while a Product is just a product without quantity. 
function isBasketItem(product: Product | Item): product is Item {
  return (product as Item).quantity !== undefined;
}

export const basketApi = createApi({
  reducerPath: "basketApi",
  baseQuery: baseQueryWithErrorHandling,
  // Tagging the endpoints for cache invalidation
  tagTypes: ["Basket"],
  endpoints: (builder) => ({
    fetchBasket: builder.query<Basket, void>({
      query: () => "/basket",
      providesTags: ["Basket"]
    }),
    addBasketItem: builder.mutation<Basket, {product: Product | Item, quantity: number}>({
      query: ({product, quantity}) => {
        const productId = isBasketItem(product) ? product.productId : product.id;
        return {
          url: `basket?productId=${productId}&quantity=${quantity}`,
          method: "POST"
        }
      },
      // Optimistic update to immediately reflect the change in the UI
      onQueryStarted: async ({product, quantity}, {dispatch, queryFulfilled}) => {
        let isNewBasket = false;
        const patchResult = dispatch(
          basketApi.util.updateQueryData("fetchBasket", undefined, (draft) => {
            // Add typeguard to check if product is an Item or Product
            const productId = isBasketItem(product) ? product.productId : product.id;
            
            // Check if the basket is a new basket (basket has no id)
            if (!draft?.basketId) isNewBasket = true;

            if (!isNewBasket) {
              const existingItem = draft.items.find(item => item.productId === productId);
              if (existingItem) existingItem.quantity += quantity;
              // Had an issue with the item not being serializable, so we ensure to spread the product properties
              else draft.items.push(isBasketItem(product) ? product : {...product, productId: product.id, quantity});
            }
          })
        )

        try {
          await queryFulfilled;
          // Invalidate the Basket cache to ensure the latest data is fetched if the basket was new
          if (isNewBasket) dispatch(basketApi.util.invalidateTags(["Basket"]));
        } catch (error) {
          console.log(error);
          // Rollback the optimistic update if the query fails
          patchResult.undo();
        }
      }
    }),
    removeBasketItem: builder.mutation<void, {productId: number, quantity: number}>({
      query: ({productId, quantity}) => ({
        url: `basket?productId=${productId}&quantity=${quantity}`,
        method: "DELETE"
      }),
      onQueryStarted: async ({productId, quantity}, {dispatch, queryFulfilled}) => {
        const patchResult = dispatch(
          basketApi.util.updateQueryData("fetchBasket", undefined, (draft) => {
            const itemIndex = draft.items.findIndex(item => item.productId === productId);
            if (itemIndex >= 0) {
              draft.items[itemIndex].quantity -= quantity;
              if (draft.items[itemIndex].quantity <= 0) {
                draft.items.splice(itemIndex, 1);
              }
            }
          })
        )
        try {
          await queryFulfilled;
        } catch (error) {
          console.log(error);
          patchResult.undo();
        }
      }
    })
  })
})

export const {useFetchBasketQuery, useAddBasketItemMutation, useRemoveBasketItemMutation} = basketApi;