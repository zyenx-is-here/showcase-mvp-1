document.addEventListener('DOMContentLoaded', () => {
    const output = document.getElementById('terminal-output');
    const logs = [
        { text: "[SYSTEM] Initializing core protocols...", delay: 800 },
        { text: "[NETWORK] Connecting to Zyenx Node [US-EAST-1]...", delay: 1500 },
        { text: "[SUCCESS] Uplink established (Latency: 12ms)", delay: 2000 },
        { text: "[AI] Loading Neural Interface v2.4...", delay: 2800 },
        { text: "[AI] Model: Gemini-Pro-Vision loaded", delay: 3500 },
        { text: "[MODULE] Analyzing user engagement metrics...", delay: 4200 },
        { text: "[OPTIMIZATION] Revenue engine: ACTIVE", delay: 5000 },
        { text: "> Ready for deployment.", delay: 6000 }
    ];

    let currentLogIndex = 0;

    function typeLog(log, callback) {
        const div = document.createElement('div');
        div.className = 'mb-1';
        output.appendChild(div);
        
        let i = 0;
        const text = log.text;
        
        function typeChar() {
            if (i < text.length) {
                div.textContent += text.charAt(i);
                i++;
                setTimeout(typeChar, 20 + Math.random() * 30); // Random typing speed
            } else {
                if (callback) callback();
            }
        }
        
        typeChar();
    }

    function processLogs() {
        if (currentLogIndex < logs.length) {
            const log = logs[currentLogIndex];
            setTimeout(() => {
                typeLog(log, () => {
                    currentLogIndex++;
                    processLogs();
                });
            }, 300); // Pause between logs
        } else {
            // Add blinking cursor at the end
            const cursor = document.createElement('span');
            cursor.className = 'text-blue-500 font-bold cursor-blink';
            cursor.textContent = '_';
            output.appendChild(cursor);
        }
    }

    // Start the sequence
    processLogs();
});
