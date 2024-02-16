import * as vscode from 'vscode';
import * as fs from 'fs';

function updateGitignoreWithPatterns(ignoredSettings: string[]): void {
	const gitignorePath = vscode.workspace.rootPath + '/.gitignore';

	// Check if .gitignore file exists
	if (fs.existsSync(gitignorePath)) {
		const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');

		// Check if patterns already exist in .gitignore
		const newPatterns = ignoredSettings.filter(pattern => !gitignoreContent.includes(pattern));
		if (newPatterns.length > 0) {
			fs.appendFileSync(gitignorePath, '\n' + newPatterns.join('\n'));
			vscode.window.showInformationMessage(`Patterns added to .gitignore: ${newPatterns.join(', ')}`);
		} else {
			vscode.window.showInformationMessage('All patterns already exist in .gitignore');
		}
	} else {
		vscode.window.showErrorMessage('No .gitignore file found in the workspace');
	}
}

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('extension.addGitignorePatterns', () => {
		vscode.window.showInputBox({
			prompt: 'Enter comma-separated list of setting names to ignore in .gitignore',
		}).then((input) => {
			if (input) {
				const ignoredSettings = input.split(',').map(setting => setting.trim());
				updateGitignoreWithPatterns(ignoredSettings);
			}
		});
	});

	context.subscriptions.push(disposable);
}