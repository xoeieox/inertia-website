// scripts/vault-access-bridge.js
// Provides Claude Code with vault access while maintaining selective publishing

const fs = require('fs-extra');
const path = require('path');
const matter = require('gray-matter');

class VaultAccessBridge {
  constructor() {
    this.vaultPath = '/Users/erhei/Library/CloudStorage/ProtonDrive-xerah@pm.me-folder/inertia-vault';
    this.websitePath = '/Users/erhei/Library/CloudStorage/ProtonDrive-xerah@pm.me-folder/inertia-website';
    this.contentPath = path.join(this.websitePath, 'src/content');
    
    // Auto-publish configurations
    this.autoPublishFolders = [
      {
        vaultPath: 'Daily-Operations/Blog-Posts',
        websitePath: 'blog',
        type: 'blog'
      },
      {
        vaultPath: 'Products/*/Status-Updates',
        websitePath: 'updates',
        type: 'status-update'
      },
      {
        vaultPath: 'Technology/Public-Guides',
        websitePath: 'technology',
        type: 'guide'
      }
    ];
  }

  // PRIMARY FUNCTION: Give Claude Code vault access for content creation
  async readVaultFile(relativePath) {
    const fullPath = path.join(this.vaultPath, relativePath);
    
    if (!(await fs.pathExists(fullPath))) {
      throw new Error(`Vault file not found: ${relativePath}`);
    }
    
    const content = await fs.readFile(fullPath, 'utf8');
    const parsed = matter(content);
    
    return {
      path: relativePath,
      frontmatter: parsed.data,
      content: parsed.content,
      fullContent: content
    };
  }

  async searchVaultContent(query, folders = []) {
    console.log(`🔍 Searching vault for: "${query}"`);
    
    const results = [];
    const searchFolders = folders.length > 0 ? folders : ['']; // Root if no folders specified
    
    for (const folder of searchFolders) {
      const searchPath = path.join(this.vaultPath, folder);
      
      if (await fs.pathExists(searchPath)) {
        const files = await this.getAllMarkdownFiles(searchPath);
        
        for (const file of files) {
          const content = await fs.readFile(file, 'utf8');
          
          if (content.toLowerCase().includes(query.toLowerCase())) {
            const relativePath = path.relative(this.vaultPath, file);
            const parsed = matter(content);
            
            results.push({
              path: relativePath,
              title: parsed.data.title || path.basename(file, '.md'),
              snippet: this.extractSnippet(content, query),
              frontmatter: parsed.data
            });
          }
        }
      }
    }
    
    console.log(`Found ${results.length} results`);
    return results;
  }

  async getVaultStructure(folder = '') {
    const targetPath = path.join(this.vaultPath, folder);
    
    if (!(await fs.pathExists(targetPath))) {
      return null;
    }
    
    const structure = {};
    const items = await fs.readdir(targetPath, { withFileTypes: true });
    
    for (const item of items) {
      if (item.isDirectory()) {
        structure[item.name] = await this.getVaultStructure(path.join(folder, item.name));
      } else if (item.name.endsWith('.md')) {
        const filePath = path.join(targetPath, item.name);
        const content = await fs.readFile(filePath, 'utf8');
        const parsed = matter(content);
        
        structure[item.name] = {
          type: 'file',
          title: parsed.data.title || item.name.replace('.md', ''),
          status: parsed.data.status,
          lastModified: (await fs.stat(filePath)).mtime
        };
      }
    }
    
    return structure;
  }

  // SELECTIVE AUTO-PUBLISHING: For specific content types
  async autoPublishNewContent() {
    console.log('🔄 Checking for new auto-publishable content...');
    
    for (const config of this.autoPublishFolders) {
      await this.processAutoPublishFolder(config);
    }
  }

  async processAutoPublishFolder(config) {
    const vaultFolder = path.join(this.vaultPath, config.vaultPath.replace('*', ''));
    
    // Handle wildcard paths like Products/*/Status-Updates
    if (config.vaultPath.includes('*')) {
      await this.processWildcardFolder(config);
      return;
    }
    
    if (!(await fs.pathExists(vaultFolder))) {
      console.log(`📁 Auto-publish folder not found: ${config.vaultPath}`);
      return;
    }
    
    const files = await this.getAllMarkdownFiles(vaultFolder);
    const websiteFolder = path.join(this.contentPath, config.websitePath);
    
    for (const file of files) {
      const shouldPublish = await this.shouldAutoPublish(file, config);
      
      if (shouldPublish) {
        await this.publishFileToWebsite(file, websiteFolder, config.type);
      }
    }
  }

  async processWildcardFolder(config) {
    // Handle patterns like Products/*/Status-Updates
    const [baseFolder, , subFolder] = config.vaultPath.split('/');
    const basePath = path.join(this.vaultPath, baseFolder);
    
    if (!(await fs.pathExists(basePath))) return;
    
    const productFolders = await fs.readdir(basePath, { withFileTypes: true });
    
    for (const productFolder of productFolders) {
      if (productFolder.isDirectory()) {
        const statusUpdatesPath = path.join(basePath, productFolder.name, subFolder);
        
        if (await fs.pathExists(statusUpdatesPath)) {
          const files = await this.getAllMarkdownFiles(statusUpdatesPath);
          const websiteFolder = path.join(this.contentPath, config.websitePath, productFolder.name.toLowerCase());
          
          for (const file of files) {
            const shouldPublish = await this.shouldAutoPublish(file, config);
            
            if (shouldPublish) {
              await this.publishFileToWebsite(file, websiteFolder, config.type);
            }
          }
        }
      }
    }
  }

  async shouldAutoPublish(filePath, config) {
    const content = await fs.readFile(filePath, 'utf8');
    const parsed = matter(content);
    
    // Check for explicit publish flags
    if (parsed.data.publish === false) return false;
    if (parsed.data.status === 'private') return false;
    
    // Auto-publish based on type
    switch (config.type) {
      case 'blog':
        return parsed.data.type === 'blog-post' || parsed.data.publish === true;
      
      case 'status-update':
        return parsed.data.type === 'status-update' || 
               (parsed.data.status === 'published' && !content.includes('DRAFT'));
      
      case 'guide':
        return parsed.data.type === 'guide' || parsed.data.public === true;
      
      default:
        return parsed.data.publish === true;
    }
  }

  async publishFileToWebsite(filePath, websiteFolder, type) {
    const relativePath = path.relative(this.vaultPath, filePath);
    console.log(`📤 Auto-publishing: ${relativePath}`);
    
    await fs.ensureDir(websiteFolder);
    
    const content = await fs.readFile(filePath, 'utf8');
    const parsed = matter(content);
    
    // Add publishing metadata
    const webMetadata = {
      ...parsed.data,
      publishedAt: new Date().toISOString(),
      sourceFile: relativePath,
      autoPublished: true,
      type: type
    };
    
    const processedContent = this.processMarkdownForWeb(parsed.content);
    const webContent = matter.stringify(processedContent, webMetadata);
    
    const webFileName = this.generateWebFileName(filePath);
    const outputPath = path.join(websiteFolder, webFileName);
    
    await fs.writeFile(outputPath, webContent);
    console.log(`✅ Published: ${webFileName}`);
  }

  // CLAUDE CODE HELPER FUNCTIONS
  async createPageFromVault(templatePath, outputPath, vaultReferences = []) {
    console.log(`📝 Creating page: ${outputPath}`);
    console.log(`📚 Using vault references: ${vaultReferences.join(', ')}`);
    
    // This function would be called by Claude Code to create pages
    // using vault content as reference material
    
    const vaultData = {};
    
    for (const ref of vaultReferences) {
      try {
        vaultData[ref] = await this.readVaultFile(ref);
      } catch (error) {
        console.log(`⚠️  Could not read vault reference: ${ref}`);
      }
    }
    
    // Return vault data for Claude Code to use in page generation
    return {
      vaultData,
      outputPath: path.join(this.websitePath, 'src/app', outputPath)
    };
  }

  // Helper methods
  extractSnippet(content, query, contextLength = 100) {
    const index = content.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return '';
    
    const start = Math.max(0, index - contextLength);
    const end = Math.min(content.length, index + query.length + contextLength);
    
    return '...' + content.slice(start, end) + '...';
  }

  async getAllMarkdownFiles(dirPath) {
    const files = [];
    
    const scan = async (currentPath) => {
      try {
        const items = await fs.readdir(currentPath, { withFileTypes: true });
        
        for (const item of items) {
          const fullPath = path.join(currentPath, item.name);
          
          if (item.isDirectory()) {
            await scan(fullPath);
          } else if (item.name.endsWith('.md')) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        // Directory might not exist or be inaccessible
      }
    };
    
    await scan(dirPath);
    return files;
  }

  processMarkdownForWeb(markdown) {
    return markdown
      .replace(/\[\[([^\]]+)\]\]/g, (match, linkText) => {
        const webPath = this.convertObsidianLinkToWeb(linkText);
        return `[${linkText}](${webPath})`;
      })
      .trim();
  }

  convertObsidianLinkToWeb(obsidianLink) {
    if (obsidianLink.includes('Products/Insight')) return '/products/insight';
    if (obsidianLink.includes('Products/Catalyst')) return '/products/catalyst';
    if (obsidianLink.includes('Products/Axis')) return '/products/axis';
    if (obsidianLink.includes('Technology')) return '/technology';
    
    return `#${obsidianLink.toLowerCase().replace(/\s+/g, '-')}`;
  }

  generateWebFileName(originalPath) {
    const basename = path.basename(originalPath, '.md');
    return basename.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '.md';
  }

  // API for Claude Code integration
  async claudeCodeAPI(command, ...args) {
    switch (command) {
      case 'read':
        return await this.readVaultFile(args[0]);
      
      case 'search':
        return await this.searchVaultContent(args[0], args[1]);
      
      case 'structure':
        return await this.getVaultStructure(args[0]);
      
      case 'createPage':
        return await this.createPageFromVault(args[0], args[1], args[2]);
      
      case 'autoPublish':
        return await this.autoPublishNewContent();
      
      default:
        throw new Error(`Unknown command: ${command}`);
    }
  }
}

module.exports = VaultAccessBridge;

// Example usage for Claude Code
/*
const bridge = new VaultAccessBridge();

// Claude Code can read any vault file for reference
const insightFramework = await bridge.readVaultFile('Products/Insight/Framework.md');

// Search for relevant content
const batteryInfo = await bridge.searchVaultContent('battery life', ['Technology', 'Products']);

// Get vault structure to understand organization
const productStructure = await bridge.getVaultStructure('Products');

// Create a web page using vault content as reference
const pageData = await bridge.createPageFromVault(
  'product-template.tsx',
  'products/insight/technical-specs/page.tsx',
  ['Products/Insight/Framework.md', 'Technology/ESP32-Guide.md']
);
*/