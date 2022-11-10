import { fabric } from "fabric";
import { PenColor } from ".";

export const CANVAS_WIDTH = 1024;
export const CANVAS_HEIGHT = 768;

export function getRGBFromPenColor(penColor: PenColor, opacity = 1.0) {
  switch (penColor) {
    case "ORANGE":
      return `rgba(249,115,22,${opacity})`;
    case "GREEN":
      return `rgba(34,197,94,${opacity})`;
    case "PURPLE":
      return `rgba(168,85,247,${opacity})`;
  }
}

export function arePointsOutOfRange(
  x: number,
  y: number,
  canvasWidth = CANVAS_WIDTH,
  canvasHeight = CANVAS_HEIGHT
) {
  return x > canvasWidth || y > canvasHeight || x < 0 || y < 0;
}

export function createRect(
  x: number,
  y: number,
  penColor: PenColor,
  readonly = false
): fabric.Rect {
  const rect = new fabric.Rect({
    left: x,
    top: y,
    originX: "left",
    originY: "top",
    width: 0,
    height: 0,
    fill: getRGBFromPenColor(penColor, 0.3),
    stroke: getRGBFromPenColor(penColor),
    borderColor: "white",
    strokeWidth: 1,
    selectable: !readonly,
  });
  rect.set("strokeUniform", true);
  rect.setControlsVisibility({ mtr: false });

  return rect;
}

export function createEllipse(
  x: number,
  y: number,
  penColor: PenColor,
  readonly = false
): fabric.Ellipse {
  const ellipse = new fabric.Ellipse({
    left: x,
    top: y,
    originX: "left",
    originY: "top",
    rx: 0,
    ry: 0,
    fill: getRGBFromPenColor(penColor, 0.3),
    stroke: getRGBFromPenColor(penColor),
    strokeWidth: 1,
    selectable: !readonly,
  });
  ellipse.set("strokeUniform", true);
  ellipse.setControlsVisibility({ mtr: false });

  return ellipse;
}

export function createText(
  x: number,
  y: number,
  fontSize: number,
  penColor: PenColor,
  readonly = false
): fabric.Textbox {
  const text = new fabric.Textbox("Text", {
    left: x,
    top: y,
    originX: "left",
    originY: "top",
    fill: getRGBFromPenColor(penColor),
    width: 0,
    height: 0,
    selectable: !readonly,
    fontSize,
    lockScalingY: true,
  });
  text.set({ strokeUniform: true });
  text.setControlsVisibility({
    mtr: false,
    tl: false,
    tr: false,
    bl: false,
    br: false,
    mb: false,
    mt: false,
  });

  return text;
}

export function resizeRect(
  rect: fabric.Rect,
  origX: number,
  origY: number,
  x: number,
  y: number
) {
  if (x < origX) rect.set({ left: x });
  if (y < origY) rect.set({ top: y });

  rect.set({
    width: Math.abs(origX - x),
    height: Math.abs(origY - y),
  });
}

export function resizeEllipse(
  ellipse: fabric.Ellipse,
  origX: number,
  origY: number,
  x: number,
  y: number
) {
  if (x < origX) ellipse.set({ left: x });
  if (y < origY) ellipse.set({ top: y });

  ellipse.set({ rx: Math.abs(origX - x) / 2, ry: Math.abs(origY - y) / 2 });
}

export function resizeText(text: fabric.Textbox, origX: number, x: number) {
  if (x < origX) text.set({ left: x });

  text.set({
    width: Math.abs(origX - x),
  });
}
