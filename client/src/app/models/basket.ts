import type { Product } from "./product"

export type Basket = {
  basketId: string
  items: Item[]
  clientSecret?: string
  paymentIntentId?: string
}

// Changed this from Type to Class to allow for constructor initialization
export class Item {
  constructor(product: Product, quantity: number) {
    this.productId = product.id;
    this.name = product.name;
    this.price = product.price;
    this.imageUrl = product.imageUrl;
    this.brand = product.brand;
    this.type = product.type;
    this.quantity = quantity;
  }

  productId: number
  name: string
  price: number
  imageUrl: string
  brand: string
  type: string
  quantity: number
}
