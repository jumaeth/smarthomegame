import {AlphaFilter, Graphics as PIXIGraphics, TextStyle} from 'pixi.js'
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Button} from "./Button.tsx";
import {useLoadTextures} from "../../hooks/useLoadTextures.tsx";
import {useTypingText} from "../../hooks/useTypingText.tsx";
import {Graphics, Sprite, Text} from '@pixi/react';
import {Devices} from "@/components/cookingGame/Devices.ts";
import {Stages} from "../cookingGame/Stages.ts";
import recipeOpenImg from '@/assets/cooking-sprites/recipeopen.png';
import shelfImg from '@/assets/cooking-sprites/shelf.png';
import wallImg from '@/assets/cooking-sprites/wall.png';
import cookingFieldImg from '@/assets/cooking-sprites/cookingfield.png';
import foodProcessorImg from '@/assets/cooking-sprites/foodprocessor.png';
import microwaveImg from '@/assets/cooking-sprites/microwave.png';
import steamerImg from '@/assets/cooking-sprites/steamer.png';

interface CookingStageProps {
    setStage: (stage: Stages) => void;
    setTotalPoints: React.Dispatch<React.SetStateAction<number>>;
}

export const CookingStage: React.FC<CookingStageProps> = ({setStage, setTotalPoints}) => {

    const [showButton, setShowButton] = useState(false);
    const [page, setPage] = useState(1);
    const [label] = useState("weiter");
    const [showInfo, setShowInfo] = useState(true);
    const [hoveredId, setHoveredId] = useState(Devices.NONE);
    const [allHoverable, setAllHoverable] = useState(true);
    const [selected, setSelected] = useState(Devices.NONE);
    const [infoText, setInfoText] = useState("");
    const [infoTitles, setInfoTitles] = useState("");
    const [infoComment, setInfoComment] = useState("");
    const [retry, setRetry] = useState(false);

    const instruction = "Okay, lass uns ein Gericht daraus machen. \n\n" +
        "Unsere Smartkitchen kann alle Zutaten vorbereiten aber wir müssen die richtige Maschine zum Kochen des Gerichts auswählen";

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
        "Energie", "Berechtigung", "Zeit", "Bedienung"
    ];

    const dataComments = [
        "Integriert in energy monitoring system", // Cookingfield
        "Speichert Vorlieben und gekochte Gerichte", // Food Processor
        "Speichert zeit und verbrauchte Energie",// Microwave
        "Verbindet reglemässig mit cloud für updates" //Steamer
    ];

    const stars = [
        [2, 4, 3, 4], // Cookingfield
        [4, 2, 5, 4], // Food Processor
        [3, 3, 5, 5], // Microwave
        [4, 3, 2, 4]  // Steamer
    ];


    const {textures, loaded} = useLoadTextures(texturePaths);

    const pageUP = () => {
        setPage(prev => prev + 1);
    }

    const {typedText, typingDone, showCursor} = useTypingText(instruction, 35);

    useEffect(() => {
        if (typingDone) {
            const delay = setTimeout(() => {
                setShowButton(true);
            }, 500);

            return () => clearTimeout(delay);
        } else {
            setShowButton(false);
        }
    }, [typingDone]);

    const cookingfield = {id: Devices.COOKINGFIELD, scale: 0.11, x: 185, y: 105, texture: textures.cookingField, action: null};
    const foodprocessor = {id: Devices.FOODPROCESSOR, scale: 0.11, x: 350, y: 105, texture: textures.foodProcessor, action: null};
    const microwave = {id: Devices.MICROWAVE, scale: 0.11, x: 185, y: 245, texture: textures.microwave, action: null};
    const steamer = {id: Devices.STEAMER, scale: 0.1, x: 350, y: 240, texture: textures.steamer, action: null};
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
                total.push("𐄂|");
            } else {
                total.push("𐄂");
            }
        }
        for (let i = 0; i < 5 - s; i++) {
            if (i < 5 - 1 - s) {
                total.push("...|");
            } else {
                total.push("...");
            }
        }
        total.push("]");
        return total.join("");
    }

    useEffect(() => {
        if (hoveredId !== Devices.NONE) {
            const text =
                criterias[0] + ":\n" +
                criterias[1] + ":\n" +
                criterias[2] + ":\n" +
                criterias[3] + ":";
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

    const evaluatePoints = () => {
        let points = 0;
        if (selected !== Devices.NONE) {
            for (let i = 0; i < stars[selected].length; i++) {
                points += (stars[selected][i] * 20 / criterias.length);
            }
        } else {
            points = 0;
        }
        return points;
    }

    const endGame = () => {
        if (selected === Devices.MICROWAVE) {
            setRetry(true);
        } else if (!retry) {
            setRetry(false);
            setTotalPoints((prev: number) => prev + evaluatePoints());
            setStage(Stages.GAME);
        }
    };

    useEffect(() => {
        if (retry) {
            setRetry(false);
            setSelected(Devices.NONE);
            setAllHoverable(true);
            setPage(2);
        }
    }, [retry]);


    const instructionPage = () => {
        console.log("instructionPage: loaded", loaded);
        console.log(textures, "textures is not null");
        if (loaded&&page === 1 && textures.recipeOpen) {
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
                    <Text
                        text={(typedText + (showCursor ? '|' : '')).toUpperCase()}
                        x={75}
                        y={70}
                        style={
                            new TextStyle({
                                fontFamily: 'micro5',
                                fontSize: 32,
                                wordWrap: true,
                                wordWrapWidth: 400,
                            })}
                        anchor={{x: 0, y: 0}}
                    />

                    {(showButton &&
                        <Button
                            x={370}
                            y={275}
                            color={0xdcc08e}
                            lineColor={0x5d3c1a}
                            width={90}
                            height={35}
                            label={label}
                            action={pageUP}
                        />)}
                </>
            )
        }
    }

    const selectionPage = () => {
        console.log("selectionPage: loaded", loaded);

        if (loaded&&page === 2) {
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
                                    fontFamily: 'micro5',
                                    fontSize: 25,
                                    wordWrap: true,
                                    wordWrapWidth: 400,
                                })}
                            anchor={{x: 0, y: 0}}
                        />
                    )}
                    {(showInfo &&
                        <Text
                            text={infoText}
                            x={150 + infoXOffset(hoveredId)}
                            y={30 + infoYOffset(hoveredId)}
                            style={
                                new TextStyle({
                                    fontFamily: 'micro5',
                                    fontSize: 25,
                                    fill: 0xe1eef0,
                                    wordWrap: true,
                                    wordWrapWidth: 400,
                                })}
                            anchor={{x: 0, y: 0}}
                        />
                    )}
                    {(showInfo &&
                        <Text
                            text={infoComment}
                            x={30 + infoXOffset(hoveredId)}
                            y={130 + infoYOffset(hoveredId)}
                            style={
                                new TextStyle({
                                    fontFamily: 'micro5',
                                    fontSize: 25,
                                    fill: 0x3f556b,
                                    wordWrap: true,
                                    wordWrapWidth: 250,
                                })}
                            anchor={{x: 0, y: 0}}
                        />
                    )}
                </>
            )
        }
    }

    const finishButton = () => {
        console.log("finishButton: loaded", loaded);

        if (loaded&&selected !== Devices.NONE) {
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