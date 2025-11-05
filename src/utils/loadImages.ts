export function loadImagesFromFolder(folder: string): string[] {
  const allImages = import.meta.glob('../assets/*/*.{png,jpg,jpeg}', {
    eager: true,
    import: 'default',
  }) as Record<string, unknown>;

  const filteredImages: [string, string][] = [];

  for (const [path, mod] of Object.entries(allImages)) {
    if (typeof mod === 'string' && path.includes(`/${folder}/`)) {
      filteredImages.push([path, mod]);
    }
  }

  // Sort by filename (numeric if applicable)
  filteredImages.sort(([pathA], [pathB]) => {
    const fileNameA = pathA.split('/').pop() || '';
    const fileNameB = pathB.split('/').pop() || '';
    return fileNameA.localeCompare(fileNameB, undefined, { numeric: true });
  });

  // Return only the sorted URLs
  return filteredImages.map(([, url]) => url);
}
