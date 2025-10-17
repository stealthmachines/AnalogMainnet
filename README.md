# HDGL Analog Mainnet V2.7-Stable

**A revolutionary hybrid analog-digital blockchain computing system that bridges continuous physics simulation with discrete computational models through distributed consensus.**

[![Version](https://img.shields.io/badge/version-2.7--stable-green.svg)](https://github.com/stealthmachines/AnalogMainnet/releases/tag/v2.7-stable)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/stealthmachines/AnalogMainnet)

## 🌌 Project Overview

HDGL Analog Mainnet represents a paradigm shift in computing: **the world's first Turing-complete analog-digital hybrid blockchain**. By combining continuous analog physics simulation with discrete digital computation and distributed blockchain consensus, we've created a new class of computing system that transcends traditional classical limitations.

### Core Innovation: Three-Layer Reality Computing

1. **🌊 Analog Layer**: Continuous physics simulation using differential equations
2. **🔢 Digital Layer**: Discrete Turing Machine computation with high-precision mathematics  
3. **⛓️ Blockchain Layer**: Distributed consensus on hybrid analog-digital states

## 🚀 Quick Start

### Prerequisites
- **Docker & Docker Compose**
- **Node.js** (for static file generation)
- **Python 3.8+** (for local development)
- **Git** (for version control)

### Launch System (Windows)
```powershell
# Clone repository
git clone https://github.com/stealthmachines/AnalogMainnet.git
cd AnalogMainnet

# Start all services
./start.ps1 -mode all -build
```

### Launch System (Linux/Mac)
```bash
# Clone repository  
git clone https://github.com/stealthmachines/AnalogMainnet.git
cd AnalogMainnet

# Start all services
chmod +x start.ps1
./start.ps1 -mode all -build
```

### Service Access URLs
- **🏠 Main Portal**: http://localhost:8080
- **📊 Network Explorer**: http://localhost:8080/explorer
- **💻 Program Interface**: http://localhost:8080/program  
- **📈 Statistics Dashboard**: http://localhost:8080/stats
- **🌌 3D Visualizer**: http://localhost:8080/visualizer
- **🔧 Bridge API**: http://localhost:9999
- **⛓️ Ethereum Node**: http://localhost:8545
- **🌐 IPFS Gateway**: http://localhost:8081

## 🏗️ Architecture

### System Components

#### Core Simulation Engine (`hdgl_analog_v26.c`)
```c
// 4th-order Runge-Kutta integrator for continuous analog evolution
#define CONSENSUS_EPS 1e-6    // Consensus precision threshold
#define CONSENSUS_N 100       // Consensus validation iterations  
#define GAMMA 0.02           // Harmonic damping coefficient
#define K_COUPLING 1.0       // Lattice coupling strength
```

**Features:**
- Real-time analog lattice field simulation
- RK4 numerical integration for stability
- Optional hardware RTC synchronization (DS3231)
- MPI support for distributed computation
- Deterministic evolution with consensus validation

#### Bridge Service (`hdgl_bridge_v36.py`)
```python
# High-precision mathematics for consensus
CONSENSUS_EPS = Decimal('1e-6')  # Must match C constants
GAMMA = Decimal('0.02')
K_COUPLING = Decimal('1.0')
```

**Features:**
- High-precision decimal mathematics (mpmath)
- 7-dimensional state vector encoding
- Turing Machine simulation with infinite tape
- Checkpoint management with geometric decay
- IPFS/Ethereum integration for persistence
- Real-time Socket.IO data streaming

#### Web Services (`web_services.py`)
```python
# Combined Flask application with Socket.IO v4.7.2
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
```

**Features:**
- Real-time multi-namespace Socket.IO communication
- Cross-service data broadcasting
- RESTful API endpoints
- WebGL-accelerated 3D visualization
- Monaco editor for program development

### Data Flow Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Analog Engine  │───▶│  Bridge Service  │───▶│  Web Services   │
│                 │    │                  │    │                 │
│ • RK4 Evolution │    │ • State Encoding │    │ • Socket.IO     │
│ • Phase Updates │    │ • 7D Vectors     │    │ • Broadcasting  │
│ • Hardware RTC  │    │ • Turing Machine │    │ • Web Interface │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Blockchain Layer                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  Ethereum   │  │    IPFS     │  │      ChargNet POA       │ │
│  │ Commitments │  │   Storage   │  │   Fast Consensus        │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 🔧 Configuration

### Core Configuration (`config.json`)
```json
{
  "eth_rpc": "http://eth-node:8545",
  "eth_contract": "0xD885520B7EDF9a8577E87a3907c689AbB73582Ff", 
  "poll_interval": 5,
  "auto_evolve": true,
  "tm_tape_size": 5,
  "checkpoint_interval": 100,
  "ipfs_endpoint": "http://ipfs:5001",
  "bridge_data_port": 9999
}
```

### Docker Profiles
```bash
# All services (default)
docker compose up -d

# Web services only
docker compose --profile webhost up -d

# Bridge service only  
docker compose --profile bridge up -d

# IPFS only
docker compose --profile ipfs up -d

# Hardware I2C support (Linux only)
docker compose --profile i2c up -d
```

## 💻 Development

### Building Components

#### Native C Compilation
```bash
# Standard build
gcc -o hdgl_analog hdgl_analog_v26.c -lm -O3

# With hardware RTC support
gcc -o hdgl_analog hdgl_analog_v26.c -lm -li2c -DUSE_DS3231 -O3

# With MPI distributed computing
mpicc -o hdgl_analog hdgl_analog_v26.c -lm -DMPI_REAL=1 -O3
```

#### Python Development
```bash
# Install dependencies
pip install -r requirements.txt

# Run bridge service locally
python hdgl_bridge_v36.py

# Run smoke test
python hdgl_bridge_v36.py --smoke
```

#### Web Development
```bash
# Generate static files
node generate_static.js

# Install Node.js dependencies
npm install socket.io-client@4.7.2 three chart.js
```

### Static File Generation
All web interface files are generated from `generate_static.js`:
```bash
node generate_static.js
```
This creates:
- `templates/` - Flask template files
- `static/` - CSS, JavaScript, and HTML assets
- WebGL shaders for 3D visualization
- Socket.IO client integration

## 🏗️ POA Network Deployment

### ChargNet POA (Recommended)
```bash
cd "POA candidates/mainnet2/docker-charg1/"
docker compose up -d
```

**Network Specifications:**
- **Chain ID**: 22177
- **Consensus**: Clique Proof-of-Authority
- **Block Time**: 10 seconds
- **Validators**: 3-node setup (miner1, miner2, rpc-node)
- **Ports**: 8555 (RPC), 8556 (WebSocket), 8557-8558 (P2P)

### HDGL-Ethereum Integration
```bash
cd "POA candidates/mainnet/"
docker compose up -d
```

**Integration Features:**
- Public Ethereum mainnet connection
- IPFS distributed storage
- Smart contract state commitments
- Cross-chain consensus validation

## 🔬 Technical Specifications

### Analog Engine Mathematics
The core analog simulation uses harmonic lattice field equations:

```
dψ/dt = -iHψ + γ∇²ψ + κΣⱼψⱼ

Where:
- ψ: Complex analog field state
- H: Hamiltonian operator  
- γ: Damping coefficient (GAMMA = 0.02)
- κ: Coupling strength (K_COUPLING = 1.0)
- ∇²: Laplacian operator for diffusion
```

### State Encoding Protocol
Analog states are encoded into 7-dimensional vectors:
```python
state_vector = [x, y, z, phase, momentum, energy, timestamp]
```

Each dimension uses high-precision Decimal arithmetic to ensure consensus across distributed nodes.

### Consensus Mechanism
1. **Analog Evolution**: Continuous physics simulation
2. **Digital Sampling**: Periodic state vector extraction  
3. **Blockchain Commitment**: Cryptographic state hashing
4. **Distributed Validation**: Multi-node consensus verification

## 🌐 Use Cases

### Quantum-Classical Computing Bridge
- **Challenge**: Classical computers cannot simulate true quantum effects
- **Solution**: Analog lattice provides continuous "quantum-like" substrate
- **Benefit**: Hybrid computation transcending classical limitations

### Verifiable Analog Computing  
- **Challenge**: Analog computers traditionally lack reproducibility
- **Solution**: Digital encoding + blockchain commitment provides proof
- **Benefit**: Analog computation with cryptographic verification

### Distributed Physics Simulation
- **Challenge**: Complex physics requires massive computational resources
- **Solution**: Multiple nodes run coordinated analog engines
- **Benefit**: Decentralized supercomputing for continuous systems

### Programmable Reality Engine
- **Challenge**: No standard for consensus on continuous system states
- **Solution**: Blockchain consensus on analog+digital hybrid states  
- **Benefit**: Shared "reality" that multiple parties can trust

## 🧪 Testing & Validation

### System Health Check
```bash
# Smoke test
python hdgl_bridge_v36.py --smoke

# Service status
docker ps

# Bridge API test
curl http://localhost:9999/status
```

### Integration Testing
```bash
# Check analog evolution
curl http://localhost:9999/evolution

# Test program execution
curl -X POST http://localhost:9999/api/program \
  -H "Content-Type: application/json" \
  -d '{"code": "print(\"Hello HDGL\")"}'

# Verify IPFS connectivity
curl http://localhost:5001/api/v0/version
```

## 📊 Monitoring & Metrics

### Real-Time Monitoring
- **Evolution Count**: Track analog engine iterations
- **Consensus Status**: Monitor distributed node agreement
- **Blockchain Sync**: Verify commitment propagation
- **Network Health**: POA validator status and connectivity

### Performance Metrics
- **Analog Frequency**: Evolution steps per second
- **Digital Throughput**: Turing Machine operations per second  
- **Blockchain Latency**: Commitment confirmation time
- **Consensus Precision**: Agreement accuracy across nodes

## 🔒 Security Considerations

### Cryptographic Security
- **State Commitments**: Web3 Keccak-256 hashing
- **Private Keys**: Secure keystore management
- **Network Isolation**: Docker container segregation
- **API Authentication**: Bridge service access control

### Consensus Security
- **Deterministic RNG**: Reproducible random number generation
- **Precision Validation**: High-precision arithmetic consensus
- **Byzantine Tolerance**: POA validator majority requirements
- **State Verification**: Cross-node computation validation

## 🛠️ Troubleshooting

### Common Issues

#### Socket.IO Version Mismatch
```bash
# Ensure versions match:
# Server: flask-socketio==5.3.6  
# Client: socket.io-client v4.7.2
npm install socket.io-client@4.7.2
```

#### IPFS Connection Errors
```bash
# Check IPFS node status
docker logs source-101625-ipfs-1

# Restart IPFS service
docker compose restart ipfs
```

#### Build Dependencies Missing
```bash
# Install required system packages
apt-get update && apt-get install -y \
  build-essential libssl-dev python3-dev \
  nodejs npm git
```

### Performance Optimization

#### High-Performance Analog Engine
```bash
# Enable compiler optimizations
gcc -o hdgl_analog hdgl_analog_v26.c -lm -O3 -march=native

# Use hardware floating-point
gcc -o hdgl_analog hdgl_analog_v26.c -lm -O3 -mfpu=neon
```

#### Bridge Service Scaling
```python
# Increase checkpoint frequency for faster convergence
CHECKPOINT_INTERVAL = 50  # Default: 100

# Optimize precision vs performance
CONSENSUS_EPS = Decimal('1e-4')  # Less precise, faster
```

## 📚 Documentation

### API Documentation
- **Bridge API**: RESTful endpoints for system control
- **Socket.IO Events**: Real-time data streaming protocol
- **WebGL Shaders**: 3D visualization rendering pipeline
- **Smart Contracts**: Ethereum integration specifications

### Research Papers
- "Analog-Digital Hybrid Consensus Mechanisms"
- "Turing-Complete Analog Computing Systems"  
- "Distributed Continuous State Validation"
- "Quantum-Classical Computation Bridging"

## 🤝 Contributing

### Development Workflow
1. **Fork Repository**: Create personal development branch
2. **Feature Development**: Implement changes with tests
3. **Code Review**: Submit pull request for review
4. **Integration Testing**: Validate system compatibility
5. **Documentation**: Update relevant documentation
6. **Deployment**: Merge to main branch

### Code Standards
- **C Code**: GNU C99 standard with -Wall -Wextra
- **Python Code**: PEP 8 compliance with type hints
- **JavaScript**: ES6+ with Socket.IO best practices
- **Documentation**: Markdown with clear examples

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Acknowledgments

- **Ethereum Foundation**: Blockchain infrastructure inspiration
- **IPFS Protocol Labs**: Distributed storage architecture
- **Socket.IO Team**: Real-time communication framework
- **Open Source Community**: Foundational tools and libraries

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/stealthmachines/AnalogMainnet/issues)
- **Discussions**: [GitHub Discussions](https://github.com/stealthmachines/AnalogMainnet/discussions)
- **Documentation**: [Wiki](https://github.com/stealthmachines/AnalogMainnet/wiki)

---

**HDGL Analog Mainnet V2.7-Stable** - *Bridging the gap between continuous physics and discrete computation through distributed consensus.*

*Built with ❤️ by the StealthMachines team*