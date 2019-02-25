import React, { useState } from 'react'
import ImagePreview from './ImageSandbox/ImagePreview'
import HtmlCodeRenderer from './ImageSandbox/HtmlCodeRenderer'
import { Container, Input, Label, FormGroup, Row, Col } from 'reactstrap'
import { addQueryToUrl } from 'url-transformers'

interface Props {
  imageUrl: string
}

export interface ImageParameters {
  baseUrl: string
  numBreakpoints: number
  minWidth: number
  maxWidth: number
  maxHeight: number
  retina: boolean
  debug: boolean
  enableFocalPoint: boolean
  focalPointX: number
  focalPointY: number
  focalPointZ: number
}

const makeSrcSet = (params: ImageParameters): string => {
  let p = params
  if (p.enableFocalPoint) {
    p = addFocalPoint(p)
  }

  const deltaW = params.maxWidth - params.minWidth
  const stepW = deltaW / params.numBreakpoints
  const widths = Array(params.numBreakpoints + 1)
    .fill(undefined)
    .map((_, i) => Math.round(params.minWidth + i * stepW))
    .sort((a, b) => (a > b ? 1 : -1))

  return widths
    .flatMap(w => {
      let p1 = p
      p1 = setWidth(p1, w)
      p1 = addOptionalText(p1, w.toString())
      if (p.retina) {
        let p2 = p
        p2 = setWidth(p2, w * 2)
        p2 = setRetina(p2)
        p2 = addOptionalText(p2, w.toString() + 'R')
        return [`${p1.baseUrl} ${w}w`, `${p2.baseUrl} ${w * 2}w`]
      } else {
        return [`${p1.baseUrl} ${w}w`]
      }
    })
    .join(', \n')
}

const makeSrc = (params: ImageParameters): string => {
  let p = params
  if (p.enableFocalPoint) {
    p = addFocalPoint(p)
  }
  p = addOptionalText(p, 'src original')
  return p.baseUrl
}

const setWidth = (params: ImageParameters, width: number): ImageParameters => {
  const baseUrl = addQueryToUrl({ url: params.baseUrl })({
    queryToAppend: {
      w: width.toString()
    }
  })
  return {
    ...params,
    baseUrl
  }
}

const setRetina = (params: ImageParameters): ImageParameters => {
  const baseUrl = addQueryToUrl({ url: params.baseUrl })({
    queryToAppend: {
      dpr: '2'
    }
  })
  return {
    ...params,
    baseUrl
  }
}

const addOptionalText = (
  params: ImageParameters,
  text: string
): ImageParameters => {
  const baseUrl = addQueryToUrl({ url: params.baseUrl })({
    queryToAppend: params.debug
      ? {
          txtalign: 'middle,center',
          txtclr: 'fff',
          txtfont: 'helvetica,bold',
          txtsize: '100',
          txtfit: 'max',
          txt: text
        }
      : {}
  })
  return {
    ...params,
    baseUrl
  }
}

const addFocalPoint = (params: ImageParameters): ImageParameters => {
  const baseUrl = addQueryToUrl({ url: params.baseUrl })({
    queryToAppend: {
      fit: 'crop',
      crop: 'focalpoint',
      'fp-x': params.focalPointX.toString(),
      'fp-y': params.focalPointY.toString(),
      'fp-z': params.focalPointZ.toString(),
      'fp-debug': params.debug.toString()
    }
  })
  return {
    ...params,
    baseUrl
  }
}

// --

const ImageSandbox: React.SFC<Props> = ({ imageUrl }) => {
  const [numBreakpoints, setNumBreakpoints] = useState(5)
  const [minWidth, setMinWidth] = useState(300)
  const [maxWidth, setMaxWidth] = useState(600)
  const [maxHeight, setMaxHeight] = useState(400)
  const [enableFocalPoint, setEnableFocalPoint] = useState(false)
  const [focalPointX, setFocalPointX] = useState(0.5)
  const [focalPointY, setFocalPointY] = useState(0.5)
  const [focalPointZ, setFocalPointZ] = useState(1.0)
  const [retina, setRetina] = useState(true)
  const [debug, setDebug] = useState(true)

  const params = {
    baseUrl: imageUrl,
    numBreakpoints,
    minWidth,
    maxWidth,
    maxHeight,
    retina,
    debug,
    enableFocalPoint,
    focalPointX,
    focalPointY,
    focalPointZ
  }
  const srcset = makeSrcSet(params)
  const src = makeSrc(params)

  return (
    <>
      <div
        style={{
          maxWidth,
          margin: '1rem auto'
        }}
      >
        <ImagePreview
          src={src}
          srcset={srcset}
          maxWidth={maxWidth}
          maxHeight={maxHeight}
        />
      </div>
      <Container>
        <div>
          <FormGroup>
            <Label for="numBreakpoints">Breakpoints: {numBreakpoints}</Label>
            <Input
              type="range"
              name="numBreakpoints"
              onChange={e => setNumBreakpoints(parseInt(e.target.value, 10))}
              min={1}
              max={15}
              step={1}
              value={numBreakpoints}
            />
          </FormGroup>

          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="minWidth">Min width</Label>
                <Input
                  type="number"
                  name="minWidth"
                  onChange={e => setMinWidth(parseInt(e.target.value, 10))}
                  value={minWidth}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="maxWidth">Max width</Label>
                <Input
                  type="number"
                  name="maxWidth"
                  onChange={e => setMaxWidth(parseInt(e.target.value, 10))}
                  value={maxWidth}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="maxHeight">Max height</Label>
                <Input
                  type="number"
                  name="maxHeight"
                  onChange={e => setMaxHeight(parseInt(e.target.value, 10))}
                  value={maxHeight}
                />
              </FormGroup>
            </Col>
          </Row>

          <FormGroup check>
            <Label for="enableFocalPoint" check>
              <Input
                type="checkbox"
                name="enableFocalPoint"
                onChange={e => setEnableFocalPoint(e.target.checked)}
                checked={enableFocalPoint}
              />
              Enable Focal Point
            </Label>
          </FormGroup>
          {enableFocalPoint && (
            <Row>
              <Col md={4}>
                <FormGroup>
                  <Label for="focalPointX">Focal Point X: {focalPointX}</Label>
                  <Input
                    type="range"
                    name="focalPointX"
                    min={0}
                    max={1}
                    step={0.001}
                    onChange={e => setFocalPointX(parseFloat(e.target.value))}
                    value={focalPointX}
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="focalPointY">Focal Point Y: {focalPointY}</Label>
                  <Input
                    type="range"
                    name="focalPointY"
                    min={0}
                    max={1}
                    step={0.001}
                    onChange={e => setFocalPointY(parseFloat(e.target.value))}
                    value={focalPointY}
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="focalPointZ">
                    Focal Point Zoom: {focalPointZ}
                  </Label>
                  <Input
                    type="range"
                    name="focalPointZ"
                    min={0.25}
                    max={3}
                    step={0.05}
                    onChange={e => setFocalPointZ(parseFloat(e.target.value))}
                    value={focalPointZ}
                  />
                </FormGroup>
              </Col>
            </Row>
          )}
          <FormGroup check>
            <Label for="retina" check>
              <Input
                type="checkbox"
                name="retina"
                onChange={e => setRetina(e.target.checked)}
                checked={retina}
              />
              Retina (Hi-DPI)
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label for="debug" check>
              <Input
                type="checkbox"
                name="debug"
                onChange={e => setDebug(e.target.checked)}
                checked={debug}
              />
              Debug
            </Label>
          </FormGroup>
        </div>
        <HtmlCodeRenderer src={src} srcset={srcset} />
      </Container>
    </>
  )
}

export default ImageSandbox
