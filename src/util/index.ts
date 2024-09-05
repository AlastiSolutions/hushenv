import * as vscode from "vscode";

export const getWebviewContent = () => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <body>
      <h1>Select File Types</h1>
      <form id="fileTypesForm">
        <label>
          <input type="checkbox" name="fileType" value="*.env"> Environment Variables
        </label><br>
        <label>
          <input type="checkbox" name="fileType" value="*.ts"> TypeScript
        </label><br>
        <label>
          <input type="checkbox" name="fileType" value="*.json"> JSON
        </label><br>
          <label>
          <input type="checkbox" name="fileType" value="*.md"> Markdown
        </label><br>
        <button type="button" onclick="updateFileTypes()">Save</button>
      </form>
      <script>
        const vscode = acquireVsCodeApi();
        function updateFileTypes() {
          const checkboxes = document.querySelectorAll('input[name="fileType"]:checked');
          const fileTypes = Array.from(checkboxes).map(cb => cb.value);
          vscode.postMessage({ command: 'updateFileTypes', fileTypes: fileTypes });
        }
      </script>
    </body>
    </html>
    `;
};

export const applyCustomTheme = (
  editor: vscode.TextEditor,
  theme: string,
  func: () => void
) => {
  const conf = vscode.workspace.getConfiguration("hushenv");
  const fileTypes: string[] = conf.get("fileTypes") || [];

  console.log(fileTypes);

  if (
    fileTypes.some((type) =>
      editor.document.uri.fsPath.endsWith(type.replace("*", ""))
    )
  ) {
    console.log("enable hush");
    vscode.workspace
      .getConfiguration("workbench")
      .update("colorTheme", "hushENV Theme", true);
  } else {
    console.log("restore");
    restoreOriginalTheme(theme);
  }
};

export const restoreOriginalTheme = async (theme: string) => {
  if (theme) {
    console.log("CLOGING", theme);

    await vscode.workspace
      .getConfiguration("workbench")
      .update("colorTheme", "Gruvbox Glass", true);
  }
};
