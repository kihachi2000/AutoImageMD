import { env, Uri } from "vscode";
import fsPromises = require("node:fs/promises");
import path = require("node:path");

import { Config } from "./config";

export function onDidCreateImageFile(uri: Uri) {
    const oldFilePath = uri.fsPath;
    const newFilePath = getNewFilePath(oldFilePath);

    fsPromises
        .rename(oldFilePath, newFilePath)
        .then(() => writeToClipboard(newFilePath))
        .catch((why) => console.log(why));
}

function getNewFilePath(oldPath: string): string {
    return path.format({
        dir: path.dirname(oldPath),
        name: getTimeAsString(),
        ext: path.extname(oldPath),
    });
}

function getTimeAsString(): string {
    const date = new Date();

    return [
        date.getFullYear().toString(),
        "-",
        zeroPad(date.getMonth()),
        "-",
        zeroPad(date.getDate()),
        "_",
        zeroPad(date.getHours()),
        "-",
        zeroPad(date.getMinutes()),
        "-",
        zeroPad(date.getSeconds()),
    ].join("");
}

function zeroPad(num: number): string {
    return String(num).padStart(2, "0");
}

function writeToClipboard(newFilePath: string) {
    const base = path.basename(newFilePath);
    const content = `![](/images/${base})`;

    env.clipboard.writeText(content);
}
