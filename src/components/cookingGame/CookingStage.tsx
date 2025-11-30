import { AlphaFilter, Graphics as PIXIGraphics, TextStyle } from 'pixi.js'
import React, { RefObject, useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "./Button.tsx";
import { useLoadTextures } from "../../hooks/useLoadTextures.tsx";
import { Graphics, Sprite, Text } from '@pixi/react';
import { Devices } from "@/components/cookingGame/Devices.ts";
import { Stages } from "../cookingGame/Stages.ts";
import recipeOpenImg from '@/assets/cooking-sprites/recipeopen.png';
import shelfImg from '@/assets/cooking-sprites/shelf.png';
import wallImg from '@/assets/cooking-sprites/wall.png';
import cookingFieldImg from '@/assets/cooking-sprites/cookingfield.png';
import foodProcessorImg from '@/assets/cooking-sprites/foodprocessor.png';
import microwaveImg from '@/assets/cooking-sprites/microwave.png';
import steamerImg from '@/assets/cooking-sprites/steamer.png'
import { t } from "@lingui/core/macro";
import { Score } from "@/components/cookingGame/CookingGameComponent.tsx";

interface CookingStageProps {
    setStage: (stage: Stages) => void;
    setTotalPoints: RefObject<Map<Score, number>>;
}

export const CookingStage: React.FC<CookingStageProps> = ({ setStage, setTotalPoints }) => {

    const [page, setPage] = useState(1);
    const [label] = useState(t`continue`);
    const [showInfo, setShowInfo] = useState(true);
    const [hoveredId, setHoveredId] = useState(Devices.NONE);
    const [allHoverable, setAllHoverable] = useState(true);
    const [selected, setSelected] = useState(Devices.NONE);
    const [infoText, setInfoText] = useState("");
    const [infoTitles, setInfoTitles] = useState("");
    const [infoComment, setInfoComment] = useState("");

    const instruction = t`\nOkay, let's turn this into a dish. \n\nOur smart kitchen can almost prepare the dish on its own, but we still need to pick the right machine to cook it`;

    const texturePaths = useMemo(() => ({
        recipeOpen: recipeOpenImg,
        shelf: shelfImg,
        wall: wallImg,
        cookingField: cookingFieldImg,
        foodProcessor: foodProcessorImg,
        microwave: microwaveImg,
        steamer: steamerImg
    }), []);


    const criterias = [
        t`Energy`, t`Authorization`, t`Time`, t`Operation`
    ];

    const dataComments = [
        t`Integrated into the energy monitoring system`, // Cookingfield
        t`Saves your preferences and prepared dishes`, // Food Processor
        t`Records data on time and energy usage`,// Microwave
        t`Regularly connects to the provider’s cloud for updates` //Steamer
    ];

    const stars = [
        [2, 4, 3, 4], // Cookingfield
        [4, 2, 5, 4], // Food Processor
        [3, 3, 5, 5], // Microwave
        [4, 3, 2, 4]  // Steamer
    ];


    const { textures, loaded } = useLoadTextures(texturePaths);

    const pageUP = () => {
        setPage(prev => prev + 1);
    }


    const cookingfield = { id: Devices.COOKINGFIELD, scale: 0.11, x: 185, y: 105, texture: textures.cookingField, action: null };
    const foodprocessor = { id: Devices.FOODPROCESSOR, scale: 0.11, x: 350, y: 105, texture: textures.foodProcessor, action: null };
    const microwave = { id: Devices.MICROWAVE, scale: 0.11, x: 185, y: 245, texture: textures.microwave, action: null };
    const steamer = { id: Devices.STEAMER, scale: 0.1, x: 350, y: 240, texture: textures.steamer, action: null };
    const renderElements = [
        cookingfield, foodprocessor, microwave, steamer
    ];


    const draw = useCallback((g: PIXIGraphics) => {
        g.clear();
        g.beginFill(0xacb4bd);
        g.lineStyle(3, 0x3f556b, 1);
        g.drawRoundedRect(0, 0, 270, 200, 5);
        g.endFill();
    }, []);

    const onHover = (id: Devices) => {
        if (allHoverable || id === selected) {
            setHoveredId(id);
        }
    }

    const hoverOut = () => {
        setHoveredId(Devices.NONE);
    }

    useEffect(() => {
        setShowInfo(hoveredId !== Devices.NONE)
    }, [hoveredId]);

    const select = (id: Devices) => {
        if (selected === Devices.NONE) {
            setHoveredId(Devices.NONE);
            setSelected(id);
            setAllHoverable(false);
            setShowInfo(false);
        } else if (selected === id) {
            setSelected(Devices.NONE);
            setAllHoverable(true);
        }
    }

    const filtercondition = (id: Devices) => {
        return hoveredId === id || selected === id ? [new AlphaFilter(1.2)] :
            hoveredId !== Devices.NONE && hoveredId !== id || selected !== Devices.NONE && selected !== id ? [new AlphaFilter(0.4)]
                : [];
    }

    const infoYOffset = (id: Devices) => {
        if (id > 1) {
            return 100;
        } else {
            return 0;
        }
    }

    const infoXOffset = (id: Devices) => {
        if (id % 2 == 0) {
            return 250;
        } else {
            return 0;
        }
    }

    const rating = (id: number, criteria: number) => {
        const s = stars[id][criteria];
        const total = ["["];
        for (let i = 0; i < s; i++) {
            if (i < 4) {
                total.push("X|");
            } else {
                total.push("X");
            }
        }
        for (let i = 0; i < 5 - s; i++) {
            if (i < 5 - 1 - s) {
                total.push("  |");
            } else {
                total.push("  ");
            }
        }
        total.push("]");
        return total.join("");
    }

    useEffect(() => {
        if (hoveredId !== Devices.NONE) {
            const text =
                criterias[0] + "\n" +
                criterias[1] + "\n" +
                criterias[2] + "\n" +
                criterias[3] + "\n";
            setInfoTitles(text.toUpperCase());
        }
    }, [hoveredId]);

    useEffect(() => {
        if (hoveredId !== Devices.NONE) {
            const text =
                rating(hoveredId, 0) + "\n" +
                rating(hoveredId, 1) + "\n" +
                rating(hoveredId, 2) + "\n" +
                rating(hoveredId, 3) + "\n";
            setInfoText(text);
        }
    }, [hoveredId]);

    useEffect(() => {
        if (hoveredId !== Devices.NONE) {
            const text = dataComments[hoveredId];
            setInfoComment(text.toUpperCase());
        }
    }, [hoveredId]);

    const endGame = () => {
        const setPoints = setTotalPoints.current;
        const comfort = ((stars[selected][3] - 3) + (stars[selected][2]) - 3) / 2;
        const privacy = stars[selected][1] - 3
        if (setPoints) {
            setPoints.set(Score.Privacy, (setPoints.get(Score.Privacy) ?? 0) + privacy);
            setPoints.set(Score.Comfort, (setPoints.get(Score.Comfort) ?? 0) + comfort);
        }
        setStage(Stages.GAME);
    };


    const instructionPage = () => {
        if (loaded && page === 1 && textures.recipeOpen) {
            return (
                <>
                    <Sprite
                        anchor={0.5}
                        eventMode={'static'}
                        scale={0.6}
                        texture={textures.recipeOpen}
                        x={272}
                        y={220}
                    />
                    {instruction && <Text
                        text={instruction.toUpperCase()}
                        x={75}
                        y={70}
                        style={
                            new TextStyle({
                                fontFamily: 'LoResRegular',
                                fontSize: 24,
                                wordWrap: true,
                                wordWrapWidth: 400,
                            })}
                        anchor={{ x: 0, y: 0 }}
                    />}

                    <Button
                        x={370}
                        y={275}
                        color={0xdcc08e}
                        lineColor={0x5d3c1a}
                        width={90}
                        height={35}
                        label={label}
                        action={pageUP}
                    />
                </>
            )
        }
    }

    const selectionPage = () => {
        if (loaded && page === 2) {
            return (
                <>
                    <Sprite
                        eventMode={'static'}
                        scale={0.7}
                        texture={textures.wall}
                        x={0}
                        y={0}
                    />
                    <Sprite
                        anchor={0.5}
                        eventMode={'static'}
                        scale={0.47}
                        texture={textures.shelf}
                        x={272}
                        y={165}
                    />
                    {renderElements.map((object) => (
                        <Sprite
                            key={object.id}
                            anchor={0.5}
                            eventMode={'static'}
                            scale={object.scale}
                            texture={object.texture}
                            x={object.x}
                            y={object.y}
                            pointerover={() => onHover(object.id)}
                            pointerout={() => hoverOut()}
                            cursor={'pointer'}
                            filters={filtercondition(object.id)}
                            pointerdown={() => select(object.id)}
                        />
                    ))}
                    {(showInfo &&
                        <Graphics
                            x={15 + infoXOffset(hoveredId)}
                            y={15 + infoYOffset(hoveredId)}
                            draw={draw}
                            eventMode={'none'}
                        />)}
                    {(showInfo &&
                        <Text
                            text={infoTitles}
                            x={30 + infoXOffset(hoveredId)}
                            y={30 + infoYOffset(hoveredId)}
                            style={
                                new TextStyle({
                                    fontFamily: 'LoResRegular',
                                    fontSize: 17,
                                    wordWrap: true,
                                    wordWrapWidth: 400,
                                })}
                            anchor={{ x: 0, y: 0 }}
                        />
                    )}
                    {(showInfo &&
                        <Text
                            text={infoText}
                            x={175 + infoXOffset(hoveredId)}
                            y={30 + infoYOffset(hoveredId)}
                            style={
                                new TextStyle({
                                    fontFamily: 'LoResRegular',
                                    fontSize: 17,
                                    fill: 0xe1eef0,
                                    wordWrap: true,
                                    wordWrapWidth: 400,
                                })}
                            anchor={{ x: 0, y: 0 }}
                        />
                    )}
                    {(showInfo &&
                        <Text
                            text={infoComment}
                            x={30 + infoXOffset(hoveredId)}
                            y={130 + infoYOffset(hoveredId)}
                            style={
                                new TextStyle({
                                    fontFamily: 'LoResRegular',
                                    fontSize: 18,
                                    fill: 0x3f556b,
                                    wordWrap: true,
                                    wordWrapWidth: 250,
                                })}
                            anchor={{ x: 0, y: 0 }}
                        />
                    )}
                </>
            )
        }
    }

    const finishButton = () => {
        if (loaded && selected !== Devices.NONE) {
            return (
                <Button
                    x={230}
                    y={285}
                    color={0xacb4bd}
                    lineColor={0x3f556b}
                    width={90}
                    height={35}
                    label={"Select"}
                    action={() => endGame()}
                />
            )
        }
    }


    return (
        <>
            {instructionPage()}
            {selectionPage()}
            {finishButton()}
        </>
    );
};