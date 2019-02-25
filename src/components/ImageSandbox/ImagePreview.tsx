import React from 'react'

interface Props {
  src: string
  srcset: string
  maxWidth: number
  maxHeight: number
}

const ImagePreview: React.SFC<Props> = ({
  src,
  srcset,
  maxWidth,
  maxHeight
}) => {
  return (
    <img
      src={src}
      srcSet={srcset}
      style={{
        maxWidth,
        width: '100%',
        height: maxHeight,
        objectFit: 'cover'
      }}
    />
  )
}

export default ImagePreview
