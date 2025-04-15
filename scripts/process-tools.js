#!/usr/bin/env node

/**
 * This script processes the compiled JavaScript files to add .js extensions to imports
 * which is required for ESM modules to work correctly in Node.js
 */

import fs from 'fs/promises';
import path from 'path';

const DIST_DIR = 'dist';

async function processTools() {
  try {
    console.log('Processing compiled files...');
    
    // Get all JS files in the dist directory and subdirectories
    const allFiles = await getAllJsFiles(DIST_DIR);
    
    // Fix imports in each file
    let fixedCount = 0;
    for (const file of allFiles) {
      const wasFixed = await fixImports(file);
      if (wasFixed) fixedCount++;
    }
    
    console.log(`Fixed imports in ${fixedCount} files out of ${allFiles.length} total files.`);
    console.log('Processing completed successfully.');
  } catch (error) {
    console.error('Error processing files:', error);
    process.exit(1);
  }
}

async function getAllJsFiles(dir) {
  const files = [];
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        const subDirFiles = await getAllJsFiles(fullPath);
        files.push(...subDirFiles);
      } else if (entry.isFile() && entry.name.endsWith('.js')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
    throw error;
  }
  
  return files;
}

async function fixImports(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    
    // This regex matches import statements with relative paths
    // It captures the import path between quotes
    const importRegex = /from\s+(['"])(\.[^'"]*?)(?:\1)/g;
    
    let modified = false;
    let newContent = content.replace(importRegex, (match, quote, importPath) => {
      // If the import path doesn't end with .js, add it
      if (!importPath.endsWith('.js')) {
        modified = true;
        return `from ${quote}${importPath}.js${quote}`;
      }
      return match;
    });
    
    // Also handle dynamic imports
    const dynamicImportRegex = /import\s*\(\s*(['"])(\.[^'"]*?)(?:\1)\s*\)/g;
    newContent = newContent.replace(dynamicImportRegex, (match, quote, importPath) => {
      if (!importPath.endsWith('.js')) {
        modified = true;
        return `import(${quote}${importPath}.js${quote})`;
      }
      return match;
    });
    
    if (modified) {
      console.log(`Fixed imports in: ${filePath}`);
      await fs.writeFile(filePath, newContent, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error fixing imports in ${filePath}:`, error);
    throw error;
  }
}

// Run the script
processTools();
