// pages.ts
import { CharacterPage } from "@/pixi/components/Tutorial/Pages/CharacterPage.tsx";
import { ScoresPage } from "@/pixi/components/Tutorial/Pages/ScoresPage.tsx";
import { Pages } from "./Pages.ts";
import {PhonePage} from "@/pixi/components/Tutorial/Pages/PhonePage.tsx";
import {Decision} from "@/pixi/components/Tutorial/Pages/Explanations/Decision.tsx";
import {More_Expl} from "@/pixi/components/Tutorial/Pages/Explanations/More_Expl.tsx";
import {InteractivePixiElement} from "@/objects/InteractivePixiElement.ts";
import {More_Expl_SD} from "@/pixi/components/Tutorial/Pages/Explanations/More_Expl_SD.tsx";
import {GameService} from "@/services/GameService.ts";
import {Score_Changes} from "@/pixi/components/Tutorial/Pages/Explanations/Score_Changes.tsx";
import {Final_Message} from "@/pixi/components/Tutorial/Pages/Explanations/Final_Message.tsx";

export interface PageProps {
  windowWidth: number;
  windowHeight: number;
  keyControl: Pages;
  setKeyControl: (p: Pages) => void;
  setNextPage: (a: number) => void;
  interactiveElements?: InteractivePixiElement[];
  gameService?: GameService;
}

export const PAGE_COMPONENTS: {
  [Pages.MAIN]: null;
  [Pages.CHARACTER]: React.FunctionComponent<PageProps>;
  [Pages.SCORES]: React.FunctionComponent<PageProps>;
  [Pages.SMARTPHONE]: React.FunctionComponent<PageProps>;
  [Pages.DECISION]: React.FunctionComponent<PageProps>;
  [Pages.MORE_EXPL]: React.FunctionComponent<PageProps>;
  [Pages.More_Expl_SD]: React.FunctionComponent<PageProps>;
  [Pages.SCORE_CHANGES]: React.FunctionComponent<PageProps>;
  [Pages.FINAL_MESSAGE]: React.FunctionComponent<PageProps>;

} = {
  [Pages.MAIN]: null,
  [Pages.CHARACTER]: CharacterPage,
  [Pages.SCORES]: ScoresPage,
  [Pages.SMARTPHONE]: PhonePage,
  [Pages.DECISION]: Decision,
  [Pages.MORE_EXPL]: More_Expl,
  [Pages.More_Expl_SD]: More_Expl_SD,
  [Pages.SCORE_CHANGES]: Score_Changes,
  [Pages.FINAL_MESSAGE]: Final_Message
};