/** @jsxRuntime classic */
/** @jsx jsx */
import React, { useMemo, useState, useEffect } from 'react'
import { Themed, jsx } from 'theme-ui'
import { Grid, Button } from '@theme-ui/components'
import OptionPicker from '@components/common/OptionPicker'
import { NextSeo } from 'next-seo'
import { useUI } from '@components/ui/context'
import { useAddItemToCart } from '@lib/swell/storefront-data-hooks'
import {
  prepareVariantsWithOptions,
  prepareVariantsImages,
  getPrice,
} from '@lib/swell/storefront-data-hooks/src/utils/product'
import { ImageCarousel, LoadingDots } from '@components/ui'
import ProductLoader from './ProductLoader'
import { OptionInput, OptionValue, ProductOption, Product } from '@lib/swell/storefront-data-hooks/src/types'

export interface ProductProps {
  className?: string
  children?: any
  product: Product
  renderSeo?: boolean
  description?: string
  title?: string
}


const ProductBox: React.FC<ProductProps> = ({
  product,
  renderSeo = true,
  description = product.description,
  title = product.name,
}) => {

  const [loading, setLoading] = useState(false)
  const addItem = useAddItemToCart()

  const formatOptionValues = (values: OptionValue[]) => {
    return values.map(value => value.name);
  }
  const variants = useMemo(
    () => prepareVariantsWithOptions(product),
    [product]
  )

interface Selection extends OptionInput {
  id: string
  name: string
  value: string
}
  
  const options = product?.options;

  const defaultSelections: Selection[] = options?.filter(options => options.values?.length).map((option) => {
    return {
      id: option.values[0].id, name: option.name, value: option.values[0].name
    }
  })


  const images = useMemo(() => prepareVariantsImages(variants, 'color'), [
    variants,
  ])

  function setSelectedVariant() {
    const selectedVariant = variants.find((variant) => {
      return variant.option_value_ids?.every((id: string) => {

        return selections.find(selection => {
          return selection.id==id
        })
      })
    })
    if (selectedVariant) {
      setVariant(selectedVariant)
    }
  }

  const { openSidebar } = useUI()

  const [variant, setVariant] = useState(variants[0] || null)
  const [selections, setSelections] = useState(defaultSelections)
  const [ productOptions, setProductOptions ] = useState(options);

  function inputChangeHandler(option: ProductOption, value: string) {
    const { name, values } = option;
    const id = values.find((optionValue => optionValue.name == value))?.id ?? '';
    const selectionToUpdate = selections.find(selection => {
      return selection.name == name;
    })

    if (selectionToUpdate) {
      selectionToUpdate.value = value
      selectionToUpdate.id = id;

      setSelections(selections)
      setSelectedVariant()
    }
  }

  const addToCart = async () => {
    setLoading(true)
    try {
      await addItem(product.id, 1, selections)
      openSidebar()
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }
  const allImages = images
    .map((image) => ({ src: image.src}))
    .concat(
      product.images &&
        product.images.filter(
          ({ file }) => !images.find((image) => image.file?.url === file?.url)
        ).map(productImage => ({ ...productImage, src: productImage.file?.url ?? 'https://via.placeholder.com/1050x1050' }))
    )

    useEffect(() => {
      setSelections(defaultSelections)
      setSelectedVariant();
    }, [])

  return (
    <React.Fragment>
      {renderSeo && (
        <NextSeo
          title={title}
          description={description}
          openGraph={{
            type: 'website',
            title: title,
            description: description,
            images: [
              {
                url: product.images?.[0]?.file.url!,
                width: 800,
                height: 600,
                alt: title,
              },
            ],
          }}
        />
      )}
      <Grid gap={4} columns={[1, 2]}>
        <div>
          <div
            sx={{
              border: '1px solid gray',
              padding: 2,
              marginBottom: 2,
            }}
          >
            <ImageCarousel
              showZoom
              alt={title}
              width={1050}
              height={1050}
              priority
              // onThumbnailClick={(index) => {
              //   if (images[index]?.color) {
              //     setColor(images[index].color)
              //   }
              // }}
              images={allImages?.length > 0 ? allImages : [{
                  src: `https://via.placeholder.com/1050x1050`,
                }]}
            ></ImageCarousel>
          </div>
        </div>
        <div sx={{ display: 'flex', flexDirection: 'column' }}>
          <span sx={{ mt: 0, mb: 2 }}>
            <Themed.h1>{title}</Themed.h1>
            <Themed.h4 aria-label="price" sx={{ mt: 0, mb: 2 }}>
              {getPrice(variant ? variant?.price : product.price, product.currency ?? 'USD')} 
            </Themed.h4>
          </span>
          <div dangerouslySetInnerHTML={{ __html: description! }} />
          <div>
            {productOptions?.length > 0 && productOptions?.map((option) => {
              return (
              <Grid padding={2} columns={2} key={option.id}>
                {Boolean(option.values?.length) && (
                <OptionPicker
                  key={option.id}
                  name={option.name}
                  options={formatOptionValues(option.values)}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment     
                  // @ts-ignore
                  selected={selections[option.id]}
                  onChange={(event) => {inputChangeHandler(option, event.target.value)}}
                />
              )}
              </Grid>
              )
            })}
          </div>
          <Button
            name="add-to-cart"
            disabled={loading}
            sx={{ margin: 2, display: 'block' }}
            onClick={addToCart}
          >
            Add to Cart {loading && <LoadingDots />}
          </Button>
        </div>
      </Grid>
    </React.Fragment>
  )
}

const ProductView: React.FC<{
  product: string | any
  renderSeo?: boolean
  description?: string
  title?: string
}> = ({ product, ...props }) => {
  return (
    <ProductLoader product={product}>
      {(productObject) => <ProductBox {...props} product={productObject} />}
    </ProductLoader>
  )
}
export default ProductView
