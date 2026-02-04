const fs = require('fs');
const path = require('path');

// Paths
const reviewPath = path.resolve(__dirname, '../../memory/self-review.md');
const outputPath = path.resolve(__dirname, 'self_review.js');

function sync() {
    try {
        if (!fs.existsSync(reviewPath)) {
            console.log('No self-review.md found.');
            return;
        }

        const content = fs.readFileSync(reviewPath, 'utf8');
        // Split by "## " (headers)
        const entries = content.split(/^## /m).slice(1); 
        
        const parsed = entries.map(entry => {
            const lines = entry.split('\n');
            const time = lines[0].trim();
            let tag = '', miss = '', fix = '';
            
            lines.forEach(line => {
                if (line.startsWith('**TAG:**')) tag = line.replace('**TAG:**', '').trim();
                if (line.startsWith('**MISS:**')) miss = line.replace('**MISS:**', '').trim();
                if (line.startsWith('**FIX:**')) fix = line.replace('**FIX:**', '').trim();
            });
            
            return { time, tag, miss, fix };
        }).filter(e => e.tag && e.miss && e.fix);

        // Get last 6 entries
        const recent = parsed.reverse().slice(0, 6);
        
        const jsContent = `window.ZYENX_SELF_REVIEW = ${JSON.stringify(recent, null, 2)};`;
        
        fs.writeFileSync(outputPath, jsContent);
        console.log(`[${new Date().toISOString()}] Synced ${recent.length} reviews to dashboard.`);
        
    } catch (error) {
        console.error('Error syncing reviews:', error);
    }
}

sync();
