import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";
import {
  arePointsOutOfRange,
  createEllipse,
  createRect,
  createText,
  resizeEllipse,
  resizeRect,
  resizeText,
} from "./func";

export type CanvasDrawMode =
  | "SELECT"
  | "RECT"
  | "ELLIPSE"
  | "TEXT_S"
  | "TEXT_L";
export type PenColor = "ORANGE" | "GREEN" | "PURPLE";

const Paint = React.forwardRef<
  HTMLCanvasElement,
  {
    bgImgSrc?: string;
    canvas?: fabric.Canvas;
    drawMode?: CanvasDrawMode;
    readonly?: boolean;
    penColor?: PenColor;
    onDrawEnd?: VoidFunction;
  }
>(
  (
    {
      bgImgSrc,
      canvas,
      drawMode = "SELECT",
      penColor = "ORANGE",
      onDrawEnd,
      readonly = false,
    },
    ref
  ) => {
    const paintInfo = useRef<{
      drawMode: CanvasDrawMode;
      penColor: PenColor;
      onDrawEnd?: VoidFunction;
      readonly: boolean;
    }>({
      drawMode,
      penColor,
      onDrawEnd,
      readonly,
    });

    useEffect(() => {
      paintInfo.current = {
        drawMode,
        penColor,
        onDrawEnd,
        readonly,
      };
    }, [drawMode, penColor, onDrawEnd, readonly]);

    useEffect(() => {
      if (!canvas) return;

      let drawing = false,
        origX = 0,
        origY = 0,
        rect: fabric.Rect | undefined = undefined,
        ellipse: fabric.Ellipse | undefined = undefined,
        text: fabric.Textbox | undefined = undefined;

      const handleCanvasMouseDown = (o: fabric.IEvent<MouseEvent>) => {
        if (paintInfo.current.drawMode === "SELECT") return;

        drawing = true;

        const pointer = canvas.getPointer(o.e);
        origX = pointer.x;
        origY = pointer.y;

        const { penColor, readonly, drawMode } = paintInfo.current;

        switch (drawMode) {
          case "RECT":
            rect = createRect(origX, origY, penColor, readonly);
            canvas.add(rect);
            canvas.setActiveObject(rect);
            break;
          case "ELLIPSE":
            ellipse = createEllipse(origX, origY, penColor, readonly);
            canvas.add(ellipse);
            canvas.setActiveObject(ellipse);
            break;
          case "TEXT_S":
          case "TEXT_L":
            text = createText(
              origX,
              origY,
              drawMode === "TEXT_S" ? 16 : 32,
              penColor,
              readonly
            );
            canvas.add(text);
            canvas.setActiveObject(text);
            break;
        }

        canvas.renderAll();
      };

      const handleCanvasMouseMove = (o: fabric.IEvent<MouseEvent>) => {
        if (!drawing) return;
        const pointer = canvas.getPointer(o.e);
        if (arePointsOutOfRange(pointer.x, pointer.y)) return;

        switch (paintInfo.current.drawMode) {
          case "RECT":
            if (rect) resizeRect(rect, origX, origY, pointer.x, pointer.y);
            break;
          case "ELLIPSE":
            if (ellipse)
              resizeEllipse(ellipse, origX, origY, pointer.x, pointer.y);
            break;
          case "TEXT_S":
          case "TEXT_L":
            if (text) resizeText(text, origX, pointer.x);
            break;
        }

        canvas.renderAll();
      };

      const handleCanvasMouseUp = (o: fabric.IEvent<MouseEvent>) => {
        drawing = false;
        paintInfo.current.onDrawEnd?.();

        canvas.renderAll();
      };

      canvas.on("mouse:down", handleCanvasMouseDown);
      canvas.on("mouse:move", handleCanvasMouseMove);
      canvas.on("mouse:up", handleCanvasMouseUp);

      return () => {
        canvas.off("mouse:down");
        canvas.off("mouse:move");
        canvas.off("mouse:up");
      };
    }, [canvas]);

    useEffect(() => {
      if (!canvas || !bgImgSrc) return;

      canvas.setBackgroundImage(bgImgSrc, canvas.renderAll.bind(canvas), {
        top: 0,
        left: 0,
        originX: "left",
        originY: "top",
      });
    }, [bgImgSrc, canvas]);

    return (
      <canvas
        width="1024"
        height="768"
        className="border-solid border-2 border-gray-300"
        ref={ref}
      />
    );
  }
);

export default Paint;
