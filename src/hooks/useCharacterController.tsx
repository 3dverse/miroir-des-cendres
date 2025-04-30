import { useContext, useEffect, useState } from "react";
import { LivelinkContext } from "@3dverse/livelink-react";
import type { Livelink, Entity, UUID, Vec3 } from "@3dverse/livelink";

//------------------------------------------------------------------------------
export function useCharacterController({
    characterSceneId,
    enabled = true,
    startPosition,
}: {
    characterSceneId: UUID | null;
    enabled?: boolean;
    startPosition?: Vec3;
}) {
    const { instance } = useContext(LivelinkContext);
    const [characterLinker, setCharacterLinker] = useState<Entity | null>(null);
    const [characterCamera, setCharacterCamera] = useState<Entity | null>(null);
    const [characterController, setCharacterController] = useState<Entity | null>(null);

    //--------------------------------------------------------------------------
    useEffect(() => {
        async function instantiateCharacterScene(instance: Livelink, characterSceneId: UUID, startPosition: Vec3) {
            const playerSceneEntity = await instance.scene.newEntity({
                name: "CharacterEntity",
                components: {
                    local_transform: { position: startPosition },
                    scene_ref: { value: characterSceneId },
                },
                options: {
                    delete_on_client_disconnection: true,
                },
            });

            const children = await playerSceneEntity.getChildren();
            const thirdPersonController = children.find(child => child.script_map !== undefined);
            const thirdPersonCameraEntity = children.find(child => child.camera !== undefined);

            setCharacterLinker(playerSceneEntity);
            setCharacterController(thirdPersonController ?? null);
            setCharacterCamera(thirdPersonCameraEntity ?? null);
        }

        // This hook should only run once when the instance is ready
        if (instance && characterSceneId && !characterLinker && startPosition) {
            instantiateCharacterScene(instance, characterSceneId, startPosition);
        }
    }, [instance, characterSceneId, characterLinker, startPosition]);

    //--------------------------------------------------------------------------
    useEffect(() => {
        if (!instance || !characterController || !enabled) {
            return;
        }

        console.log("Assigning client to scripts");
        characterController.assignClientToScripts({
            client_uuid: instance.session.client_id!,
        });

        return () => {
            characterController.assignClientToScripts({
                client_uuid: "00000000-0000-0000-0000-000000000000",
            });
        };
    }, [instance, characterController, enabled]);

    return { characterCamera: enabled ? characterCamera : null };
}
