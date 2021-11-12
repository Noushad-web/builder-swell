import '@assets/main.css'
import 'keen-slider/keen-slider.min.css'

import { FC } from 'react'
import type { AppProps } from 'next/app'

import { builder, Builder } from '@builder.io/react'
import builderConfig from '@config/builder'
builder.init(builderConfig.apiKey)

import '../blocks/ProductGrid/ProductGrid.builder'
import '../blocks/CollectionView/CollectionView.builder'
import '../blocks/ProductView/ProductView.builder'


Builder.register('insertMenu', {
  name: 'Swell Collection Components',
  items: [
    { name: 'CollectionBox', label: 'Collection' },
    { name: 'CollectionView' },
    { name: 'ProductCollectionGrid' },
  ],
})

Builder.register('insertMenu', {
  name: 'Swell Products Components',
  items: [
    { name: 'ProductView' },
    { name: 'ProductBox' },
    { name: 'ProductGrid' }
  ],
})

const Noop: FC = ({ children }) => <>{children}</>

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = (Component as any).Layout || Noop

  return (
    <>
      <Layout pageProps={pageProps}>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}
