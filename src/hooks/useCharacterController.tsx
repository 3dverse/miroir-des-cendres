import { useContext, useEffect, useState } from "react";
import { LivelinkContext, useEntity } from "@3dverse/livelink-react";
import type { Entity } from "@3dverse/livelink";

//------------------------------------------------------------------------------
export function useCharacterController({
    name,
}: {
    name: string;
}) {
    const { instance } = useContext(LivelinkContext);
    const { entity: playerSceneEntity } = useEntity({ name });
    const [characterCamera, setCharacterCamera] = useState<Entity | null>(null);
    const [characterController, setCharacterController] = useState<Entity | null>(null);

    //--------------------------------------------------------------------------
    useEffect(() => {
        if (!playerSceneEntity) {
            return;
        }

        async function instantiateCharacterScene(playerSceneEntity: Entity) {
            const children = await playerSceneEntity.getChildren();
            const thirdPersonController = children.find(child => child.script_map !== undefined);
            const thirdPersonCameraEntity = children.find(child => child.camera !== undefined);

            setCharacterController(thirdPersonController ?? null);
            setCharacterCamera(thirdPersonCameraEntity ?? null);
        }

        instantiateCharacterScene(playerSceneEntity);
    }, [playerSceneEntity]);

    //--------------------------------------------------------------------------
    useEffect(() => {
        if (!instance || !characterController) {
            return;
        }

        console.log("Assigning client to scripts");
        characterController.assignClientToScripts({
            client_uuid: instance.session.client_id!,
        });

        instance.startSimulation();

        return () => {
            characterController.assignClientToScripts({
                client_uuid: "00000000-0000-0000-0000-000000000000",
            });
        };
    }, [instance, characterController]);

    return { characterCamera };
}
