import React, { useState } from 'react'
import { Form, Input, Label } from 'reactstrap'

export interface FormValues {
  url: string
}

export interface Props {
  onSubmit: (values: FormValues) => void
}

const ParseUrlForm: React.SFC<Props> = ({ onSubmit }) => {
  const [url, setUrl] = useState('')

  const urlChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value)
  }
  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    onSubmit({ url: url })
  }

  return (
    <Form onSubmit={submit}>
      <Label for="url">Paste the URL to an Unsplash photo :</Label>
      <Input
        type="url"
        name="url"
        placeholder="Unsplash photo URL"
        value={url}
        onChange={urlChanged}
      />
    </Form>
  )
}

export default ParseUrlForm
