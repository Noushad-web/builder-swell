import { builder, Builder } from '@builder.io/react'
import { getAsyncProps } from '@builder.io/utils'
import builderConfig from '@config/builder'
import {
  getCollection,
  getProduct,
} from './swell/storefront-data-hooks/src/api/operations-swell'
builder.init(builderConfig.apiKey)
Builder.isStatic = true

export async function resolveSwellContent(
  modelName: string,
  targetingAttributes?: any
) {
  let page = await builder
    .get(modelName, {
      userAttributes: targetingAttributes,
      includeRefs: true,
      preview: modelName,
      cachebust: true,
    } as any)
    .toPromise()

  if (page) {
    return await getAsyncProps(page, {
      async ProductGrid(props) {
        let products: any[] = []
        if (props.productsList) {
          const promises = props.productsList
            .map((entry: any) => entry.product)
            .filter((handle: string | undefined) => typeof handle === 'string')
            .map(
              async (handle: string) =>
                await getProduct({ slug: handle })
            )
          products = await Promise.all(promises)
        }
        return {
          // resolve the query as `products` for ssr
          // used for example in ProductGrid.tsx as initialProducts
          products,
        }
      },
      async CollectionBox(props) {
        let collection = props.collection
        if (collection && typeof collection === 'string') {
          collection = await getCollection(builderConfig, {
            handle: collection,
          })
        }
        return {
          collection,
        }
      },
      async ProductBox(props) {
        let product = props.product
        if (product && typeof product === 'string') {
          product = await getProduct({
            slug: product,
          })
        }
        return {
          product,
        }
      },

      async ProductCollectionGrid({ collection }) {
        if (collection && typeof collection === 'string') {
          const { products } = await getCollection(builderConfig, {
            handle: collection,
          })
          return {
            products,
          }
        }
      },
    })
  }
  return null
}
