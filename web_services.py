from flask import Flask, render_template, send_from_directory
from flask_socketio import SocketIO, emit
import json
import os

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')

# Common configuration
with open('config.json', 'r') as f:
    config = json.load(f)

# Explorer Service
@app.route('/explorer')
def explorer():
    return render_template('explorer/index.html')

@socketio.on('connect', namespace='/explorer')
def explorer_connect():
    print('Explorer client connected')

# Program Service
@app.route('/program')
def program():
    return render_template('program/index.html')

@socketio.on('connect', namespace='/program')
def program_connect():
    print('Program client connected')

# Visualizer Service
@app.route('/visualizer')
def visualizer():
    return render_template('visualizer/index.html')

@socketio.on('connect', namespace='/visualizer')
def visualizer_connect():
    print('Visualizer client connected')

# Stats Service
@app.route('/stats')
def stats():
    return render_template('stats/index.html')

@socketio.on('connect', namespace='/stats')
def stats_connect():
    print('Stats client connected')

# Shared static file handling
@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

@app.route('/shaders/<path:path>')
def send_shader(path):
    return send_from_directory('shaders', path)

if __name__ == '__main__':
    service = os.environ.get('SERVICE_TYPE', 'all')
    port = int(os.environ.get('PORT', 8080))

    if service == 'all':
        socketio.run(app, host='0.0.0.0', port=port)
    else:
        # Individual service mode (for containerized deployment)
        app.config['SERVICE_TYPE'] = service
        socketio.run(app, host='0.0.0.0', port=port)