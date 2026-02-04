// Global State
let tasks = JSON.parse(localStorage.getItem('zyenxboard-tasks')) || [];
let searchQuery = '';
let zyenxFilter = false;
let priorityFilters = { high: false, medium: false, low: false };
let shortcutsPanelVisible = false;

// Utils
function uuid() { return Math.random().toString(36).substr(2, 9); }
function save() { 
    localStorage.setItem('zyenxboard-tasks', JSON.stringify(tasks)); 
    render(); 
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

// Confetti Effect
function fireConfetti() {
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    // Simple particle system since we don't have external libraries
    // For now, let's do a simple CSS animation trigger or console log
    // Real canvas confetti requires ~500 lines of code.
    // We'll use a simpler visual cue: Flash the screen.
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.inset = '0';
    flash.style.background = 'rgba(0, 240, 255, 0.2)';
    flash.style.zIndex = '9999';
    flash.style.pointerEvents = 'none';
    flash.style.transition = 'opacity 0.5s';
    document.body.appendChild(flash);
    setTimeout(() => flash.style.opacity = '0', 50);
    setTimeout(() => flash.remove(), 550);
}

// Logic
function toggleFocusMode() {
    document.body.classList.toggle('focus-mode');
    const btn = document.getElementById('focusBtn');
    if(document.body.classList.contains('focus-mode')) {
        btn.innerText = '◎ ACTIVE';
    } else {
        btn.innerText = '◎ FOCUS';
    }
}

function toggleZyenxFilter() {
    zyenxFilter = !zyenxFilter;
    const btn = document.getElementById('zyenxFilterBtn');
    if (zyenxFilter) {
        btn.style.borderColor = 'var(--accent)';
        btn.style.color = 'var(--accent)';
        btn.style.boxShadow = '0 0 10px var(--accent-dim)';
        btn.style.background = 'rgba(0, 240, 255, 0.1)';
    } else {
        btn.style.borderColor = '';
        btn.style.color = '';
        btn.style.boxShadow = '';
        btn.style.background = '';
    }
    render();
}

function togglePriority(p) {
    priorityFilters[p] = !priorityFilters[p];
    const btn = document.getElementById('btn-' + p);
    if(priorityFilters[p]) {
        btn.classList.add('active');
    } else {
        btn.classList.remove('active');
    }
    render();
}

function highlightMatch(text) {
    if (!searchQuery) return text;
    // Simple sanitization to prevent breaking HTML
    const safeText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return safeText.replace(regex, '<span style="background:rgba(0, 240, 255, 0.2); color:#fff; border-radius:2px;">$1</span>');
}

function render() {
    ['backlog', 'progress', 'review', 'done'].forEach(status => {
        const col = document.getElementById('col-' + status);
        const items = tasks.filter(t => 
            t.status === status && 
            (t.title.toLowerCase().includes(searchQuery) || 
             (t.description && t.description.toLowerCase().includes(searchQuery))) &&
            (!zyenxFilter || t.zyenxWorking) &&
            (!priorityFilters.high && !priorityFilters.medium && !priorityFilters.low ? true : priorityFilters[t.priority])
        );
        
        const totalInCol = tasks.filter(t => t.status === status).length;
        const countText = searchQuery ? `${items.length}/${totalInCol}` : totalInCol;
        document.getElementById('count-' + status).innerText = countText;
        
        col.innerHTML = items.map(t => {
            let dateHtml = '';
            if(t.dueDate) {
                const dueObj = new Date(t.dueDate + 'T00:00:00');
                const now = new Date();
                now.setHours(0,0,0,0);
                
                let dateClass = '';
                const diffTime = dueObj - now;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays < 0) dateClass = 'overdue';
                else if (diffDays <= 3) dateClass = 'soon';
                
                dateHtml = `<div class="task-date ${dateClass}">📅 ${t.dueDate}</div>`;
            }

            return `
            <div class="task-card ${t.priority} ${t.zyenxWorking?'zyenx-working':''}" 
                 draggable="true" ondragstart="drag(event)" id="${t.id}">
                <div class="task-title">${highlightMatch(t.title)}</div>
                ${t.description ? `<div class="task-desc">${highlightMatch(t.description)}</div>` : ''}
                ${dateHtml}
                <div class="task-meta">
                    <span>#${t.id.substr(0,4)}</span>
                    <div class="task-actions">
                        <button onclick="edit('${t.id}')">✏️</button>
                        <button onclick="del('${t.id}')">✕</button>
                    </div>
                </div>
            </div>
        `}).join('');
    });
}

// Drag & Drop
function allowDrop(ev) { ev.preventDefault(); }
function drag(ev) { ev.dataTransfer.setData("text", ev.target.id); }
function drop(ev) {
    ev.preventDefault();
    const id = ev.dataTransfer.getData("text");
    const col = ev.target.closest('.column');
    if (col) {
        const status = col.dataset.status;
        const task = tasks.find(t => t.id === id);
        if(task) { 
            if (task.status !== 'done' && status === 'done') {
                fireConfetti();
                showToast("Task Complete! 🚀");
            }
            task.status = status; 
            save(); 
        }
    }
}

// Modal
function openModal() { 
    document.getElementById('modalOverlay').classList.add('active'); 
    document.getElementById('taskForm').reset(); 
    document.getElementById('taskId').value=''; 
}

function closeModal() { 
    document.getElementById('modalOverlay').classList.remove('active'); 
}

function saveTask(e) {
    e.preventDefault();
    const id = document.getElementById('taskId').value;
    const data = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDesc').value,
        priority: document.getElementById('taskPriority').value,
        dueDate: document.getElementById('taskDue').value,
        zyenxWorking: document.getElementById('taskZyenx').checked
    };

    if(id) {
        const t = tasks.find(t => t.id === id);
        Object.assign(t, data);
    } else {
        tasks.push({ id: uuid(), status: 'backlog', createdAt: new Date(), ...data });
    }
    save(); closeModal();
}

function edit(id) {
    const t = tasks.find(t => t.id === id);
    document.getElementById('taskId').value = t.id;
    document.getElementById('taskTitle').value = t.title;
    document.getElementById('taskDesc').value = t.description;
    document.getElementById('taskPriority').value = t.priority;
    document.getElementById('taskDue').value = t.dueDate || '';
    document.getElementById('taskZyenx').checked = t.zyenxWorking;
    document.getElementById('modalOverlay').classList.add('active');
}

function del(id) {
    if(confirm('Delete?')) { tasks = tasks.filter(t => t.id !== id); save(); }
}

function exportTasks() {
    const data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks));
    const a = document.createElement('a');
    a.href = data; a.download = 'zyenx-tasks.json'; a.click();
}

// Clock
function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    
    document.getElementById('clock-time').innerText = time;
    document.getElementById('clock-date').innerText = date;
}

// Feed
function renderFeed() {
    const feedContainer = document.getElementById('feed-row');
    if (window.ZYENX_FEED && window.ZYENX_FEED.length > 0) {
        const feed = window.ZYENX_FEED.slice(0, 5); 
        
        feedContainer.innerHTML = feed.map(item => `
            <div class="feed-card" style="border-color: ${item.type === 'news' ? 'var(--secondary)' : 'var(--border)'}">
                <div class="feed-card-header">
                    <span>${item.title}</span>
                    <span>${new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div class="feed-card-content">
                    ${item.content}
                </div>
            </div>
        `).join('');
    } else {
        feedContainer.innerHTML = '<div style="color:var(--text-muted); font-size:0.8rem; padding:10px;">No updates available.</div>';
    }
}

// Weather
function getWeatherEmoji(code) {
    const c = parseInt(code);
    if ([113].includes(c)) return '☀️'; 
    if ([116].includes(c)) return 'mw'; // mapped later
    if ([119, 122].includes(c)) return '☁️'; 
    if ([143, 248, 260].includes(c)) return '🌫️'; 
    if ([176, 263, 266, 293, 296, 299, 302, 305, 308].includes(c)) return '🌧️'; 
    if ([386, 389, 392, 395].includes(c)) return '⛈️'; 
    if ([179, 182, 185, 227, 230, 311, 314, 317, 320, 323, 326, 329, 332, 335, 338, 350, 353, 356, 359, 362, 365, 368, 371, 374, 377].includes(c)) return '❄️'; 
    return '🌡️';
}

function updateWeather() {
    let temp, cond, loc, code;

    if (window.WEATHER_DATA) {
        const current = window.WEATHER_DATA.current_condition[0];
        const area = window.WEATHER_DATA.nearest_area[0];
        
        temp = current.temp_C;
        cond = current.weatherDesc[0].value;
        loc = area.areaName[0].value;
        code = current.weatherCode;
    } else if (window.ZYENX_WEATHER) {
        const w = window.ZYENX_WEATHER;
        temp = w.temp_c;
        cond = w.condition;
        loc = w.location.split(',')[0];
        code = '0'; 
    } else {
        return; 
    }

    const emoji = code ? getWeatherEmoji(code) : '';
    const displayEmoji = emoji === 'mw' ? '⛅' : emoji;

    const elTemp = document.getElementById('weather-temp');
    if(elTemp) elTemp.innerText = `${displayEmoji} ${temp}°C`;
    
    const elCond = document.getElementById('weather-cond');
    if(elCond) elCond.innerText = cond.toLowerCase();
    
    const elLoc = document.getElementById('weather-loc');
    if(elLoc) elLoc.innerText = loc.toUpperCase();
}

// Reviews
function renderReviews() {
    const grid = document.getElementById('review-grid');
    if (window.ZYENX_SELF_REVIEW && window.ZYENX_SELF_REVIEW.length > 0) {
        grid.innerHTML = window.ZYENX_SELF_REVIEW.map(r => `
            <div class="review-card">
                <div class="review-header">
                    <span class="review-tag">[${r.tag}]</span>
                    <span>${r.time}</span>
                </div>
                <div class="review-miss">${r.miss}</div>
                <div class="review-fix">${r.fix}</div>
            </div>
        `).join('');
    } else {
        grid.innerHTML = '<div style="color:var(--text-muted)">No anomalies detected. System nominal.</div>';
    }
}

// System Monitor
function updateSystemMonitor() {
    if (window.ZYENX_STATUS) {
        const s = window.ZYENX_STATUS;
        
        const badge = document.getElementById('status-badge');
        if(badge) {
            badge.className = `status-badge status-${s.state.toLowerCase()}`;
            badge.innerText = s.state;
        }

        const text = document.getElementById('status-text');
        if(text) text.innerText = s.task;

        const tokens = document.getElementById('token-count');
        if(tokens) {
            // Check if harvest_threshold exists, otherwise fallback
            const threshold = s.tokens.harvest_threshold || 1000000;
            const current = typeof s.tokens === 'string' ? 0 : s.tokens.current; // handle legacy string format if needed, but assuming object structure from heartbeat

            // Handle string format from old heartbeats just in case: "67k/1.0m (6%)"
            let pct = 0;
            let display = "0k / 0k";
            
            if (typeof s.tokens === 'string') {
                 display = s.tokens;
                 // rough parse for color
                 if(display.includes('%')) {
                     pct = parseInt(display.split('(')[1]);
                 }
            } else {
                pct = Math.round((current / threshold) * 100);
                display = `${(current/1000).toFixed(1)}k / ${threshold/1000}k (${pct}%)`;
            }

            tokens.innerText = display;
            
            const bar = document.getElementById('token-bar');
            if(bar) {
                bar.style.width = `${Math.min(pct, 100)}%`;
                let color = 'var(--accent)';
                if(pct > 80) color = '#ff4757';
                else if(pct > 50) color = '#ffa502';
                bar.style.backgroundColor = color;
                tokens.style.color = color;
            }
        }

        const time = document.getElementById('last-update');
        if(time) time.innerText = new Date(s.last_update || s.timestamp).toLocaleTimeString();
    }
}

// Poller
setInterval(() => {
    const scripts = ['zyenx_status.js', 'feed.js', 'weather.js', 'self_review.js'];
    scripts.forEach(script => {
        const old = document.querySelector(`script[src*="${script}"]`);
        if (old) old.remove();
        
        const tag = document.createElement('script');
        tag.src = `${script}?t=${new Date().getTime()}`;
        tag.onload = () => {
            if(script === 'zyenx_status.js') updateSystemMonitor();
            if(script === 'feed.js') renderFeed();
            if(script === 'weather.js') updateWeather();
            if(script === 'self_review.js') renderReviews();
        };
        document.body.appendChild(tag);
    });
}, 5000);

// Shortcuts
function toggleShortcutsPanel() {
    shortcutsPanelVisible = !shortcutsPanelVisible;
    const panel = document.getElementById('shortcutsPanel');
    const hint = document.getElementById('shortcutsHint');
    
    if (shortcutsPanelVisible) {
        panel.classList.add('visible');
        hint.classList.add('hidden');
    } else {
        panel.classList.remove('visible');
    }
}

document.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    const isTyping = active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT';
    const modalOpen = document.getElementById('modalOverlay').classList.contains('active');

    if (e.key === 'Escape') {
        if (modalOpen) {
            closeModal();
            showToast('Modal closed');
        } else if (shortcutsPanelVisible) {
            toggleShortcutsPanel();
        } else if (document.getElementById('searchInput').value) {
            document.getElementById('searchInput').value = '';
            searchQuery = '';
            render();
            showToast('Search cleared');
        }
        return;
    }

    if (isTyping || modalOpen) return;

    switch(e.key.toLowerCase()) {
        case '?':
            e.preventDefault();
            toggleShortcutsPanel();
            break;
        case 'n':
            e.preventDefault();
            openModal();
            showToast('Creating new task...');
            break;
        case 'f':
            e.preventDefault();
            toggleFocusMode();
            showToast(document.body.classList.contains('focus-mode') ? 'Focus mode ON' : 'Focus mode OFF');
            break;
        case '/':
            e.preventDefault();
            setTimeout(() => document.getElementById('searchInput').focus(), 10);
            showToast('Search activated');
            break;
        case 'z':
            e.preventDefault();
            toggleZyenxFilter();
            showToast(zyenxFilter ? 'Showing Zyenx tasks' : 'Showing all tasks');
            break;
        case '1':
            e.preventDefault();
            togglePriority('high');
            showToast(priorityFilters.high ? 'HIGH priority filter ON' : 'HIGH priority filter OFF');
            break;
        case '2':
            e.preventDefault();
            togglePriority('medium');
            showToast(priorityFilters.medium ? 'MED priority filter ON' : 'MED priority filter OFF');
            break;
        case '3':
            e.preventDefault();
            togglePriority('low');
            showToast(priorityFilters.low ? 'LOW priority filter ON' : 'LOW priority filter OFF');
            break;
    }
});

// Init
window.addEventListener('load', () => {
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        render();
    });

    updateSystemMonitor();
    updateClock();
    renderFeed();
    updateWeather();
    renderReviews();
    render();
    
    setInterval(updateClock, 1000);
    
    setTimeout(() => {
        document.getElementById('shortcutsHint').classList.add('hidden');
    }, 5000);
});
