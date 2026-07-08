"use client";
import { useState } from "react";

export default function Form() {
    const [inputColour, setInputColour] = useState("blue");

    const handleColourChange = (event) => {
        setInputColour(event.target.value);
    };

    return (
        <label>
            Please state the issue
            <input
                type="text"
                value={inputColour}
                onChange={handleColourChange}
            />
        </label>
    );
}