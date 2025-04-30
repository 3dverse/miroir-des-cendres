//------------------------------------------------------------------------------
import { Livelink, Canvas, Viewport, useEntity, LivelinkContext, ViewportContext } from "@3dverse/livelink-react";
import { useCharacterController } from "./hooks/useCharacterController";
import { useContext, useEffect, useState } from "react";

//------------------------------------------------------------------------------
const scene_id = "b8d478b8-438e-41b5-967f-350d1db91e2a";
const token = "public_kBtqQ1_7-YFE1hZx";

//------------------------------------------------------------------------------
export default function App() {
    const [hasStarted, setHasStarted] = useState(false);

    if (!hasStarted) {
        return (
            <div className="flex items-center justify-center h-screen">
                <button
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
                    onClick={() => setHasStarted(true)}
                >
                    Start
                </button>
            </div>
        );
    }

    return (
        <Livelink sceneId={scene_id} token={token}>
            <AppLayout />
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

        viewportDomElement.requestPointerLock();
    }, [instance, viewport, viewportDomElement]);

    return null;
}
