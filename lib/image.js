"use client";

// Phone photos are routinely 3–10 MB, which exceeds the request body limit on
// serverless hosts and makes the upload fail before it reaches our API. Draw
// the image to a canvas at a sane size and re-encode it as JPEG so the request
// stays small and fast without a visible quality drop for estimating work.
const MAX_EDGE = 1600;
const JPEG_QUALITY = 0.75;

export function shrinkImage(file, fallbackName = "job-photo") {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read-failed"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("decode-failed"));
      img.onload = () => {
        const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("no-canvas"));
        ctx.drawImage(img, 0, 0, w, h);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("encode-failed"));
            const name =
              (file.name || fallbackName).replace(/\.[^.]+$/, "") + ".jpg";
            resolve({
              file: new File([blob], name, { type: "image/jpeg" }),
              dataUrl: canvas.toDataURL("image/jpeg", JPEG_QUALITY),
            });
          },
          "image/jpeg",
          JPEG_QUALITY
        );
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
