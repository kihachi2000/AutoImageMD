import * as vscode from "vscode";
import { onDidCreateImageFile } from "./onDidCreateImageFile";

let watcher: vscode.FileSystemWatcher | undefined = undefined;
export function activate(context: vscode.ExtensionContext) {
    const uri = vscode.Uri.file("/home/kem/tmp");
    watcher = vscode.workspace.createFileSystemWatcher(
        new vscode.RelativePattern(
            uri,
            "*.{png, jpg, jpeg, gif, bmp, tiff, tif, webp, heic, heif, svg, avif}"
        ),
    );

    watcher?.onDidCreate(onDidCreateImageFile);
}

export function deactivate() {
    watcher?.dispose();
    watcher = undefined;
}
