import {useCallback, useEffect, useRef, useState} from "react";
import {useGameService} from "@/hooks/useGameService";
import {calculateCanvasSize} from "@/utils/movment.ts";
import {MapKey} from "@/types/maps.ts";
import {LEVEL_COLLISION_MAPS} from "@/pixi/constants/levels/level-collision-maps.ts";
import {Stage} from "@pixi/react";
import {MainContainer} from "@/pixi/container/MainContainer.tsx";
import {InteractivePixiElement} from "@/objects/InteractivePixiElement.ts";
import {ModalWrapperComponent} from "@/components/ModalWrapperComponent.tsx";
import {SmartHomeHub} from "@/components/smart-devices/SmartHomeHub.tsx";
import { SmartDevice } from "@/objects/SmartDevice";

export const Kitchen = () => {
    const gameService = useGameService();
    const roomName = "kitchen"; //ToDo find better way to match with GameService
    const [isPaused, setIsPaused] = useState(false);

    const smartHomeHubModalRef = useRef<{ toggleModal: () => void }>(null);
    const devices = gameService.getDeviceForRoom(roomName).map((device: SmartDevice) => device.name);
    let isSmartHomeHubCompleted: boolean = false;


    const checkForCompletion = () => {
        if ((!devices.includes("SmartHomeHub") || isSmartHomeHubCompleted)) {
            console.log("Kitchen erfolgreich abgeschlossen!");
            gameService.completeRoom(roomName);
        } else {
            console.log("Kitchen nicht bestanden.");
        }
    };

    const smartHomeHubCallback = (isCompleted: boolean) => {
        isSmartHomeHubCompleted = isCompleted;
        setIsPaused(false);
        smartHomeHubModalRef.current?.toggleModal();
        checkForCompletion();
    };

    const openSmartHomeHub = () => {
        if (smartHomeHubModalRef.current) {
            setIsPaused(true)
            smartHomeHubModalRef.current.toggleModal();
        }
    }

    const interactiveElements = [
        new InteractivePixiElement(1, 6, 1, 1, openSmartHomeHub)
    ]

    //Render Code
    //ToDo check to remove duplicated code in other rooms
    const [canvasSize, setCanvasSize] = useState(calculateCanvasSize());
    const collisionMap = LEVEL_COLLISION_MAPS[roomName];

    const updateCanvasSize = useCallback(() => {
        setCanvasSize(calculateCanvasSize());
    }, [])


    function handleMapChange(newMap: MapKey): boolean {
        //Todo remove
        console.log("Map changed to:", newMap);
        return gameService.leaveRoom(roomName);
    }

    function onModalClose() {
        setIsPaused(false);
    }

    useEffect(() => {
        window.addEventListener("resize", updateCanvasSize);
        return () => {
            window.removeEventListener("resize", updateCanvasSize);
        }
    }, [updateCanvasSize, collisionMap])

    return (
        <>
            <div>
                {devices.includes("SmartHomeHub") && (
                    <ModalWrapperComponent
                        ref={smartHomeHubModalRef}
                        content={<SmartHomeHub onCompletion={smartHomeHubCallback}/>}
                        onClose={onModalClose}
                    />
                )}
            </div>
            <Stage width={canvasSize.width} height={canvasSize.height}>
                <MainContainer
                    canvasSize={canvasSize}
                    map={roomName}
                    collisionMap={collisionMap}
                    onMapChange={handleMapChange}
                    interactiveElements={interactiveElements}
                    isPaused={isPaused}
                />
            </Stage>
        </>
    );
};