import { useContext, useEffect, useState } from "react";
import { LivelinkContext } from "@3dverse/livelink-react";
import type { Livelink, Entity, UUID } from "@3dverse/livelink";

//------------------------------------------------------------------------------
export function useCharacterController({
    characterSceneId,
    enabled = true,
    spawnEntity,
}: {
    characterSceneId: UUID | null;
    enabled?: boolean;
    spawnEntity?: Entity | null;
}) {
    const { instance } = useContext(LivelinkContext);
    const [characterLinker, setCharacterLinker] = useState<Entity | null>(null);
    const [characterCamera, setCharacterCamera] = useState<Entity | null>(null);
    const [characterController, setCharacterController] = useState<Entity | null>(null);

    //--------------------------------------------------------------------------
    useEffect(() => {
        async function instantiateCharacterScene(instance: Livelink, characterSceneId: UUID, spawnEntity: Entity) {
            const playerSceneEntity = await instance.scene.newEntity({
                name: "CharacterEntity",
                components: {
                    local_transform: {
                        position: spawnEntity.global_transform.position,
                        orientation: spawnEntity.global_transform.orientation,
                    },
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
        if (instance && characterSceneId && !characterLinker && spawnEntity) {
            instantiateCharacterScene(instance, characterSceneId, spawnEntity);
        }
    }, [instance, characterSceneId, characterLinker, spawnEntity]);

    //--------------------------------------------------------------------------
    useEffect(() => {
        if (!instance || !characterController || !enabled) {
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
    }, [instance, characterController, enabled]);

    return { characterCamera: enabled ? characterCamera : null };
}
