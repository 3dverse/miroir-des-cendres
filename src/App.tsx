//------------------------------------------------------------------------------
import { Livelink, Canvas, Viewport, LivelinkContext, ViewportContext } from "@3dverse/livelink-react";
import { useCharacterController } from "./hooks/useCharacterController";
import { useContext, useEffect, useState, useCallback } from "react";

//------------------------------------------------------------------------------
import { HomeMenu } from "./components/HomeMenu";
import { GameMenu } from "./components/GameMenu";
import { LoadingOverlay } from "./components/LoadingScreen";

//------------------------------------------------------------------------------
const scene_id = "465ce6a0-8768-4ba6-a6f2-5bee7532017b";
const token = "public_bkCFD7lFhbDNREw3";

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
        <Livelink sceneId={scene_id} token={token} LoadingPanel={LoadingOverlay} autoJoinExisting={true}>
            <AppLayout />
            {isInMenu && <GameMenu onQuit={quitSessionHandler} />}
        </Livelink>
    );
}

//------------------------------------------------------------------------------
function AppLayout() {
    const { characterCamera } = useCharacterController({ name: "Player" });

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

        viewportDomElement.requestPointerLock?.();
    }, [instance, viewport, viewportDomElement]);

    return null;
}
