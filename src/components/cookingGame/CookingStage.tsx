import {AlphaFilter, Sprite, Text} from 'pixi.js'
import {useCallback, useEffect, useState} from "react";
import {Button} from "./Button.tsx";
import {useLoadTextures} from "../../hooks/useLoadTextures.tsx";
import {useTypingText} from "../../hooks/useTypingText.tsx";

export const CookingStage = ({setStage, setTotalPoints}) => {

  const [showButton, setShowButton] = useState(false);
  const [page, setPage] = useState(1);
  const [label] = useState("weiter");
  const [showInfo, setShowInfo] = useState(true);
  const [hoveredId, setHoveredId] = useState("");
  const [allHoverable, setAllHoverable] = useState(true);
  const [selected, setSelected] = useState("");
  const [infoText, setInfoText] = useState("");
  const [infoTitles, setInfoTitles] = useState("");
  const [infoComment, setInfoComment] = useState("");
  const [retry, setRetry] = useState(false);

    const instruction = "Okay, lass uns ein Gericht daraus machen. \n\n" +
          "Unsere Smartkitchen kann alle Zutaten vorbereiten aber wir müssen die richtige Maschine zum Kochen des Gerichts auswählen";

  const texturePaths: { [key: string]: string } = {
    recipeopen: "/cooking-sprites/recipeopen.png",
    shelf: "/cooking-sprites/shelf.png",
    wall: "/cooking-sprites/wall.png",
    cookingfield: "/cooking-sprites/cookingfield.png",
    foodprocessor: "/cooking-sprites/foodprocessor.png",
    microwave: "/cooking-sprites/microwave.png",
    steamer: "/cooking-sprites/steamer.png"
  };

  const devices = ["cookingfield", "foodprocessor", "microwave", "steamer"];

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


  const {textures} = useLoadTextures(texturePaths);

  const pageUP = () => {
    setPage(prev => prev +1);
  }

  const { typedText, typingDone, showCursor } = useTypingText(instruction, 35);

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

  const cookingfield             = {id: "cookingfield",scale: 0.11, x: 185, y: 105, texture: textures.cookingfield, action: null};
  const foodprocessor       = {id: "foodprocessor",scale: 0.11, x: 350, y: 105, texture: textures.foodprocessor, action: null};
  const microwave        = {id: "microwave",scale: 0.11, x: 185, y: 245, texture: textures.microwave, action: null};
  const steamer               = {id: "steamer",scale: 0.1, x: 350, y: 240, texture: textures.steamer, action: null};
  const renderElements = [
          cookingfield, foodprocessor, microwave, steamer
  ]


  const [hovered] = useState(false);

  const draw = useCallback((g) => {
    g.clear();
    g.fill(0xacb4bd);
    g.lineStyle(3, 0x3f556b, 1);
    g.roundRect(0, 0, 270, 200, 5);
    g.endFill();
  }, [hovered]);

  const onHover = id =>{
    if (allHoverable) {
      setHoveredId(id);
    }else if(id === selected){
      setHoveredId(id);
    }
  }

  const hoverOut = () =>{
    setHoveredId("");
  }

  useEffect(() => {
    setShowInfo(hoveredId !== "")
  }, [hoveredId]);

  const select = id => {
    if (selected === "") {
      setHoveredId("");
      setSelected(id)
      setAllHoverable(false);
      setShowInfo(false);
    }else if(selected === id){
      setSelected("")
      setAllHoverable(true);
    }
  }

  const filtercondition = id => {
    return hoveredId === id || selected === id ? new AlphaFilter({alpha: 1.2}) :
            hoveredId !== "" &&  hoveredId !== id || selected !== "" && selected !== id ? new AlphaFilter({alpha: 0.4})
                    : null
  }

  const infoYOffset = id => {
    if(devices.indexOf(id) > 1){
      return 100;
    }else{
      return 0;
    }
  }

  const infoXOffset = id => {
    if(devices.indexOf(id) % 2 == 0){
      return 250;
    }else{
      return 0;
    }
  }

  const rating = (id, criteria) => {
    const s = stars[id][criteria];
    const total = ["["]
    for (let i = 0; i < s; i++) {
      if(i < 4){
        total.push("𐄂|");
      }else{
        total.push("𐄂");
      }
    }
    for (let i = 0; i < 5-s; i++) {
      if(i < 5-1-s){
        total.push("...|");
      }else{
        total.push("...");
      }
    }
    total.push("]");
    return total.join("");
  }

  useEffect(() => {
    if(hoveredId !== ""){
      const text =
              criterias[0] +":\n" +
              criterias[1] +":\n"+
              criterias[2] +":\n"+
              criterias[3] +":";
      setInfoTitles(text.toUpperCase());
    }
  }, [hoveredId]);

  useEffect(() => {
    if(hoveredId !== ""){
      const text =
               rating(devices.indexOf(hoveredId), 0) +"\n" +
               rating(devices.indexOf(hoveredId), 1) +"\n" +
               rating(devices.indexOf(hoveredId), 2) +"\n" +
               rating(devices.indexOf(hoveredId), 3) +"\n";
      setInfoText(text);
    }
  }, [hoveredId]);

  useEffect(() => {
    if(hoveredId !== ""){
      const text = dataComments[devices.indexOf(hoveredId)];
      setInfoComment(text.toUpperCase());
    }
  }, [hoveredId]);

  const evaluatePoints = () => {
    let points = 0;
    if (selected != ""){
      for (let i = 0; i < stars[devices.indexOf(selected)].length; i++) {
        points += (stars[devices.indexOf(selected)][i]*20/criterias.length);
      }
    }else{
      points = 0;
    }
    return points;
  }

  const endGame = () => {
    if (selected === devices[2]){
      setRetry(true);
    }else if(!retry){
      setRetry(false);
      setTotalPoints(prev => prev + evaluatePoints());
      setStage("game");
    }
  };

  useEffect(() => {
    if (retry){
      setRetry(false);
      setSelected("");
      setAllHoverable(true);
      setPage(2);
    }
  }, [retry]);


  const instructionPage =  () => {
    if(page === 1){
      return (
              <>
                <Sprite
                        anchor={0.5}
                        eventMode={'static'}
                        scale={0.6}
                        texture={textures.recipeopen}
                        x={273}
                        y={220}
                />
                <Text
                        text={(typedText + (showCursor ? '|' : '')).toUpperCase()}
                        x={75}
                        y={70}
                        style={{
                          fontFamily: 'micro5',
                          fontSize: 32,
                          wordWrap: true,
                          wordWrapWidth: 400,
                        }}
                        anchor={{ x: 0, y: 0 }}
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
    if(page === 2){
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
                        x={273}
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
                                onMouseOver={()=>onHover(object.id)}
                                onMouseOut={()=>hoverOut()}
                                cursor={'pointer'}
                                filters={filtercondition(object.id)}
                                onPointerDown={()=>select(object.id)}
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
                         y={30 +infoYOffset(hoveredId)}
                         style={{
                           fontFamily: 'micro5',
                           fontSize: 25,
                           wordWrap: true,
                           wordWrapWidth: 400,
                         }}
                         anchor={{ x: 0, y: 0 }}
                  />
                )}
                {(showInfo &&
                        <Text
                         text={infoText}
                         x={150 + infoXOffset(hoveredId)}
                         y={30 +infoYOffset(hoveredId)}
                         style={{
                           fontFamily: 'micro5',
                           fontSize: 25,
                           fill: {color: 0xe1eef0},
                           wordWrap: true,
                           wordWrapWidth: 400,
                         }}
                         anchor={{ x: 0, y: 0 }}
                        />
                )}
                {(showInfo &&
                        <Text
                                text={infoComment}
                                x={30 + infoXOffset(hoveredId)}
                                y={130 +infoYOffset(hoveredId)}
                                style={{
                                  fontFamily: 'micro5',
                                  fontSize: 25,
                                  fill: {color: 0x3f556b},
                                  wordWrap: true,
                                  wordWrapWidth: 250,
                                }}
                                anchor={{ x: 0, y: 0 }}
                        />
                )}
              </>
      )
    }
  }

  const finishButton = () => {
    if(selected !== ""){
      return (
              <Button
                      x={230}
                      y={285}
                      color={0xacb4bd}
                      lineColor={0x3f556b}
                      width={90}
                      height={35}
                      label={"Select"}
                      action={()=>endGame()}
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