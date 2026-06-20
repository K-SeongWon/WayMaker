// 업로드 이미지를 다운스케일한 data URL로 변환(로컬 저장 용량 절약). 브라우저 전용.
export async function fileToDataUrl(file: File, max = 320): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("read failed"));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("decode failed"));
    i.src = dataUrl;
  });

  const scale = Math.min(1, max / Math.max(img.width, img.height));
  if (scale >= 1 && dataUrl.length < 60_000) return dataUrl;

  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, w, h);

  // 투명 보존을 위해 PNG 우선, 너무 크면 JPEG로
  let out = canvas.toDataURL("image/png");
  if (out.length > 120_000) out = canvas.toDataURL("image/jpeg", 0.85);
  return out;
}
