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
const BRANDING_CONFIG = [
	{
		filePath: 'src/vs/workbench/contrib/void/browser/react/src/void-settings-tsx/Settings.tsx',
		originalText: "Void's Settings",
		brandedText: "Unlicode AI Assistant Settings Latest"
	}
];

// Facade class for branding operations
class BrandingManager {
	constructor() {
		this.backupDir = path.join(__dirname, 'backups');
		this.ensureBackupDir();
	}

	ensureBackupDir() {
		if (!fs.existsSync(this.backupDir)) {
			fs.mkdirSync(this.backupDir, { recursive: true });
		}
	}

	apply() {
		console.log('Applying Unlicode Branding...\n');
		return this.processFiles('apply');
	}

	revert() {
		console.log('Reverting to original branding...\n');
		return this.processFiles('revert');
	}

	processFiles(operation) {
		let hasErrors = false;

		BRANDING_CONFIG.forEach(({ filePath, originalText, brandedText }) => {
			const fullFilePath = path.join(PROJECT_ROOT, filePath);
			const backupPath = path.join(this.backupDir, path.basename(filePath));

			if (!fs.existsSync(fullFilePath)) {
				console.log(`⚠️  File not found: ${filePath}`);
				hasErrors = true;
				return;
			}

			try {
				if (operation === 'apply') {
					hasErrors = this.applyBranding(fullFilePath, backupPath, originalText, brandedText, filePath);
				} else {
					hasErrors = this.revertBranding(fullFilePath, backupPath, filePath);
				}
			} catch (error) {
				console.log(`❌ Error processing ${filePath}: ${error.message}`);
				hasErrors = true;
			}
		});

		return !hasErrors;
	}

	applyBranding(filePath, backupPath, originalText, brandedText, displayPath) {
		const content = fs.readFileSync(filePath, 'utf8');

		if (!content.includes(originalText)) {
			console.log(`ℹ️  No changes needed in: ${displayPath}`);
			return false;
		}

		// Create backup if it doesn't exist
		if (!fs.existsSync(backupPath)) {
			fs.writeFileSync(backupPath, content, 'utf8');
		}

		// Apply replacement
		const updatedContent = content.replace(
			new RegExp(originalText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
			brandedText
		);

		fs.writeFileSync(filePath, updatedContent, 'utf8');
		console.log(`✅ Applied branding to: ${displayPath}`);
		return false;
	}

	revertBranding(filePath, backupPath, displayPath) {
		if (!fs.existsSync(backupPath)) {
			console.log(`⚠️  No backup found for: ${displayPath}`);
			return true;
		}

		const backupContent = fs.readFileSync(backupPath, 'utf8');
		fs.writeFileSync(filePath, backupContent, 'utf8');
		console.log(`✅ Reverted branding in: ${displayPath}`);
		return false;
	}
}

// Main execution
const command = process.argv[2];
const manager = new BrandingManager();

if (command === 'apply') {
	if (manager.apply()) {
		console.log('\n✅ Unlicode branding applied successfully!');
		process.exit(0);
	} else {
		console.log('\n⚠️  Branding application completed with errors!');
		process.exit(1);
	}
} else if (command === 'revert') {
	if (manager.revert()) {
		console.log('\n⚠️  Revert completed with errors!');
		process.exit(1);
	} else {
		console.log('\n✅ Reverted to original branding successfully!');
		process.exit(0);
	}
} else {
	console.log('Usage: node patch.js [apply|revert]');
	console.log('  apply  - Apply Unlicode branding');
	console.log('  revert - Revert to original branding');
	process.exit(1);
}
