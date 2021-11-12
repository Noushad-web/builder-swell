import { OptionInput } from '../types'
import { useContext } from 'react'
import { Context } from '../Context'

export function useAddItemToCart() {
  const { swell, setCart } = useContext(Context)
  async function addItemToCart(
    product_id: string,
    quantity: number,
    options?: OptionInput[]
  ) {

    const newCart = await swell.cart.addItem({
      product_id,
      quantity,
      options
    })
    setCart(newCart)
    return newCart
  }

  return addItemToCart
}
