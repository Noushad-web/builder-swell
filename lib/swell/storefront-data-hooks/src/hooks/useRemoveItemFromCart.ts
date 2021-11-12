import { useContext } from 'react'
import { Context } from '../Context'

export function useRemoveItemFromCart() {
  const { swell, setCart } = useContext(Context)
  async function removeItemFromCart(itemId: number | string) {
    if (itemId === '' || itemId == null) {
      throw new Error('ItemId must not be blank or null')
    }
    const newCart = await swell.cart.removeItem(itemId);
    setCart(newCart)
  }

  return removeItemFromCart
}
