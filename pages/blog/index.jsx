import React from 'react'
import { builder } from '@builder.io/sdk'
import Link from 'next/link'

builder.init('a59fd2b828d34e3897ab5599a7da9d6c')

export const getStaticProps = async () => {
  const data_array = await builder.getAll('blog', {
  options: {
    noTargeting: true
  }
  })

  return {
    props: {
      data_array
    }
  }
}

const Blog = ({ data_array }) => {
  
  console.clear()
  console.log('====================================');
  console.log(data_array);
  console.log('====================================');
  data_array.map((eachData)=> {
    console.log(encodeURI(eachData.data.title));
  })
 
  return (
    <div>
      {
        data_array.map((eachData, index) => {
          return (
            <div key={index}>
              <hr />
              <Link href={`/blog/${encodeURI(eachData.data.title)}`}>
                <div>
                  <h1>{eachData.data.title}</h1>
                  <h3>{eachData.data.subheading}</h3>
                  <img src={eachData.data.img} alt={eachData.data.title} />
                  <p>{eachData.data.description}</p>
                </div>
              </Link>
              <hr />
            </div>
          )
        })
      }
    </div>
  )
}

export default Blog

