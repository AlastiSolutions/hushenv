// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { applyCustomTheme, getWebviewContent } from "./util";

let originalTheme: string | undefined;

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand("hushenv.hush", () => {
    const panel = vscode.window.createWebviewPanel(
      "fileTypeSelector",
      "Select File Types to hide",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
      }
    );

    panel.webview.html = getWebviewContent();
    panel.webview.onDidReceiveMessage(
      (msg) => {
        switch (msg.command) {
          case "updateFileTypes":
            vscode.workspace
              .getConfiguration()
              .update("hushenv.fileTypes", msg.fileTypes, true);
            break;
        }
      },
      undefined,
      context.subscriptions
    );
  });

  context.subscriptions.push(disposable);

  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor) {
      if (!originalTheme) {
        originalTheme = vscode.workspace
          .getConfiguration("workbench")
          .get("colorTheme");
      }

      applyCustomTheme(editor, originalTheme ?? "hushENV Theme", () => {
        originalTheme = undefined;
      });
    }
  });
}

export function deactivate() {}
