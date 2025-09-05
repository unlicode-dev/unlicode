/**
 * Unlicode Branding Patch Script
 *
 * Applies Unlicode branding to Void application with ability to revert changes.
 * Uses facade pattern to manage branding operations.
 *
 * Usage:
 *   node unlicode-mod/patch.js apply    # Apply branding
 *   node unlicode-mod/patch.js revert   # Revert to original
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PROJECT_ROOT = path.join(__dirname, '..');
const BRANDING_CONFIGURATIONS = [
	{
		sourceFilePath: 'src/vs/workbench/contrib/void/browser/react/src/void-settings-tsx/Settings.tsx',
		originalText: "Void's Settings",
		brandedText: "Unlicode AI Assistant Settings Latest"
	}
];

// Facade class for branding operations
class BrandingManager {
	apply() {
		console.log('Applying Unlicode Branding...\n');
		return this.processFiles('apply');
	}

	revert() {
		console.log('Reverting to original branding...\n');
		return this.processFiles('revert');
	}

	processFiles(operation) {
		let hasProcessingErrors = false;

		BRANDING_CONFIGURATIONS.forEach(({ sourceFilePath, originalText, brandedText }) => {
			const fullFilePath = path.join(PROJECT_ROOT, sourceFilePath);

			if (!fs.existsSync(fullFilePath)) {
				console.log(`⚠️  File not found: ${sourceFilePath}`);
				hasProcessingErrors = true;
				return;
			}

			try {
				if (operation === 'apply') {
					hasProcessingErrors = this.applyBranding(fullFilePath, originalText, brandedText, sourceFilePath);
				} else {
					hasProcessingErrors = this.revertBranding(fullFilePath, originalText, brandedText, sourceFilePath);
				}
			} catch (error) {
				console.log(`❌ Error processing ${sourceFilePath}: ${error.message}`);
				hasProcessingErrors = true;
			}
		});

		return !hasProcessingErrors;
	}

	applyBranding(filePath, originalText, brandedText, displayPath) {
		const fileContent = fs.readFileSync(filePath, 'utf8');

		if (!fileContent.includes(originalText)) {
			console.log(`ℹ️  No changes needed in: ${displayPath}`);
			return false;
		}

		// Apply replacement
		const escapedOriginalText = this.escapeRegExp(originalText);
		const updatedContent = fileContent.replace(
			new RegExp(escapedOriginalText, 'g'),
			brandedText
		);

		fs.writeFileSync(filePath, updatedContent, 'utf8');
		console.log(`✅ Applied branding to: ${displayPath}`);
		return false;
	}

	revertBranding(filePath, originalText, brandedText, displayPath) {
		const fileContent = fs.readFileSync(filePath, 'utf8');

		if (!fileContent.includes(brandedText)) {
			console.log(`ℹ️  No branded text found in: ${displayPath}`);
			return false;
		}

		const escapedBrandedText = this.escapeRegExp(brandedText);
		const updatedContent = fileContent.replace(
			new RegExp(escapedBrandedText, 'g'),
			originalText
		);

		fs.writeFileSync(filePath, updatedContent, 'utf8');
		console.log(`✅ Reverted branding in: ${displayPath}`);
		return false;
	}

	escapeRegExp(string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}
}

// Main execution
function main() {
	const command = process.argv[2];
	const brandingManager = new BrandingManager();

	try {
		if (command === 'apply') {
			const success = brandingManager.apply();
			process.exit(success ? 0 : 1);
		} else if (command === 'revert') {
			const success = brandingManager.revert();
			process.exit(success ? 0 : 1);
		} else {
			displayUsage();
			process.exit(1);
		}
	} catch (error) {
		console.error(`❌ Unexpected error: ${error.message}`);
		process.exit(1);
	}
}

function displayUsage() {
	console.log('Usage: node patch.js [apply|revert]');
	console.log('  apply  - Apply Unlicode branding');
	console.log('  revert - Revert to original branding');
}

// Execute main function
main();
