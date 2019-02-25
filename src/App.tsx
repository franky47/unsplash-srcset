import React, { useState, useEffect } from 'react'
import PasteUrlForm, { FormValues } from './components/PasteUrlForm'
import { Container } from 'reactstrap'
import { getImageDataUrl } from './utils/unsplash'
import ImageSandbox from './components/ImageSandbox'

interface Props {}

const App: React.SFC<Props> = () => {
  const [formValues, storeFormValues] = useState<FormValues>({
    url: 'https://unsplash.com/photos/-mUBrTfsu0A'
    // https://unsplash.com/photos/krY-4Yjqo8c    beach rocks
    // https://unsplash.com/photos/-mUBrTfsu0A    train tracks
  })
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    getImageDataUrl(formValues.url)
      .then(setImageUrl)
      .catch(_ => {})
  }, [formValues.url])

  return (
    <main style={{ padding: '3rem 0' }}>
      <Container>
        <PasteUrlForm onSubmit={storeFormValues} />
      </Container>
      {imageUrl && <ImageSandbox imageUrl={imageUrl} />}
    </main>
  )
}

export default App
