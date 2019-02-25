export const getImageDataUrl = (imageUrl: string): Promise<string> => {
  const url =
    'https://wt-92cccbcf027a1b4070443ff04b9033cc-0.sandbox.auth0-extend.com/unsplash-scrset'
  return fetch(`${url}?url=${imageUrl}`)
    .then(res => res.json())
    .then(img => img.urls.full)
    .catch(console.error)
}
