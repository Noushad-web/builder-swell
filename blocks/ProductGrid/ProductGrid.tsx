/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { FC, useEffect, useState } from 'react'
import { LoadingDots } from '@components/ui'
import { Grid } from '@theme-ui/components'
import { ProductCardProps } from '@components/common/ProductCard'
import { ProductCardDemo, ProductCard } from '@components/common'
import { Product } from '@lib/swell/storefront-data-hooks/src/types'

import {
  getCollection,
  getProduct,
} from '@lib/swell/storefront-data-hooks/src/api/operations-swell'
import builderConfig from '@config/builder'
interface HighlightedCardProps extends Omit<ProductCardProps, 'product'> {
  index: number
}

export interface ProductGridProps {
  products?: any[]
  productsList?: Array<{ product: string }>
  collection?: string | any
  offset: number
  limit: number
  cardProps: Omit<ProductCardProps, 'product'>
  highlightCard?: HighlightedCardProps
}

export const ProductGrid: FC<ProductGridProps> = ({
  products: initialProducts,
  collection,
  productsList,
  offset = 0,
  limit = 10,
  cardProps,
  highlightCard,
}) => {
  const [products, setProducts] = useState(initialProducts || [])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true)
      const promises = productsList!
        .map((entry) => entry.product)
        .filter((handle: string | undefined) => typeof handle === 'string')
        .map(
          async (handle: string) => {
            return await getProduct({ slug: handle })
          }
        )
      const result = await Promise.all(promises)
      setProducts(result)
      setLoading(false)
    }
    if (productsList && !initialProducts) {
      getProducts()
    }
  }, [productsList, initialProducts])

  useEffect(() => {
    const fetchCollection = async () => {
      setLoading(true)
      const result = await getCollection(builderConfig, {
        handle: collection,
      })
      setProducts(result.products)
      setLoading(false)
    }
    if (typeof collection === 'string' && !initialProducts) {
      fetchCollection()
    }
  }, [collection])

  if (loading) {
    return <LoadingDots />
  }
  const ProductComponent: any = process.env.IS_DEMO
    ? ProductCardDemo
    : ProductCard

  return (
    <Grid gap={2} width={['100%', '40%', '24%']}>
      {products.slice(offset, limit).map((product, i) => (
        <ProductComponent
          key={String(product.id) + i}
          {...(highlightCard?.index === i ? highlightCard : cardProps)}
          product={product}
        />
      ))}
    </Grid>
  )
}
