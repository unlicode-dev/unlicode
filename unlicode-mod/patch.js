/**
 * Unlicode Branding Patch Script
 *
 * Applies Unlicode branding to Void application with ability to revert changes.
 *
 * Usage:
 *   node unlicode-mod/patch.js apply    # Apply branding
 *   node unlicode-mod/patch.js revert   # Revert to original
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');

const CONFIG = [{
	sourceFilePath: 'src/vs/workbench/contrib/void/browser/react/src/void-settings-tsx/Settings.tsx',
	originalText: "Void's Settings",
	brandedText: "Unlicode AI Assistant Settings Latest"
}];

function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function processFile(filePath, displayPath, operation, findText, replaceText) {
	if (!fs.existsSync(filePath)) {
		console.log(`⚠️  File not found: ${displayPath}`);
		return false;
	}

	try {
		const content = fs.readFileSync(filePath, 'utf8');

		if (!content.includes(findText)) {
			console.log(`ℹ️  No changes needed in: ${displayPath}`);
			return false;
		}

		const escapedFindText = escapeRegExp(findText);
		const updatedContent = content.replace(new RegExp(escapedFindText, 'g'), replaceText);

		fs.writeFileSync(filePath, updatedContent, 'utf8');
		console.log(`✅ ${operation} branding in: ${displayPath}`);
		return true;
	} catch (error) {
		console.log(`❌ Error processing ${displayPath}: ${error.message}`);
		return false;
	}
}

function applyBranding() {
	console.log('Applying Unlicode Branding...\n');
	let success = true;

	CONFIG.forEach(({ sourceFilePath, originalText, brandedText }) => {
		const filePath = path.join(PROJECT_ROOT, sourceFilePath);
		success &&= processFile(filePath, sourceFilePath, 'Applied', originalText, brandedText);
	});

	return success;
}

function revertBranding() {
	console.log('Reverting to original branding...\n');
	let success = true;

	CONFIG.forEach(({ sourceFilePath, originalText, brandedText }) => {
		const filePath = path.join(PROJECT_ROOT, sourceFilePath);
		success &&= processFile(filePath, sourceFilePath, 'Reverted', brandedText, originalText);
	});

	return success;
}

function main() {
	const command = process.argv[2];

	try {
		const success = command === 'apply' ? applyBranding() :
			command === 'revert' ? revertBranding() : null;

		if (success !== null) {
			process.exit(success ? 0 : 1);
		}

		console.log('Usage: node patch.js [apply|revert]');
		console.log('  apply  - Apply Unlicode branding');
		console.log('  revert - Revert to original branding');
		process.exit(1);
	} catch (error) {
		console.error(`❌ Unexpected error: ${error.message}`);
		process.exit(1);
	}
}

main();
