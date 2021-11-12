import { useContext, useState, useEffect } from 'react'
import { Context } from '../Context'

export function useCheckoutUrl(): string | null {
  
  const { cart } = useContext(Context)
  if (!cart) {
    return null;
  }

  return cart?.checkout_url;
}
