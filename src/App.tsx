//------------------------------------------------------------------------------
import {
    Livelink,
    Canvas,
    Viewport,
    CameraController,
    useCameraEntity,
} from "@3dverse/livelink-react";

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
    const { cameraEntity } = useCameraEntity();

    return (
        <Canvas className="max-h-screen">
            <Viewport cameraEntity={cameraEntity} className="w-full h-full">
                <CameraController />
            </Viewport>
        </Canvas>
    );
}
