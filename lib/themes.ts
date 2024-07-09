import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";

export const lightTheme = createTheme({
  theme: "light",
  settings: {
    background: "#ffffff",
    foreground: "#171717",
    caret: "#000000",
    selection: "#36aa9936",
    selectionMatch: "#36aa9936",
    lineHighlight: "#DFEFFF",
  },
  styles: [
    { tag: t.variableName, color: "#005FF2" }, // for pinata, file, data, console
    { tag: t.className, color: "#7D00CC" }, // for PinataSDK, File
    { tag: t.function(t.variableName), color: "#7D00CC" }, // for log, .file
    { tag: t.constant(t.name), color: "#005FF2" },
    { tag: t.string, color: "#107D32" },
    { tag: t.comment, color: "#666666" },
    { tag: t.keyword, color: "#C41562" },
    { tag: t.attributeName, color: "#7D00CC" },
    { tag: t.special(t.string), color: "#107D32" },
    { tag: t.punctuation, color: "#171717" },
    { tag: t.link, color: "#107D32" },
    { tag: t.number, color: "#111111" },
    { tag: t.propertyName, color: "#005FF2" },
  ],
});

export const darkTheme = createTheme({
  theme: "dark",
  settings: {
    background: "000000",
    foreground: "ffffff",
    caret: "#ffffff",
    //selection: "#36aa9936",
    //selectionMatch: "#36aa9936",
    lineHighlight: "#002F62",
  },
  styles: [
    { tag: t.variableName, color: "#47A8FF" }, // for pinata, file, data, console
    { tag: t.className, color: "#C472FB" }, // for PinataSDK, File
    { tag: t.function(t.variableName), color: "#C472FB" }, // for log, .file
    { tag: t.constant(t.name), color: "#47A8FF" },
    { tag: t.string, color: "#00CA50" },
    { tag: t.comment, color: "#A1A1A1" },
    { tag: t.keyword, color: "#FF4D8D" },
    { tag: t.attributeName, color: "#C472FB" },
    { tag: t.special(t.string), color: "#00CA50" },
    { tag: t.punctuation, color: "#171717" },
    { tag: t.link, color: "#00CA50" },
    { tag: t.number, color: "#ffffff" },
    { tag: t.propertyName, color: "#47A8FF" },
  ],
});
