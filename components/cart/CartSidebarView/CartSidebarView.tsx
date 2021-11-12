/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react'
import { Themed, jsx, Text, Card, Grid, Divider, NavLink } from 'theme-ui'
import { FC, useEffect, useState } from 'react'
import { Bag } from '@components/icons'
import { useCart, useCheckoutUrl } from '@lib/swell/storefront-data-hooks'
import CartItem from '../CartItem'
import { BuilderComponent, builder } from '@builder.io/react'
import env from '@config/env'
import { getPrice } from '@lib/swell/storefront-data-hooks/src/utils/product'

const CartSidebarView: FC = () => {
  const checkoutUrl = useCheckoutUrl()
  const cart = useCart()
  const subTotal = getPrice(cart?.sub_total, cart?.currency ?? 'USD')
  const total = getPrice(cart?.grand_total, cart?.currency ?? 'USD')
  const shippingTotal = getPrice(cart?.shipment_total, cart?.currency ?? 'USD')
  const taxTotal = getPrice(cart?.tax_total, cart?.currency ?? 'USD')

  const items = cart?.items ?? []
  const isEmpty = items.length === 0
  const [cartUpsell, setCartUpsell] = useState()

  useEffect(() => {
    async function fetchContent() {
      const items = cart?.items || []
      const cartUpsellContent = await builder
        .get('cart-upsell-sidebar', {
          cachebust: env.isDev,
          userAttributes: {
            itemInCart: items.map((item: any) => item.product?.slug),
          } as any,
        })
        .toPromise()
      setCartUpsell(cartUpsellContent)
    }
    fetchContent()
  }, [cart?.items])

  return (
    <Themed.div
      sx={{
        height: '100%',
        overflow: 'auto',
        paddingBottom: 5,
        bg: 'text',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        px: 2,
        color: 'background',
        ...(isEmpty && { justifyContent: 'center' }),
      }}
    >
      {isEmpty ? (
        <>
          <Bag />
          Your cart is empty
          <Text>
            Biscuit oat cake wafer icing ice cream tiramisu pudding cupcake.
          </Text>
        </>
      ) : (
        <>
          {items.map((item: any) => (
            <CartItem
              key={item.id}
              item={item}
              currencyCode={ cart?.currency ?? 'USD'}
            />
          ))}
          <Card sx={{ marginLeft: 'auto', minWidth: '10rem', paddingLeft: 5 }}>
            <Grid gap={1} columns={2} sx={{ my: 3 }}>
              <Text>Subtotal:</Text>
              <Text sx={{ marginLeft: 'auto' }}>{subTotal}</Text>
              <Text>Shipping:</Text>
              <Text sx={{ marginLeft: 'auto' }}>{shippingTotal}</Text>
              <Text>Tax: </Text>
              <Text sx={{ marginLeft: 'auto' }}>{taxTotal}</Text>
            </Grid>

            <Divider />
            <Grid gap={1} columns={2}>
              <Text variant="bold">Estimated Total:</Text>
              <Text variant="bold" sx={{ marginLeft: 'auto' }}>
                {total}
              </Text>
            </Grid>
          </Card>
          <BuilderComponent content={cartUpsell} model="cart-upsell-sidebar" />
          {checkoutUrl && (
            <NavLink
              variant="nav"
              sx={{ width: '100%', m: 2, p: 12, textAlign: 'center' }}
              href={checkoutUrl!}
            >
              Proceed to Checkout
            </NavLink>
          )}
        </>
      )}
    </Themed.div>
  )
}

export default CartSidebarView
