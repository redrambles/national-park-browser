import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { withSSRContext } from 'aws-amplify'
import { listParks } from '../src/graphql/queries'
import { AmplifyS3Image } from '@aws-amplify/ui-react'

export async function getServerSideProps() {
  const SSR = withSSRContext()
  const { data } = await SSR.API.graphql({
    query: listParks
  })

  return {
    props: {
      parks: data.listParks.items
    }
  }
}

export default function Home({ parks }) {
  return (
    <div>
      <Head>
        <title>Parks, National and Otherwise</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
        <h1>All Parks! <Link href='/create-park'>(+)</Link></h1>
        <div className="image-grid">
          { parks.map( park => {
            return (
              <div key={park.id} className="img-square">
                <h2>{park.name}</h2>
                <AmplifyS3Image imgKey={park.image.key} height="200px"/>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
