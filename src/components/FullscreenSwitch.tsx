import { ChangeEvent, useCallback } from "react";

//------------------------------------------------------------------------------
export function FullscreenSwitch() {
    //--------------------------------------------------------------------------
    const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }, []);

    //--------------------------------------------------------------------------
    return (
        <label className="inline-flex items-center space-x-2 cursor-pointer">
            <input
                type="checkbox"
                onChange={onChange}
                className="form-checkbox h-5 w-5 text-white rounded border-gray-300 focus:ring-gray-400"
            />
            <span className="text-white  text-sm">Fullscreen</span>
        </label>
    );
}
