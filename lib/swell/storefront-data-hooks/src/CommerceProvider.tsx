import React, { useState, useEffect } from 'react'
import swell from 'swell-js';
import { Context } from './Context'
import swellConfig from '@config/swell'
import { Cart } from './types'
import useSWR from 'swr'
export interface CommerceProviderProps {
  children: React.ReactNode
}

export function CommerceProvider({
  children,
}: CommerceProviderProps) {
  
  useSWR('swell', async () => {
    await swell.init(swellConfig.storeId, swellConfig.publicKey)
  })
  const [cart, setCart] = useState<Cart | null>(null)

  return (
    <Context.Provider
      value={{
        swell,
        cart,
        setCart
      }}
    >
      {children}
    </Context.Provider>
  )
}
