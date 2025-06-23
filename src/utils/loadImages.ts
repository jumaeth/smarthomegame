export function loadImagesFromFolder(folder: string): Record<string, string> {
  const allImages = import.meta.glob('../assets/*/*.{png,jpg,jpeg}', {
    eager: true,
    import: 'default',
  }) as Record<string, unknown>;

  const filteredImages: Record<string, string> = {};

  for (const [path, mod] of Object.entries(allImages)) {
    if (typeof mod === 'string' && path.includes(`/${folder}/`)) {
      filteredImages[path] = mod;
    }
  }

  return filteredImages;
}
