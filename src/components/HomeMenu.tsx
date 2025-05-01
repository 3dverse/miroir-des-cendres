import { useEffect, useState } from "react";
import { FullscreenSwitch } from "./FullscreenSwitch";
import introImage from "../assets/intro.png";

//------------------------------------------------------------------------------
export function HomeMenu({ onStart }: { onStart?: () => void }) {
    const [filterStyle, setFilterStyle] = useState("brightness(1) contrast(1)");

    useEffect(() => {
        const flicker = () => {
            // Flicker effect with multiple quick flashes
            setFilterStyle("brightness(1.5) contrast(1.5)");
            setTimeout(() => setFilterStyle("brightness(0.8) contrast(0.8)"), 100);
            setTimeout(() => setFilterStyle("brightness(1.3) contrast(1.3)"), 200);
            setTimeout(() => setFilterStyle("brightness(1) contrast(1)"), 300);
        };

        let t = 0;

        const scheduleNextFlicker = (initialDelay: number) => {
            const randomDelay = Math.random() * (30000 - 5000) + 5000; // Random delay between 5 and 30 seconds
            t = setTimeout(() => {
                flicker();
                scheduleNextFlicker(randomDelay);
            }, initialDelay);
        };

        // Ensure the first flicker happens within the first 3 seconds
        scheduleNextFlicker(Math.random() * 2000 + 1000);

        return () => {
            clearTimeout(t);
        };
    }, []);

    return (
        <div className="fixed inset-0">
            <div
                className="fixed inset-0 bg-gray-500/50 backdrop-blur -z-10"
                style={{
                    backgroundImage: `url(${introImage})`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    width: "100vw",
                    height: "100vh",
                    minHeight: "-webkit-fill-available", // iOS Safari fix
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "flex-end",
                    padding: "2rem",
                    backdropFilter: "blur(5px)",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    filter: filterStyle, // Apply the flickering effect
                    transition: "filter 0.3s ease-in-out", // Smooth transition for the flicker
                    zIndex: "-1",
                }}
            ></div>
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
