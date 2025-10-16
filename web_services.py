from flask import Flask, render_template, send_from_directory, request
from flask_socketio import SocketIO, emit
import json
import os
import time
import threading
import hashlib
import random
from datetime import datetime

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')

# Common configuration
with open('config.json', 'r') as f:
    config = json.load(f)

# Global state for real-time data
network_state = {
    'blockHeight': 0,
    'stateHash': '',
    'timestamp': datetime.now().isoformat(),
    'phase_variance': 0.0,
    'evolution_count': 0,
    'consensus_locked': False
}

commitments = []
snapshots = []
program_tape = ""

# Explorer Service
@app.route('/explorer')
def explorer():
    return send_from_directory('static/explorer', 'index.html')

@socketio.on('connect', namespace='/explorer')
def explorer_connect():
    print('Explorer client connected')
    # Send initial state
    emit('state_update', network_state)
    emit('commitments_update', {'commitments': commitments})
    emit('snapshots_update', {'snapshots': snapshots})

@socketio.on('request_refresh', namespace='/explorer')
def explorer_refresh():
    print('Explorer refresh requested')
    emit('state_update', network_state)
    emit('commitments_update', {'commitments': commitments})
    emit('snapshots_update', {'snapshots': snapshots})

# Program Service
@app.route('/program')
def program():
    return send_from_directory('static/program', 'index.html')

@socketio.on('connect', namespace='/program')
def program_connect():
    print('Program client connected')
    emit('tape_status', {'code': program_tape, 'size': len(program_tape)})

@socketio.on('write_tape', namespace='/program')
def write_tape(data):
    global program_tape
    program_tape = data.get('code', '')
    print(f'Tape updated: {len(program_tape)} characters')
    emit('tape_status', {'code': program_tape, 'size': len(program_tape)}, broadcast=True)

@socketio.on('clear_tape', namespace='/program')
def clear_tape():
    global program_tape
    program_tape = ""
    print('Tape cleared')
    emit('tape_status', {'code': program_tape, 'size': len(program_tape)}, broadcast=True)

# Visualizer Service
@app.route('/visualizer')
def visualizer():
    return send_from_directory('static/visualizer', 'index.html')

@socketio.on('connect', namespace='/visualizer')
def visualizer_connect():
    print('Visualizer client connected')
    # Send current network visualization data
    emit('network_data', {
        'nodes': generate_network_nodes(),
        'connections': generate_network_connections(),
        'phase_data': network_state
    })

def generate_network_nodes():
    """Generate sample network nodes for visualization"""
    nodes = []
    for i in range(8):  # 8 nodes for lattice structure
        nodes.append({
            'id': i,
            'x': (i % 3) * 100 - 100,
            'y': (i // 3) * 100 - 100,
            'z': random.uniform(-50, 50),
            'phase': random.uniform(0, 6.28),  # 2π
            'active': network_state['consensus_locked']
        })
    return nodes

def generate_network_connections():
    """Generate connections between nodes"""
    connections = []
    for i in range(8):
        for j in range(i+1, 8):
            if random.random() < 0.3:  # 30% connection probability
                connections.append({
                    'source': i,
                    'target': j,
                    'strength': random.uniform(0.1, 1.0)
                })
    return connections

# Stats Service
@app.route('/stats')
def stats():
    return send_from_directory('static/stats', 'index.html')

@socketio.on('connect', namespace='/stats')
def stats_connect():
    print('Stats client connected')
    emit('stats_update', {
        'evolution_count': network_state['evolution_count'],
        'phase_variance': network_state['phase_variance'],
        'consensus_locked': network_state['consensus_locked'],
        'active_connections': len(generate_network_connections()),
        'uptime': int(time.time()),
        'memory_usage': generate_stats()
    })

def generate_stats():
    """Generate system statistics"""
    return {
        'cpu_usage': random.uniform(10, 80),
        'memory_usage': random.uniform(20, 70),
        'network_latency': random.uniform(1, 50),
        'consensus_health': random.uniform(0.7, 1.0)
    }

# Shared static file handling
@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

@app.route('/shaders/<path:path>')
def send_shader(path):
    return send_from_directory('shaders', path)

def background_updates():
    """Background thread for real-time updates"""
    while True:
        time.sleep(2)  # Update every 2 seconds

        # Update network state
        network_state['evolution_count'] += 1
        network_state['phase_variance'] = random.uniform(0.001, 1.5)
        network_state['consensus_locked'] = network_state['phase_variance'] < 0.1
        network_state['blockHeight'] += 1 if random.random() < 0.1 else 0
        network_state['stateHash'] = hashlib.sha256(f"{network_state['evolution_count']}{time.time()}".encode()).hexdigest()[:16]
        network_state['timestamp'] = datetime.now().isoformat()

        # Add new commitment occasionally
        if random.random() < 0.2:  # 20% chance every 2 seconds
            new_commitment = {
                'hash': hashlib.sha256(f"commitment_{time.time()}".encode()).hexdigest(),
                'confirmed': random.random() < 0.8,
                'timestamp': datetime.now().isoformat()
            }
            commitments.insert(0, new_commitment)
            if len(commitments) > 10:  # Keep only latest 10
                commitments.pop()

        # Add new snapshot occasionally
        if random.random() < 0.1:  # 10% chance every 2 seconds
            new_snapshot = {
                'cid': f"Qm{hashlib.sha256(f'snapshot_{time.time()}'.encode()).hexdigest()[:32]}",
                'height': network_state['blockHeight'],
                'timestamp': datetime.now().isoformat()
            }
            snapshots.insert(0, new_snapshot)
            if len(snapshots) > 5:  # Keep only latest 5
                snapshots.pop()

        # Broadcast updates to all connected clients
        socketio.emit('state_update', network_state, namespace='/explorer')
        socketio.emit('commitments_update', {'commitments': commitments}, namespace='/explorer')
        socketio.emit('snapshots_update', {'snapshots': snapshots}, namespace='/explorer')

        # Update visualizer
        socketio.emit('network_data', {
            'nodes': generate_network_nodes(),
            'connections': generate_network_connections(),
            'phase_data': network_state
        }, namespace='/visualizer')

        # Update stats
        socketio.emit('stats_update', {
            'evolution_count': network_state['evolution_count'],
            'phase_variance': network_state['phase_variance'],
            'consensus_locked': network_state['consensus_locked'],
            'active_connections': len(generate_network_connections()),
            'uptime': int(time.time()),
            'memory_usage': generate_stats()
        }, namespace='/stats')

if __name__ == '__main__':
    service = os.environ.get('SERVICE_TYPE', 'all')
    port = int(os.environ.get('PORT', 8080))

    # Start background update thread
    update_thread = threading.Thread(target=background_updates, daemon=True)
    update_thread.start()

    if service == 'all':
        socketio.run(app, host='0.0.0.0', port=port, allow_unsafe_werkzeug=True)
    else:
        # Individual service mode (for containerized deployment)
        app.config['SERVICE_TYPE'] = service
        socketio.run(app, host='0.0.0.0', port=port, allow_unsafe_werkzeug=True)