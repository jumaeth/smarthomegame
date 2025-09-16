import {TextStyleFontWeight} from "pixi.js";
import {Texture} from "@pixi/core";

export type TextProps = {text: string, x: number, y: number, fontSize: number, fontWeight: TextStyleFontWeight, wrap?: number}
export type ImageProps = {texture: Texture, x: number, y: number, scale: number}