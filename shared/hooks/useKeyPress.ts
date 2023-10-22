import { useEffect, useState } from "react";

export function useKeyPress(targetKey: string): boolean {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);
  // If pressed key is our target key then set to true
  function downHandler(e): void {
    if (e.key === targetKey) {
      setKeyPressed(true);
    }
  }
  // If released key is our target key then set to false
  const upHandler = (e): void => {
    if (e.key === targetKey) {
      setKeyPressed(false);
    }
  };
  // Add event listeners
  useEffect(() => {
    window.addEventListener("keydown", downHandler, true);
    window.addEventListener("keyup", upHandler, true);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler, true);
      window.removeEventListener("keyup", upHandler, true);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount
  return keyPressed;
}