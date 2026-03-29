/** Browser: scaled canvas to JPEG ArrayBuffer for HF Inference POST body. */
export async function canvasToJpegArrayBuffer(canvas: HTMLCanvasElement, quality = 0.92): Promise<ArrayBuffer> {
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b)
        else reject(new Error("to_blob_failed"))
      },
      "image/jpeg",
      quality,
    )
  })
  return blob.arrayBuffer()
}
