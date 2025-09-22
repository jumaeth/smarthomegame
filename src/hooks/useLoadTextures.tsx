import { useEffect, useState } from "react";
import { Assets, Texture } from "pixi.js";

export type TextureMap = { [key: string]: string };
type LoadedTextures = { [key: string]: Texture };

export const useLoadTextures = (texturePaths: TextureMap) => {
  const [textures, setTextures] = useState<LoadedTextures>({});
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<null | Error>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const entries = await Promise.all(
                Object.entries(texturePaths).map(async ([key, path]) => {
                  const existing = Assets.cache.get(path);
                  const tex = existing ?? await Assets.load(path);
                  return [key, tex] as const;
                })
        );

        if (!cancelled) {
          setTextures(Object.fromEntries(entries));
          setLoaded(true);
        }
      } catch (err) {
        if (!cancelled) setError(err as Error);
      }
    };


    load();

    return () => {
      cancelled = true;
    };
  }, [texturePaths]);

  return { textures, loaded, error };
};
