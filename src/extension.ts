import { ExtensionContext, FileSystemWatcher, RelativePattern, Uri, workspace } from "vscode";
import { Config } from "./config";
import { onDidCreateImageFile } from "./onDidCreateImageFile";

let watcher: FileSystemWatcher | undefined = undefined;
export function activate(context: ExtensionContext) {
    setup();
}

function setup() {
    const config = readConfig();
    initWatcher(config);
}

function disposeWatcher() {
    watcher?.dispose();
    watcher = undefined;
}

function readConfig(): Config {
    const config: Config = {
        pathToImageDir: undefined,
    };

    let source = workspace.getConfiguration("auto-image-md");
    config.pathToImageDir = source.get("pathToImageDir");

    console.log(`readConfig: ${config.pathToImageDir}`);

    return config;
}

function initWatcher(config: Config) {
    if (config.pathToImageDir !== undefined) {
        const uri = Uri.file(config.pathToImageDir);
        watcher = workspace.createFileSystemWatcher(
            new RelativePattern(
                uri,
                "*.{png, jpg, jpeg, gif, bmp, tiff, tif, webp, heic, heif, svg, avif}"
            ),
        );

        watcher?.onDidCreate((uri) => onDidCreateImageFile(config, uri));
    }
}

export function deactivate() {
    disposeWatcher();
}
