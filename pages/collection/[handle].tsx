import type {
  GetStaticPathsContext,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next'
import { useRouter } from 'next/router'
import { Layout } from '@components/common'
import { BuilderComponent, Builder, builder } from '@builder.io/react'
import { resolveSwellContent } from '@lib/resolve-swell-content'
import builderConfig from '@config/builder'
import {
  getCollection,
  getAllCollectionPaths,
} from '@lib/swell/storefront-data-hooks/src/api/operations-swell'
import DefaultErrorPage from 'next/error'
import Head from 'next/head'
import { useThemeUI } from '@theme-ui/core'
import { getLayoutProps } from '@lib/get-layout-props'

builder.init(builderConfig.apiKey!)
Builder.isStatic = true

const builderModel = 'collection-page'

export async function getStaticProps({
  params,
}: GetStaticPropsContext<{ handle: string }>) {
  const collection = await getCollection(builderConfig, {
    handle: params?.handle,
  })

  const page = await resolveSwellContent(builderModel, {
    collectionHandle: params?.handle,
  })

  return {
    props: {
      page: page || null,
      collection: collection || null,
      ...(await getLayoutProps()),
    },
  }
}

export async function getStaticPaths({ locales }: GetStaticPathsContext) {
  const paths = await getAllCollectionPaths(builderConfig)
  return {
    paths: paths.map((path) => `/collection/${path}`),
    fallback: 'blocking',
  }
}

export default function Handle({
  collection,
  page,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  const isLive = !Builder.isEditing && !Builder.isPreviewing
  const { theme } = useThemeUI()
  if (!collection && isLive) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
          <meta name="title"></meta>
        </Head>
        <DefaultErrorPage statusCode={404} />
      </>
    )
  }

  return router.isFallback && isLive ? (
    <h1>Loading...</h1> // TODO (BC) Add Skeleton Views
  ) : (
    <BuilderComponent
      isStatic
      key={collection.id}
      model={builderModel}
      data={{ collection, theme }}
      {...(page && { content: page })}
    />
  )
}

Handle.Layout = Layout
