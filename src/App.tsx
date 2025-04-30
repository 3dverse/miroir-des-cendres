//------------------------------------------------------------------------------
import { Livelink, Canvas, Viewport, useEntity, LivelinkContext, ViewportContext } from "@3dverse/livelink-react";
import { useCharacterController } from "./hooks/useCharacterController";
import { useContext, useEffect } from "react";

//------------------------------------------------------------------------------
const scene_id = "b8d478b8-438e-41b5-967f-350d1db91e2a";
const token = "public_kBtqQ1_7-YFE1hZx";

//------------------------------------------------------------------------------
export default function App() {
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
                <SimulationStarter />
            </Viewport>
        </Canvas>
    );
}

//------------------------------------------------------------------------------
function SimulationStarter() {
    const { instance } = useContext(LivelinkContext);
    const { viewport, viewportDomElement } = useContext(ViewportContext);

    useEffect(() => {
        if (!instance || !viewport || !viewportDomElement) {
            return;
        }

        console.log("Setting up controller");

        viewportDomElement.requestPointerLock();

        instance.devices.keyboard.enable();
        instance.devices.gamepad.enable();
        instance.devices.mouse.enableOnViewport({ viewport });

        instance.startSimulation();
    }, [instance, viewport, viewportDomElement]);

    return null;
}
