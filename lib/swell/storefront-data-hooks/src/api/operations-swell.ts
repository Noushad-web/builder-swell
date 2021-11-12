import swell from 'swell-js'
import swellConfig from '@config/swell'
import image from 'next/image';
import { ProductResult, Product, Image } from '@lib/swell/storefront-data-hooks/src/types'

export interface BuillderConfig {
  apiKey: string
  productsModel: string
  collectionsModel: string
  isDemo?: boolean
}

export interface CollectionProductsQuery {
  handle: string
  limit?: number
  cursor?: string
  apiKey: string
}

function normalizeProduct(product: ProductResult): Product {
  const variants = product.variants?.results ?? [];
  const images = product.images?.map((image: Image) => ({ ...image, src: image.file.url})) ?? []
  return { ...product, variants, images };
}

function normalizeProducts(productResults: ProductResult[]): Product[] {
  return productResults.map((product) => {
    return normalizeProduct(product);
  });
}

export async function searchProducts(
  searchString: string,
  limit = 100,
  offset = 0
) {

  await swell.init(swellConfig.storeId, swellConfig.publicKey)
  const products = await swell.products.list({
    search: searchString,
    limit,
  })
  return products?.results ? normalizeProducts(products?.results) : []
}


export async function getAllProducts(
  // limit = 100,
  // offset = 0
  // TODO: add in these params
) {
  await swell.init(swellConfig.storeId, swellConfig.publicKey)

  const productResults = await swell.products.list()
  return productResults ? normalizeProducts(productResults?.results) : [];
}

export async function getAllProductPaths(
  limit?: number
): Promise<string[]> {
  
  const products: any[] = await getAllProducts()
  return products?.map((entry: any) => entry.slug) || []
}

export async function getProduct(options: { id?: string; slug?: string; withContent?: boolean }
  ) {
    await swell.init(swellConfig.storeId, swellConfig.publicKey)
    if (Boolean(options.id) === Boolean(options.slug)) {
      throw new Error('Either a slug or id is required')
    }
    
  const result = await swell.products.get(options.id || options.slug, { expand: ['variants']});
  return result ? normalizeProduct(result) : null;
}


// TODO: add in collection functions

export async function getAllCollections(
  config: BuillderConfig,
  limit = 20,
  offset = 0,
  fields?: string
) {
  await swell.init(swellConfig.storeId, swellConfig.publicKey)
  const categories = await swell.categories.list({
    // limit
  })
  return categories?.results
}

export async function getAllCollectionPaths(
  config: BuillderConfig,
  limit?: number
): Promise<string[]> {
  const collections: any[] = await getAllCollections(config, limit)
  return collections?.map((entry) => entry.slug) || []
}

export async function getCollection(
  config: BuillderConfig,
  options: {
    id?: string
    handle?: string
    productsQuery?: Omit<CollectionProductsQuery, 'handle'>
  }
) {
  if (Boolean(options.id) === Boolean(options.handle)) {
    throw new Error('Either a handle or id is required')
  }

  const query = options.id || options.handle;
  await swell.init(swellConfig.storeId, swellConfig.publicKey)
  const category = await swell.categories.get(query, { expand: ['products'] })
  const products = category?.products?.results ? normalizeProducts(category?.products?.results) : []
  // const { page, count } = products;
  // TODO: add pagination logic 
  const hasNextPage = false;
  const nextPageCursor = null;
  
  return {
    ...category,
    products,
    nextPageCursor,
    hasNextPage,
  }
}
