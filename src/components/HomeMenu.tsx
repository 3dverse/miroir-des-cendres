import { FullscreenSwitch } from "./FullscreenSwitch";

//------------------------------------------------------------------------------
export function HomeMenu({ onStart }: { onStart?: () => void }) {
    return (
        <div className="fixed inset-0">
            <div className="fixed inset-0 bg-gray-500/50 backdrop-blur -z-10">{}</div>
            <div className="menu">
                <h1>Miroir Des Cendres</h1>
                <button className="bg-blue-500 text-white text-left font-bold py-2 px-4 rounded" onClick={onStart}>
                    Start
                </button>
                <FullscreenSwitch />
            </div>
        </div>
    );
}
