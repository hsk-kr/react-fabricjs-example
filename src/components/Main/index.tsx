import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { fabric } from "fabric";

import ColorButton from "../ColorButton";
import Button from "../Button";
import Paint, { CanvasDrawMode, PenColor } from "../Paint";
import Checkbox from "../Checkbox";

const Main = () => {
  const [readonly, setReadonly] = useState(false);
  const [drawMode, setDrawMode] = useState<CanvasDrawMode>("SELECT");
  const [penColor, setPenColor] = useState<PenColor>("ORANGE");
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const [bgImgSrc, setBgImgSrc] = useState<string>();
  const fileEl = useRef<HTMLInputElement>(null);
  const textAreaEl = useRef<HTMLTextAreaElement>(null);

  const handleDrawModeChange = (drawMode: CanvasDrawMode) => () => {
    setDrawMode(drawMode);
  };

  const handleCanvasDrawEnd = () => {
    setDrawMode("SELECT");
  };

  const handleUploadImageClick = () => {
    fileEl.current?.click();
  };

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files || e.target.files.length <= 0) {
      return;
    }

    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setBgImgSrc((reader.result as string) || "");
    };
    reader.readAsDataURL(file);
  };

  const handlePenColorChange = (penColor: PenColor) => () => {
    setPenColor(penColor);
  };

  const handleReadonlyChange = () => {
    setReadonly((prevReadOnly) => !prevReadOnly);
  };

  const rotateBackgroundImage = () => {
    if (!canvas?.backgroundImage) return;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const backgroundImage: any = canvas.backgroundImage;
    backgroundImage.rotate((backgroundImage.angle + 90) % 360);
    canvas.renderAll();
  };

  const downloadCanvasAsImage = () => {
    if (!canvas) return;
    const a = document.createElement("a");

    a.href = canvas.toDataURL({
      format: "jpeg",
      quality: 0.8,
    });
    a.download = "canvas.jpeg";
    a.click();

    a.remove();
  };

  const handleJSONImport = () => {
    if (!canvas || !textAreaEl.current) return;

    const json = JSON.parse(textAreaEl.current.value);
    canvas.loadFromJSON(json, () => {
      canvas.renderAll();
    });
  };

  const handleJSONExport = () => {
    if (!canvas || !textAreaEl.current) return;

    const json = JSON.stringify(canvas.toJSON());
    textAreaEl.current.value = json;
  };

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasEl.current);
    setCanvas(canvas);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Delete") {
        const object = canvas.getActiveObject();

        if (object) canvas.remove(object);
      }
    };

    window.addEventListener("keyup", handleKey);

    return () => {
      setCanvas(undefined);
      canvas.dispose();

      window.removeEventListener("keyup", handleKey);
    };
  }, []);

  useEffect(() => {
    if (!canvas) return;
    canvas.selection = drawMode === "SELECT";
  }, [drawMode, canvas]);

  return (
    <div className="w-screen mx-auto mt-8 items-center justify-center flex flex-col gap-y-6">
      <Paint
        ref={canvasEl}
        bgImgSrc={bgImgSrc}
        canvas={canvas}
        drawMode={drawMode}
        penColor={penColor}
        readonly={readonly}
        onDrawEnd={handleCanvasDrawEnd}
      />
      <div className="flex justify-between items-center w-1024">
        <div className="flex flex-col gap-y-2">
          <div className="flex gap-x-2">
            <Button onClick={handleUploadImageClick}>Upload Image</Button>
            <Button onClick={downloadCanvasAsImage}>Download Canvas</Button>
            <input
              type="file"
              className="hidden"
              ref={fileEl}
              onChange={handleFileChange}
            />
          </div>
          <div className="flex gap-x-2">
            <Button onClick={handleJSONImport}>Import JSON</Button>
            <Button onClick={handleJSONExport}>Export as JSON</Button>
          </div>
        </div>
        <div className="flex flex-col gap-y-2 self-start">
          <div className="flex gap-x-2">
            <Button onClick={handleDrawModeChange("RECT")}>Rect</Button>
            <Button onClick={handleDrawModeChange("ELLIPSE")}>Ellipse</Button>
            <Button onClick={handleDrawModeChange("TEXT_S")}>Text(S)</Button>
            <Button onClick={handleDrawModeChange("TEXT_L")}>Text(L)</Button>
          </div>
          <div className="flex gap-x-2">
            <ColorButton
              color="ORANGE"
              onClick={handlePenColorChange("ORANGE")}
              selected={penColor === "ORANGE"}
            />
            <ColorButton
              color="GREEN"
              onClick={handlePenColorChange("GREEN")}
              selected={penColor === "GREEN"}
            />
            <ColorButton
              color="PURPLE"
              onClick={handlePenColorChange("PURPLE")}
              selected={penColor === "PURPLE"}
            />
            <Button onClick={rotateBackgroundImage}>Rotate</Button>
            <div className="flex items-end">
              <span className="mr-2">Readonly:</span>
              <Checkbox checked={readonly} onChange={handleReadonlyChange} />
            </div>
          </div>
        </div>
      </div>
      <div className="w-1024">
        <textarea
          ref={textAreaEl}
          className="w-full h-16 border border-gray-500 resize-none"
        />
      </div>
    </div>
  );
};

export default Main;
