// pages.ts
import { CharacterPage } from "@/pixi/components/Tutorial/Pages/CharacterPage.tsx";
import { ScoresPage } from "@/pixi/components/Tutorial/Pages/ScoresPage.tsx";
import { Pages } from "./Pages.ts";
import {PhonePage} from "@/pixi/components/Tutorial/Pages/PhonePage.tsx";
import {Explanation_1} from "@/pixi/components/Tutorial/Pages/Explanations/Explanation_1.tsx";
import {More_Expl} from "@/pixi/components/Tutorial/Pages/Explanations/More_Expl.tsx";

export interface PageProps {
  windowWidth: number;
  windowHeight: number;
  keyControl: Pages;
  setKeyControl: (p: Pages) => void;
  setNextPage: (a: number) => void;
}

export const PAGE_COMPONENTS: {
  [Pages.MAIN]: null;
  [Pages.CHARACTER]: React.FunctionComponent<PageProps>;
  [Pages.SCORES]: React.FunctionComponent<PageProps>;
  [Pages.SMARTPHONE]: React.FunctionComponent<PageProps>;
  [Pages.EXPLANATION1]: React.FunctionComponent<PageProps>;
  [Pages.MORE_EXPL]: React.FunctionComponent<PageProps>;
} = {
  [Pages.MAIN]: null,
  [Pages.CHARACTER]: CharacterPage,
  [Pages.SCORES]: ScoresPage,
  [Pages.SMARTPHONE]: PhonePage,
  [Pages.EXPLANATION1]: Explanation_1,
  [Pages.MORE_EXPL]: More_Expl
};