import React from 'react'

interface Props {
  src: string
  srcset: string
  // maxWidth: number
  // maxHeight: number
}

const HtmlCodeRenderer: React.SFC<Props> = ({ src, srcset }) => {
  return (
    <pre>
      <code>
        {`<img
      src="${src}"
      srcset="${srcset.trim()}"
    />`}
      </code>
    </pre>
  )
}

export default HtmlCodeRenderer
