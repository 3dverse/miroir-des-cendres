//------------------------------------------------------------------------------
import { Livelink, Canvas, Viewport, CameraController } from "@3dverse/livelink-react";
import { useCharacterController } from "./hooks/useCharacterController";

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
    const { characterCamera } = useCharacterController({
        characterSceneId: "aa20cd90-0823-47da-8265-9ac3a8cc2e0f",
        enabled: true,
        startPosition: [-0.8, 2.8, 8.15],
    });

    return (
        <Canvas className="max-h-screen">
            <Viewport cameraEntity={characterCamera} className="w-full h-full">
                <CameraController />
            </Viewport>
        </Canvas>
    );
}
