export default function imageEncode(image) {
  let stringImage = Buffer.from(image.data.data, "binary").toString("base64");
  let data = `data:${image.contentType};base64,${stringImage}`;
  return data;
}
