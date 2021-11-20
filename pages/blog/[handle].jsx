import React from 'react'
import { builder } from '@builder.io/sdk'

builder.init('a59fd2b828d34e3897ab5599a7da9d6c')

export const getStaticPaths = async () => {
  const data_array = await builder.getAll('blog', {
    options: {
      noTargeting: true
    }
  })

  return {
    paths: [
      {
        params: { handle: data_array.map( eachItem => eachItem.data.title ).toString() }
      }
    ],
    fallback: false
  }
}

export const getStaticProps = (context) => {
  const url = context.params.handle.toString();
  const data_array = builder.get('blog')

  return {
    props: { 
      data_array
    }
  }
}

const Handle = ({data_array}) => {
  
  console.log('====================================');
  console.log(data_array);
  console.log('====================================');

  return (
    <div>
      dynamic
    </div>
  )
}

export default Handle;
