import { useState, useEffect } from "react";

export default function useDraggable(id, exitBtn) {
  const [position, setPosition] = useState({
    x: "98%",
    y: id === "toolHandle" ? 0 : 100,
  });

  useEffect(() => {
    const handle = document.getElementById(id);
    const exitImg = document.getElementById(exitBtn);
    handle.addEventListener("mousedown", function (e) {
      e.preventDefault();
      //Makes smooth
      handle.style.pointerEvents = "none";

      document.body.addEventListener("mousemove", move);
      document.body.addEventListener("mouseup", () => {
        document.body.removeEventListener("mousemove", move);
        //Un smooths
        handle.style.pointerEvents = "initial";
      });
    });

    exitImg.addEventListener("mousedown", function (e) {
      e.preventDefault();
      exit();
    });

    return () => {
      document.body.removeEventListener("mousedown", move);
      document.body.removeEventListener("mouseup", move);
      document.body.removeEventListener("mousemove", move);
    };
  }, []);

  function move(e) {
    const pos = {
      x: e.clientX,
      y: e.clientY,
    };

    setPosition(pos);
  }

  function exit() {
    const pos = {
      x: "98%",
      y: id === "toolHandle" ? 0 : 100,
    };
    setPosition(pos);
  }

  return {
    position,
  };
}
