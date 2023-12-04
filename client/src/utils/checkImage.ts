export const checkImage = (url: any) => {
  let img = new Image()
  img.src = url
  return img.width !== 0 && img.height !== 0
}
