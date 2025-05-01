//------------------------------------------------------------------------------
import { Livelink, Canvas, Viewport, useEntity, LivelinkContext, ViewportContext } from "@3dverse/livelink-react";
import { useCharacterController } from "./hooks/useCharacterController";
import { useContext, useEffect, useState, useCallback } from "react";

//------------------------------------------------------------------------------
import { HomeMenu } from "./components/HomeMenu";
import { GameMenu } from "./components/GameMenu";
import { LoadingOverlay } from "./components/LoadingScreen";

//------------------------------------------------------------------------------
const scene_id = "b8d478b8-438e-41b5-967f-350d1db91e2a";
const token = "public_kBtqQ1_7-YFE1hZx";

//------------------------------------------------------------------------------
export default function App() {
    const [hasStarted, setHasStarted] = useState(false);
    const [isInMenu, setIsInMenu] = useState(false);

    //--------------------------------------------------------------------------
    const keydownHandler = useCallback(
        (event: KeyboardEvent) => {
            if (hasStarted && event.key === "Escape") {
                setIsInMenu(!isInMenu);
            }
        },
        [hasStarted, isInMenu, setIsInMenu],
    );

    //--------------------------------------------------------------------------
    const quitSessionHandler = useCallback(() => {
        setIsInMenu(false);
        setHasStarted(false);
    }, []);

    //--------------------------------------------------------------------------
    useEffect(() => {
        window.addEventListener("keydown", keydownHandler);
        return () => {
            window.removeEventListener("keydown", keydownHandler);
        };
    }, [keydownHandler]);

    //--------------------------------------------------------------------------
    if (!hasStarted) {
        return <HomeMenu onStart={() => setHasStarted(true)} />;
    }

    //--------------------------------------------------------------------------
    return (
        <Livelink sceneId={scene_id} token={token} LoadingPanel={LoadingOverlay}>
            <AppLayout />
            {isInMenu && <GameMenu onQuit={quitSessionHandler} />}
        </Livelink>
    );
}

//------------------------------------------------------------------------------
function AppLayout() {
    const { entity: spawnEntity } = useEntity({ name: "Spawn" });
    const { characterCamera } = useCharacterController({
        characterSceneId: "aa20cd90-0823-47da-8265-9ac3a8cc2e0f",
        enabled: true,
        spawnEntity,
    });

    return (
        <Canvas className="max-h-screen">
            <Viewport cameraEntity={characterCamera} className="w-full h-full">
                <DevicesListener />
            </Viewport>
        </Canvas>
    );
}

//------------------------------------------------------------------------------
function DevicesListener() {
    const { instance } = useContext(LivelinkContext);
    const { viewport, viewportDomElement } = useContext(ViewportContext);

    useEffect(() => {
        if (!instance || !viewport || !viewportDomElement) {
            return;
        }

        instance.devices.keyboard.enable();
        instance.devices.gamepad.enable();
        instance.devices.mouse.enableOnViewport({ viewport });

        viewportDomElement.requestPointerLock && viewportDomElement.requestPointerLock();
    }, [instance, viewport, viewportDomElement]);

    return null;
}
