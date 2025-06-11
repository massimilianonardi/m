"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const webview_1 = require("./webview");
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand("jsoncrack-vscode.start", () => createWebviewForActiveEditor(context)), vscode.commands.registerCommand("jsoncrack-vscode.start.specific", (content) => createWebviewForContent(context, content)), vscode.commands.registerCommand("jsoncrack-vscode.start.selected", () => createWebviewForSelectedText(context)));
}
// create webview for selected text
function createWebviewForSelectedText(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.selection.isEmpty) {
            vscode.window.showInformationMessage("Please select some text first!");
            return;
        }
        const selectedText = editor === null || editor === void 0 ? void 0 : editor.document.getText(editor.selection);
        // Create the webview panel and send the selected JSON content
        const panel = (0, webview_1.createWebviewPanel)(context);
        panel.webview.postMessage({
            json: selectedText,
        });
        const onReceiveMessage = panel.webview.onDidReceiveMessage(e => {
            if (e === "ready") {
                panel.webview.postMessage({
                    json: selectedText,
                });
            }
        });
        const onTextChange = vscode.workspace.onDidChangeTextDocument(changeEvent => {
            if (changeEvent.document === (editor === null || editor === void 0 ? void 0 : editor.document)) {
                panel.webview.postMessage({
                    json: changeEvent.document.getText(editor === null || editor === void 0 ? void 0 : editor.selection),
                });
            }
        });
        const disposer = () => {
            onTextChange.dispose();
            onReceiveMessage.dispose();
        };
        panel.onDidDispose(disposer, null, context.subscriptions);
    });
}
function createWebviewForActiveEditor(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const panel = (0, webview_1.createWebviewPanel)(context);
        const editor = vscode.window.activeTextEditor;
        const onReceiveMessage = panel.webview.onDidReceiveMessage(e => {
            if (e === "ready") {
                panel.webview.postMessage({
                    json: editor === null || editor === void 0 ? void 0 : editor.document.getText(),
                });
            }
        });
        const onTextChange = vscode.workspace.onDidChangeTextDocument(changeEvent => {
            if (changeEvent.document === (editor === null || editor === void 0 ? void 0 : editor.document)) {
                panel.webview.postMessage({
                    json: changeEvent.document.getText(),
                });
            }
        });
        const disposer = () => {
            onTextChange.dispose();
            onReceiveMessage.dispose();
        };
        panel.onDidDispose(disposer, null, context.subscriptions);
    });
}
/**
 * Renders a readonly diagram from a string
 * @param context ExtensionContext
 * @param content JSON content as a string
 */
function createWebviewForContent(context, content) {
    if (context && content) {
        const panel = (0, webview_1.createWebviewPanel)(context);
        panel.webview.postMessage({
            json: content,
        });
    }
}
// This method is called when your extension is deactivated
// eslint-disable-next-line @typescript-eslint/no-empty-function
function deactivate() { }
//# sourceMappingURL=extension.js.map