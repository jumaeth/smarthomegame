// pages.ts
import { CharacterPage } from "@/pixi/components/Tutorial/Pages/CharacterPage.tsx";
import { ScoresPage } from "@/pixi/components/Tutorial/Pages/ScoresPage.tsx";
import { Pages } from "./Pages.ts";
import {PhonePage} from "@/pixi/components/Tutorial/Pages/PhonePage.tsx";

export interface PageProps {
  windowWidth: number;
  windowHeight: number;
  keyControl: Pages;
  setKeyControl: (p: Pages) => void;
  setSpotLightAnimation: (a: number) => void;
}

export const PAGE_COMPONENTS: {
  [Pages.Main]: null;
  [Pages.Character]: React.FunctionComponent<PageProps>;
  [Pages.Scores]: React.FunctionComponent<PageProps>;
  [Pages.Smartphone]: React.FunctionComponent<PageProps>;
} = {
  [Pages.Main]: null,
  [Pages.Character]: CharacterPage,
  [Pages.Scores]: ScoresPage,
  [Pages.Smartphone]: PhonePage
};