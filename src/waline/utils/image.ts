function isImage(item: DataTransferItem): boolean {
  return item.type.includes('image');
}

export function getImageFromDataTransfer(items: DataTransferItemList): File | null {
  const image = Array.from(items).find(isImage);

  return image ? (image.getAsFile() as File) : null;
}
