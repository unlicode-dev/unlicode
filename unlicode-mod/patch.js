/**
 * Unlicode Branding Patch Script
 *
 * Applies Unlicode branding to Void application by replacing specific text strings
 * in source files. This script is designed to be run during the build process
 * to customize the application with Unlicode branding.
 *
 * Usage:
 *   node unlicode-mod/patch.js
 *
 * Sample modification:
 *   Before: <h1>Void's Settings</h1>
 *   After:  <h1>Unlicode AI Assistant Settings</h1>
 *
 *   The script searches for exact text matches and replaces them with
 *   Unlicode branding across all configured files.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const PROJECT_ROOT = path.join(__dirname, '..');
const BRANDING_REPLACEMENTS = [
	{
		filePath: 'src/vs/workbench/contrib/void/browser/react/src/void-settings-tsx/Settings.tsx',
		searchText: "Void's Settings",
		replacementText: "Unlicode AI Assistant Settings Latest"
	}
];

/**
 * Applies branding replacements to configured files
 * @returns {boolean} true if all operations succeeded, false if any errors occurred
 */
function applyBranding() {
	let hasErrors = false;

	BRANDING_REPLACEMENTS.forEach(({ filePath, searchText, replacementText }) => {
		const fullFilePath = path.join(PROJECT_ROOT, filePath);

		// Verify file exists
		if (!fs.existsSync(fullFilePath)) {
			console.log(`⚠️  File not found: ${filePath}`);
			hasErrors = true;
			return;
		}

		try {
			// Read file content
			const content = fs.readFileSync(fullFilePath, 'utf8');

			// Skip if no replacement needed
			if (!content.includes(searchText)) {
				return;
			}

			// Apply replacement
			const updatedContent = content.replace(
				new RegExp(searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
				replacementText
			);

			// Write updated content
			fs.writeFileSync(fullFilePath, updatedContent, 'utf8');
			console.log(`✅ Updated branding in: ${filePath}`);

		} catch (error) {
			console.log(`❌ Error processing ${filePath}: ${error.message}`);
			hasErrors = true;
		}
	});

	return !hasErrors;
}

// Main execution
console.log('Applying Unlicode Branding...\n');

if (applyBranding()) {
	console.log('\n✅ Unlicode branding applied successfully!');
	process.exit(0);
} else {
	console.log('\n⚠️  Branding application completed with errors!');
	process.exit(1);
}
