// pages.ts
import { CharacterPage } from "@/pixi/components/Tutorial/CharacterPage";
import { Pages } from "./Pages";

export interface PageProps {
  windowWidth: number;
  windowHeight: number;
  keyControl: Pages;
  setKeyControl: (p: Pages) => void;
}

export const PAGE_COMPONENTS: { [Pages.Main]: null; [Pages.Character]: React.FunctionComponent<PageProps> } = {
  [Pages.Main]: null,
  [Pages.Character]: CharacterPage
};