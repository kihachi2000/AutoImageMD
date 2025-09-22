import { env, Uri, workspace } from "vscode";
import path = require("node:path");
import { Config } from "./config";

export function onDidCreateImageFile(config: Config, oldFileUri: Uri) {
    const newFileUri = genNewFileUri(oldFileUri);

    workspace
        .fs
        .rename(oldFileUri, newFileUri, { overwrite: false })
        .then(() => writeToClipboard(config, newFileUri));
}

function genNewFileUri(oldFileUri: Uri): Uri {
    const oldFilePath = oldFileUri.path;
    const newFilePath = path.format({
        dir: path.dirname(oldFilePath),
        name: getTimeAsString(),
        ext: path.extname(oldFilePath),
    });

    return Uri.file(newFilePath);
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

function writeToClipboard(config: Config, newFileUri: Uri) {
    const pathToImageFile = path.join(
        config.pathToImageDir!,
        path.basename(newFileUri.path),
    );

    const content = `![](${pathToImageFile})`;
    env.clipboard.writeText(content);
}
