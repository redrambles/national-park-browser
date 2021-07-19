import React, { useState } from 'react'
import { withAuthenticator } from '@aws-amplify/ui-react'
import { API, Storage } from 'aws-amplify'
import { createPark } from '../src/graphql/mutations'
import config from '../src/aws-exports'
import Head from "next/head"

function CreatePark() {
  const [name, setName] = useState('')
  const [image, setImage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const uploadedImage = await Storage.put(image.name, image) // image.name = key (if big project, you would add hash to keep key unique)
    
    const newPark = await API.graphql({
      query: createPark,
      variables: {
        input: {
          name, 
          image: {
            region: config.aws_user_files_s3_bucket_region,
            bucket: config.aws_user_files_s3_bucket,
            key: uploadedImage.key
          }
        }
      }
    })
    console.log(newPark)
  }

  return (
    <>
    <Head>
      <title>Add New Park</title>
      <link rel="icon" href="/favivon.ico" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tailwindcss/ui@latest/dist/tailwind-ui.min.css"/>
    </Head>
   
    <div className="max-w-3xl mx-auto sm:px-6 lg:px-8 mt-10">
      <form className="mt-5 md:mt-0 md:col-span-2" onSubmit={handleSubmit}>
      <h2 className="mt-4 text-center text-lg">Create a Park</h2>
          <div className="shadow sm:rounded-md sm:overflow-hidden">
            <div className="px-4 py-5 bg-white sm:p-6">
              <label htmlFor="name" className="block text-sm font-medium leading-5 text-gray-700">
                Name
              </label>
              <input
                required
                className="mb-5 mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                type="text" 
                id="name" 
                onChange={(e) => setName(e.target.value)}
              />
              <label htmlFor="image" className="block text-sm font-medium leading-5 text-gray-700">
                Image
              </label>
              <input
                required
                type="file" 
                name="image" 
                id="image" 
                onChange={(e) => setImage(e.target.files[0])}
                className="mb-5 mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              />
              <input
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out"
                value="create"
              />
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default withAuthenticator(CreatePark)