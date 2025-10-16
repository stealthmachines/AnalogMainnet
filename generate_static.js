const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}
function generateProgramFiles() {
    const programHtml = `<!DOCTYPE html>
<html>
<head>
    <title>HDGL Program Interface</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.43.0/min/vs/editor/editor.main.min.css" rel="stylesheet">
    <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
    <style>
        body { margin: 0; display: flex; flex-direction: column; height: 100vh; }
        #editor { flex-grow: 1; border: none; }
        .controls {
            padding: 10px;
            background: #1e1e1e;
            display: flex;
            gap: 10px;
        }
        button {
            background: #0e639c;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover { background: #1177bb; }
    </style>
</head>
<body>
    <div class="controls">
        <button onclick="sendToTape()">Write to Tape</button>
        <button onclick="clearTape()">Clear Tape</button>
    </div>
    <div id="editor"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.43.0/min/vs/loader.min.js"></script>
    <script>
        require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.43.0/min/vs' }});
        require(['vs/editor/editor.main'], function() {
            window.editor = monaco.editor.create(document.getElementById('editor'), {
                value: '// Write your tape program here\\n',
                language: 'python',
                theme: 'vs-dark',
                automaticLayout: true
            });
        });

        const socket = io();

        function sendToTape() {
            const code = window.editor.getValue();
            socket.emit('write_tape', { code });
        }

        function clearTape() {
            socket.emit('clear_tape');
            window.editor.setValue('// Write your tape program here\\n');
        }

        socket.on('tape_status', function(data) {
            // Handle tape status updates
        });
    </script>
</body>
</html>`;

    ensureDir('static/program');
    fs.writeFileSync('static/program/index.html', programHtml);
}

// Generate templates
function generateTemplates() {
    ensureDir('templates/stats');
    ensureDir('templates/visualizer');
    ensureDir('templates/program');
}

// Generate explorer interface files
function generateExplorerFiles() {
    const explorerHtml = `<!DOCTYPE html>
<html>
<head>
    <title>HDGL Network Explorer</title>
    <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
    <script src="https://cdn.ethers.io/lib/ethers-5.7.2.umd.min.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background: #f0f0f0;
        }
        .card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .hash {
            font-family: monospace;
            word-break: break-all;
            background: #f5f5f5;
            padding: 8px;
            border-radius: 4px;
        }
        .status {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
        }
        .status.confirmed { background: #e6ffe6; color: #006600; }
        .status.pending { background: #fff3e6; color: #cc7700; }
    </style>
</head>
<body>
    <h1>HDGL Network Explorer</h1>
    <div class="card">
        <h2>Latest State</h2>
        <div id="latestState">
            <p>Loading...</p>
        </div>
    </div>
    <div class="card">
        <h2>Recent Commitments</h2>
        <div id="commitments">
            <p>Loading...</p>
        </div>
    </div>
    <div class="card">
        <h2>IPFS Snapshots</h2>
        <div id="snapshots">
            <p>Loading...</p>
        </div>
    </div>
    <script>
        const socket = io();

        socket.on('state_update', function(data) {
            document.getElementById('latestState').innerHTML = \`
                <p><strong>Block Height:</strong> \${data.blockHeight}</p>
                <p><strong>State Hash:</strong> <span class="hash">\${data.stateHash}</span></p>
                <p><strong>Last Updated:</strong> \${new Date(data.timestamp).toLocaleString()}</p>
            \`;
        });

        socket.on('commitments_update', function(data) {
            document.getElementById('commitments').innerHTML = data.commitments
                .map(c => \`
                    <div style="margin-bottom: 15px;">
                        <p>
                            <span class="status \${c.confirmed ? 'confirmed' : 'pending'}">
                                \${c.confirmed ? 'Confirmed' : 'Pending'}
                            </span>
                        </p>
                        <p class="hash">\${c.hash}</p>
                        <small>\${new Date(c.timestamp).toLocaleString()}</small>
                    </div>
                \`).join('');
        });

        socket.on('snapshots_update', function(data) {
            document.getElementById('snapshots').innerHTML = data.snapshots
                .map(s => \`
                    <div style="margin-bottom: 15px;">
                        <p><strong>CID:</strong> <span class="hash">\${s.cid}</span></p>
                        <p><strong>Height:</strong> \${s.height}</p>
                        <small>\${new Date(s.timestamp).toLocaleString()}</small>
                    </div>
                \`).join('');
        });
    </script>
</body>
</html>`;

    ensureDir('static/explorer');
    fs.writeFileSync('static/explorer/index.html', explorerHtml);
}

// Run all generators
generateStatsFiles();
generateVisualizerFiles();
generateShaderFiles();
generateProgramFiles();
generateExplorerFiles();
generateTemplates();

// Generate stats dashboard
function generateStatsFiles() {
    const statsHtml = `<!DOCTYPE html>
<html>
<head>
    <title>HDGL Network Statistics</title>
    <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f0f0f0; }
        .chart-container {
            background: white;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <h1>HDGL Network Statistics</h1>
    <div class="chart-container">
        <canvas id="phaseChart"></canvas>
    </div>
    <div class="chart-container">
        <canvas id="consensusChart"></canvas>
    </div>
    <div id="stats-data">
        <p>Evolution Count: <span id="evolution-count">Connecting...</span></p>
        <p>Phase Variance: <span id="phase-variance">Connecting...</span></p>
        <p>Consensus Status: <span id="consensus-status">Connecting...</span></p>
        <p>Active Connections: <span id="active-connections">Connecting...</span></p>
        <p>Last Update: <span id="last-update">Connecting...</span></p>
    </div>

    <script>
        const socket = io('/stats');

        // Update stats in real-time
        socket.on('stats_update', function(data) {
            console.log('Stats update received:', data);

            document.getElementById('evolution-count').textContent = data.evolution_count || 'N/A';
            document.getElementById('phase-variance').textContent = data.phase_variance ? data.phase_variance.toFixed(8) : 'N/A';
            document.getElementById('consensus-status').textContent = data.consensus_locked ? 'Locked' : 'Unlocked';
            document.getElementById('active-connections').textContent = data.active_connections || '0';
            document.getElementById('last-update').textContent = new Date().toLocaleTimeString();

            // Update page title with current evolution
            document.title = \`HDGL Stats - Evolution \${data.evolution_count || 0}\`;
        });

        socket.on('connect', function() {
            console.log('Socket.IO connected to stats!');
        });

        socket.on('disconnect', function() {
            console.log('Socket.IO disconnected from stats');
            document.getElementById('evolution-count').textContent = 'Disconnected';
            document.getElementById('phase-variance').textContent = 'Disconnected';
            document.getElementById('consensus-status').textContent = 'Disconnected';
        });
    </script>
</body>
</html>`;

    ensureDir('static/stats');
    fs.writeFileSync('static/stats/index.html', statsHtml);
}

// Generate visualizer files
function generateVisualizerFiles() {
    const visualizerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🌟 HDGL Lattice Field Visualizer 🌟</title>
    <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            background: linear-gradient(135deg, #0a0a0a, #1a1a2e, #16213e);
            color: #ffffff;
            font-family: 'Courier New', monospace;
            overflow: hidden;
            height: 100vh;
        }

        .header {
            position: absolute;
            top: 15px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 100;
            color: #ffd700;
            text-shadow: 0 0 20px #ffd700;
            font-size: 1.8em;
            font-weight: bold;
        }

        .controls {
            position: absolute;
            top: 60px;
            left: 20px;
            z-index: 100;
            display: flex;
            flex-direction: column;
            gap: 10px;
            background: rgba(0, 0, 0, 0.7);
            padding: 15px;
            border-radius: 10px;
            border: 1px solid rgba(255, 215, 0, 0.3);
        }

        .status-panel {
            position: absolute;
            top: 60px;
            right: 20px;
            z-index: 100;
            background: rgba(0, 0, 0, 0.8);
            padding: 15px;
            border-radius: 10px;
            border: 1px solid rgba(255, 215, 0, 0.5);
            min-width: 200px;
        }

        .lattice-canvas {
            width: 100vw;
            height: 100vh;
            cursor: move;
            background: radial-gradient(circle at 50% 50%, #001122, #000000);
        }

        button {
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            color: #000;
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
            box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
        }

        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 215, 0, 0.5);
        }

        select {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 215, 0, 0.5);
            color: white;
            padding: 8px;
            border-radius: 5px;
        }

        .status-item {
            color: #ffd700;
            margin: 5px 0;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="header">🌟 HDGL Lattice Field Visualizer 🌟</div>

    <div class="controls">
        <button onclick="resetView()">Reset View</button>
        <select id="visualMode" onchange="changeMode()">
            <option value="lattice">Lattice Network</option>
            <option value="orbital">Orbital Mechanics</option>
            <option value="breathing">Breathing Field</option>
        </select>
        <button onclick="toggleAnimation()">Toggle Animation</button>
    </div>

    <div class="status-panel">
        <div class="status-item">Evolution: <span id="evolution">0</span></div>
        <div class="status-item">Variance: <span id="variance">0.000000</span></div>
        <div class="status-item">Nodes: <span id="nodeCount">0</span></div>
        <div class="status-item">Phase: <span id="phase">0.000</span></div>
        <div class="status-item">Mode: <span id="currentMode">Lattice</span></div>
    </div>

    <canvas id="latticeCanvas" class="lattice-canvas"></canvas>

    <script>
        const socket = io('/visualizer');

        // Constants inspired by enhanced_pot_visualizer2.html
        const PHI = 1.618033988749895;
        const INV_PHI = 1 / PHI;
        const GOLDEN_ANGLE = 2 * Math.PI * INV_PHI;

        class HDGLLatticeVisualizer {
            constructor() {
                this.canvas = document.getElementById('latticeCanvas');
                this.ctx = this.canvas.getContext('2d');
                this.setupCanvas();

                this.transform = { scale: 1, translateX: 0, translateY: 0, rotation: 0 };
                this.animationPhase = 0;
                this.isAnimating = true;
                this.visualMode = 'lattice';
                this.networkData = { nodes: [], phase_data: {} };

                this.setupEventListeners();
                this.animate();
            }

            setupCanvas() {
                this.canvas.width = window.innerWidth * devicePixelRatio;
                this.canvas.height = window.innerHeight * devicePixelRatio;
                this.ctx.scale(devicePixelRatio, devicePixelRatio);
                this.canvasWidth = window.innerWidth;
                this.canvasHeight = window.innerHeight;
            }

            setupEventListeners() {
                let isDragging = false;
                let lastX, lastY;

                this.canvas.addEventListener('mousedown', (e) => {
                    isDragging = true;
                    lastX = e.clientX;
                    lastY = e.clientY;
                });

                this.canvas.addEventListener('mousemove', (e) => {
                    if (isDragging) {
                        const dx = (e.clientX - lastX) / this.transform.scale;
                        const dy = (e.clientY - lastY) / this.transform.scale;
                        this.transform.translateX += dx;
                        this.transform.translateY += dy;
                        lastX = e.clientX;
                        lastY = e.clientY;
                    }
                });

                this.canvas.addEventListener('mouseup', () => { isDragging = false; });

                this.canvas.addEventListener('wheel', (e) => {
                    e.preventDefault();
                    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
                    this.transform.scale *= zoomFactor;
                    this.transform.scale = Math.max(0.1, Math.min(5, this.transform.scale));
                });

                window.addEventListener('resize', () => this.setupCanvas());
            }

            updateNetworkData(data) {
                this.networkData = data;
                if (data.phase_data) {
                    document.getElementById('evolution').textContent = data.phase_data.evolution_count || 0;
                    document.getElementById('variance').textContent = (data.phase_data.phase_variance || 0).toFixed(6);
                    document.getElementById('phase').textContent = ((data.phase_data.phase_variance || 0) % 1).toFixed(3);
                }
                document.getElementById('nodeCount').textContent = (data.nodes || []).length;
            }

            animate() {
                if (this.isAnimating) {
                    this.animationPhase += 0.02;
                }

                this.render();
                requestAnimationFrame(() => this.animate());
            }

            render() {
                this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

                // Apply transformations
                this.ctx.save();
                this.ctx.translate(this.canvasWidth / 2, this.canvasHeight / 2);
                this.ctx.scale(this.transform.scale, this.transform.scale);
                this.ctx.translate(this.transform.translateX, this.transform.translateY);
                this.ctx.rotate(this.transform.rotation);

                switch (this.visualMode) {
                    case 'lattice':
                        this.renderLatticeNetwork();
                        break;
                    case 'orbital':
                        this.renderOrbitalMechanics();
                        break;
                    case 'breathing':
                        this.renderBreathingField();
                        break;
                }

                this.ctx.restore();
            }

            renderLatticeNetwork() {
                const nodes = this.networkData.nodes || [];
                const centerX = 0, centerY = 0;
                const evolution = this.networkData.phase_data?.evolution_count || 0;
                const variance = this.networkData.phase_data?.phase_variance || 1.123;

                // Draw central hub with breathing effect
                const hubRadius = 15 + 5 * Math.sin(this.animationPhase * 0.618);
                const hubColor = this.networkData.phase_data?.consensus_locked ? '#00ff88' : '#ff6b6b';

                this.ctx.fillStyle = hubColor;
                this.ctx.strokeStyle = '#ffd700';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, hubRadius, 0, 2 * Math.PI);
                this.ctx.fill();
                this.ctx.stroke();

                // Draw lattice nodes in golden spiral
                nodes.forEach((node, i) => {
                    const angle = i * GOLDEN_ANGLE + this.animationPhase * 0.1;
                    const radius = 50 + Math.sqrt(i + 1) * 30;
                    const nodeX = Math.cos(angle) * radius;
                    const nodeY = Math.sin(angle) * radius;

                    // Individual node breathing based on variance
                    const nodeBreathe = 1 + 0.3 * Math.sin(this.animationPhase * 0.5 + i * 0.618 + variance);
                    const nodeRadius = (5 + i % 3) * nodeBreathe;

                    // Color based on position in lattice
                    const hue = (i * 137.5 + variance * 100) % 360; // Golden angle in degrees
                    const nodeColor = \`hsl(\${hue}, 70%, 60%)\`;

                    // Draw connection to center
                    this.ctx.strokeStyle = \`\${nodeColor}66\`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(centerX, centerY);
                    this.ctx.lineTo(nodeX, nodeY);
                    this.ctx.stroke();

                    // Draw node
                    this.ctx.fillStyle = nodeColor;
                    this.ctx.beginPath();
                    this.ctx.arc(nodeX, nodeY, nodeRadius, 0, 2 * Math.PI);
                    this.ctx.fill();

                    // Draw node glow
                    const gradient = this.ctx.createRadialGradient(nodeX, nodeY, 0, nodeX, nodeY, nodeRadius * 3);
                    gradient.addColorStop(0, \`\${nodeColor}44\`);
                    gradient.addColorStop(1, 'transparent');
                    this.ctx.fillStyle = gradient;
                    this.ctx.beginPath();
                    this.ctx.arc(nodeX, nodeY, nodeRadius * 3, 0, 2 * Math.PI);
                    this.ctx.fill();
                });
            }

            renderOrbitalMechanics() {
                const nodes = this.networkData.nodes || [];
                const evolution = this.networkData.phase_data?.evolution_count || 0;
                const variance = this.networkData.phase_data?.phase_variance || 1.123;

                // Multiple orbital rings
                const rings = 5;
                for (let ring = 0; ring < rings; ring++) {
                    const ringRadius = 50 + ring * 40;
                    const nodesInRing = Math.max(1, Math.floor(nodes.length / rings));
                    const ringSpeed = (ring + 1) * 0.005 * (variance - 1);

                    for (let n = 0; n < nodesInRing && ring * nodesInRing + n < nodes.length; n++) {
                        const angle = (n / nodesInRing) * 2 * Math.PI + this.animationPhase * ringSpeed;
                        const x = Math.cos(angle) * ringRadius;
                        const y = Math.sin(angle) * ringRadius;

                        const nodeIndex = ring * nodesInRing + n;
                        const nodeRadius = 3 + (nodeIndex % 5);
                        const orbitalBreathe = 1 + 0.2 * Math.sin(this.animationPhase + nodeIndex);

                        // Draw orbital trail
                        this.ctx.strokeStyle = \`hsl(\${ring * 60 + 30}, 50%, 40%)\`;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.beginPath();
                        this.ctx.arc(0, 0, ringRadius, 0, 2 * Math.PI);
                        this.ctx.stroke();

                        // Draw orbiting node
                        this.ctx.fillStyle = \`hsl(\${ring * 60 + 30}, 70%, 60%)\`;
                        this.ctx.beginPath();
                        this.ctx.arc(x, y, nodeRadius * orbitalBreathe, 0, 2 * Math.PI);
                        this.ctx.fill();
                    }
                }
            }

            renderBreathingField() {
                const nodes = this.networkData.nodes || [];
                const variance = this.networkData.phase_data?.phase_variance || 1.123;

                // Global breathing rhythm
                const globalBreathe = 1 + 0.4 * Math.sin(this.animationPhase * 0.618);

                // Create breathing hexagonal grid
                const gridSize = 40;
                const rows = 15;
                const cols = 20;

                for (let row = -rows/2; row < rows/2; row++) {
                    for (let col = -cols/2; col < cols/2; col++) {
                        const x = col * gridSize + (row % 2) * (gridSize/2);
                        const y = row * gridSize * 0.866; // hexagonal spacing

                        const distance = Math.sqrt(x*x + y*y);
                        const wave = Math.sin(distance * 0.01 - this.animationPhase * 0.1);
                        const localBreathe = globalBreathe * (1 + 0.3 * wave);

                        const cellRadius = 8 * localBreathe;
                        const intensity = Math.max(0, 1 - distance / 400);

                        if (intensity > 0) {
                            // Breathing cell with variance-influenced color
                            const hue = (variance * 100 + wave * 30) % 360;
                            this.ctx.fillStyle = \`hsla(\${hue}, 60%, 50%, \${intensity * 0.6})\`;
                            this.ctx.beginPath();
                            this.ctx.arc(x, y, cellRadius, 0, 2 * Math.PI);
                            this.ctx.fill();
                        }
                    }
                }
            }
        }

        // Global functions
        let visualizer;

        function resetView() {
            if (visualizer) {
                visualizer.transform = { scale: 1, translateX: 0, translateY: 0, rotation: 0 };
            }
        }

        function changeMode() {
            const mode = document.getElementById('visualMode').value;
            if (visualizer) {
                visualizer.visualMode = mode;
                document.getElementById('currentMode').textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
            }
        }

        function toggleAnimation() {
            if (visualizer) {
                visualizer.isAnimating = !visualizer.isAnimating;
            }
        }

        // Socket.IO connections
        socket.on('connect', function() {
            console.log('HDGL Lattice Visualizer connected!');
        });

        socket.on('network_data', function(data) {
            console.log('Lattice data received:', data);
            if (visualizer) {
                visualizer.updateNetworkData(data);
            }
        });

        // Initialize visualizer
        document.addEventListener('DOMContentLoaded', function() {
            visualizer = new HDGLLatticeVisualizer();
        });
    </script>
</body>
</html>`;

    ensureDir('static/visualizer');
    fs.writeFileSync('static/visualizer/index.html', visualizerHtml);
}// Generate basic shader files
function generateShaderFiles() {
    const vertexShader = `
uniform float time;
varying vec3 vColor;

void main() {
    vColor = vec3(position.x + 0.5, position.y + 0.5, sin(time) * 0.5 + 0.5);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

    const fragmentShader = `
varying vec3 vColor;

void main() {
    gl_FragColor = vec4(vColor, 1.0);
}`;

    ensureDir('shaders');
    fs.writeFileSync('shaders/vertex.glsl', vertexShader);
    fs.writeFileSync('shaders/fragment.glsl', fragmentShader);
}

// Create template directories
function generateTemplates() {
    ensureDir('templates/stats');
    ensureDir('templates/visualizer');
}

// Run all generators
generateStatsFiles();
generateVisualizerFiles();
generateShaderFiles();
generateTemplates();

console.log('Static files and templates generated successfully!');