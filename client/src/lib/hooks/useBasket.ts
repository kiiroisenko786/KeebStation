import type { Item } from "../../app/models/basket";
import { useClearBasketMutation, useFetchBasketQuery } from "../../features/basket/basketApi";

export const useBasket = () => {
  const {data: basket} = useFetchBasketQuery();
  const [clearBasket] = useClearBasketMutation();
  
  const subtotal = basket?.items.reduce((total: number, item: Item) => total + item.price * item.quantity, 0) ?? 0;
  // Assuming a flat delivery fee of £5.99 for orders under £100
  const deliveryFee = subtotal > 10000 ? 0 : 599;
  const total = (subtotal + deliveryFee)

  return {basket, subtotal, deliveryFee, total, clearBasket};
}