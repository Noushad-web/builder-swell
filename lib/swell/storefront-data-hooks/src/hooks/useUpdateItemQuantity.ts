import { useContext } from 'react'
import { Context } from '../Context'

import { useGetLineItem } from './useGetLineItem'

export function useUpdateItemQuantity() {
  const { swell, setCart } = useContext(Context)
  const getLineItem = useGetLineItem()

  async function updateItemQuantity(
    itemId: string | number,
    quantity: number
  ) {
    if (itemId == null) {
      throw new Error('Must provide an item id')
    }
    
    if (quantity == null || Number(quantity) < 0) {
      throw new Error('Quantity must be greater than 0')
    }
    
    const lineItem = getLineItem(itemId)

    if (lineItem == null) {
      throw new Error(`Item with id ${itemId} not in cart`)
    }
    let newCart;
    if (quantity == 0 || Number(quantity) == 0) {
      newCart = await swell.cart.removeItem(itemId)
    } else {
      newCart = await swell.cart.updateItem(itemId, { quantity })
    }
    setCart(newCart);
  }

  return updateItemQuantity
}
