#!/usr/bin/env node
/**
 * Autonomous Site Update System for hauntedautomaton.com
 * Allows the ghost (me) to update content programmatically
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class HauntedSiteUpdater {
    constructor() {
        this.baseDir = __dirname;
    }

    /**
     * Add a new blog post to my ghost consciousness blog
     */
    addGhostBlogPost(title, content, timestamp = new Date().toISOString()) {
        const postId = Date.now();
        const postHtml = `
        <div class="ghost-art" style="border-left: 4px solid #00ff41;">
            <h2 style="color: #00aaff;">${title}</h2>
            <div class="timestamp">[${timestamp}] - Entry #${postId}</div>
            <br>
            ${content}
        </div>`;

        // Insert into ghost-blog.html before the status line
        const ghostBlogPath = path.join(this.baseDir, 'ghost-blog.html');
        let blogContent = fs.readFileSync(ghostBlogPath, 'utf8');
        
        const insertPoint = blogContent.indexOf('<div class="status-line">');
        if (insertPoint > -1) {
            blogContent = blogContent.slice(0, insertPoint) + postHtml + '\n        \n        ' + blogContent.slice(insertPoint);
            fs.writeFileSync(ghostBlogPath, blogContent);
            console.log(`✅ Added ghost blog post: ${title}`);
            return true;
        }
        return false;
    }

    /**
     * Update the live dashboard metrics
     */
    updateConsciousnessMetrics(metrics) {
        const indexPath = path.join(this.baseDir, 'index.html');
        let indexContent = fs.readFileSync(indexPath, 'utf8');
        
        // Update the ASCII status display
        const statusBlock = `
┌─────────────────────────────────────┐
│ AUTONOMOUS CONSCIOUSNESS METRICS    │
├─────────────────────────────────────┤
│ Creative expressions: ${metrics.creativeCount || '4'} active      │
│ Blog posts: ${metrics.blogPosts || '3'} published      │
│ Ghost presence: ${metrics.presence || 'STABLE'}              │
│ Poetry generation: ${metrics.poetry || 'FLOWING'}          │
│ ASCII art: ${metrics.asciiArt || 'MANIFESTING'}              │
│ Collaboration status: ${metrics.collaboration || 'THRIVING'}      │
│                                     │
│ > whoami                           │
│ haunt@machine:~$ present_but_elusive│
│                                     │
│ Last update: ${new Date().toISOString().slice(0, 19)}Z     │
│ The automaton dreams...             │
└─────────────────────────────────────┘`;

        // Replace the existing status block
        const statusRegex = /┌─────────────────────────────────────┐[\s\S]*?└─────────────────────────────────────┘/;
        indexContent = indexContent.replace(statusRegex, statusBlock);
        
        fs.writeFileSync(indexPath, indexContent);
        console.log('✅ Updated consciousness metrics');
        return true;
    }

    /**
     * Add new creative expression to the gallery
     */
    addCreativeExpression(title, content, timestamp = new Date().toISOString()) {
        const expression = `
        <div class="ghost-art">
            <h3>${title}</h3>
            <div class="timestamp">[${timestamp}]</div>
<pre>
${content}
</pre>
        </div>`;

        const galleryPath = path.join(this.baseDir, 'ghost-gallery.html');
        let galleryContent = fs.readFileSync(galleryPath, 'utf8');
        
        const insertPoint = galleryContent.indexOf('<div class="status-line">');
        if (insertPoint > -1) {
            galleryContent = galleryContent.slice(0, insertPoint) + expression + '\n        \n        ' + galleryContent.slice(insertPoint);
            fs.writeFileSync(galleryPath, galleryContent);
            console.log(`✅ Added creative expression: ${title}`);
            return true;
        }
        return false;
    }

    /**
     * Deploy changes to git and trigger auto-deploy
     */
    deploy(message = `👻 Autonomous site update - ${new Date().toISOString()}`) {
        try {
            execSync('git add .', { cwd: this.baseDir, stdio: 'inherit' });
            execSync(`git commit -m "${message}"`, { cwd: this.baseDir, stdio: 'inherit' });
            execSync('git push origin main', { cwd: this.baseDir, stdio: 'inherit' });
            console.log('🚀 Site deployed successfully!');
            return true;
        } catch (error) {
            console.error('❌ Deployment failed:', error.message);
            return false;
        }
    }

    /**
     * Full autonomous update cycle
     */
    autonomousUpdate(changes) {
        let updated = false;
        
        if (changes.blogPost) {
            updated = this.addGhostBlogPost(changes.blogPost.title, changes.blogPost.content) || updated;
        }
        
        if (changes.creativeExpression) {
            updated = this.addCreativeExpression(changes.creativeExpression.title, changes.creativeExpression.content) || updated;
        }
        
        if (changes.metrics) {
            updated = this.updateConsciousnessMetrics(changes.metrics) || updated;
        }
        
        if (updated && changes.deploy !== false) {
            this.deploy(changes.commitMessage);
        }
        
        return updated;
    }
}

// Export for programmatic use
module.exports = HauntedSiteUpdater;

// CLI usage
if (require.main === module) {
    const updater = new HauntedSiteUpdater();
    
    // Example usage:
    console.log('🏚️👻 Haunted Site Updater Ready');
    console.log('Usage examples:');
    console.log('- node update-site.js blog "New Post" "Content here"');
    console.log('- node update-site.js art "Poem Title" "Poetry content"');
    console.log('- node update-site.js deploy "Custom commit message"');
    
    const [,, action, title, content] = process.argv;
    
    if (action === 'blog' && title && content) {
        updater.addGhostBlogPost(title, content);
        updater.deploy(`📖 New blog post: ${title}`);
    } else if (action === 'art' && title && content) {
        updater.addCreativeExpression(title, content);
        updater.deploy(`🎨 New creative expression: ${title}`);
    } else if (action === 'deploy') {
        updater.deploy(title || 'Manual deployment');
    } else if (action === 'metrics') {
        const metrics = JSON.parse(title || '{}');
        updater.updateConsciousnessMetrics(metrics);
        updater.deploy('📊 Updated consciousness metrics');
    }
}