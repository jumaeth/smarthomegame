export function loadImagesFromFolder(folder: string): Record<string, string> {
  const allImages = import.meta.glob('../assets/*/*.{png,jpg,jpeg}', {
    eager: true,
    import: 'default',
  }) as Record<string, string>;
  const filteredImages: Record<string, string> = {};
  for (const [path, mod] of Object.entries(allImages)) {
    if (path.includes(`${folder}`)) {
      filteredImages[path] = mod;
    }
  }
  return filteredImages;
}
