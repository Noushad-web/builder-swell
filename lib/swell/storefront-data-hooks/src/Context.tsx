import React from 'react'
import { Cart } from './types'

interface ContextShape {
  swell: any
  cart: Cart | null
  setCart: React.Dispatch<React.SetStateAction<Cart | null>>
}

export const Context = React.createContext<ContextShape>({
  swell: null,
  cart: null,
  setCart: () => {
    throw Error('You forgot to wrap this in a Provider object')
  },
})
