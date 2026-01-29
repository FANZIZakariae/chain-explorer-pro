# 🔗 Blockchain Simulator

A **modern and interactive blockchain simulator** designed to visualize how a blockchain works internally.  
This project demonstrates **transactions, mining, cryptographic hashing, and block integrity** through a clean and intuitive user interface.

> This project is for **educational and demonstration purposes** only and does not implement a real cryptocurrency.

---

## ✨ Features

- 🧱 Blockchain with cryptographically linked blocks  
- 🔐 SHA-256 hashing  
- ⛏️ Proof-of-Work mining with adjustable difficulty  
- 💸 Transaction pool (mempool)  
- 🚨 Tampering detection and chain validation  
- 🎨 Professional UI/UX with smooth animations  

---

## 🧠 How It Works

Each block contains:
- Timestamp  
- Transactions  
- Previous block hash  
- Nonce  
- Current block hash  

Blocks are linked using cryptographic hashes.  
Any modification to a block breaks the chain unless it is re-mined.

---

## 🚀 How to Run

Clone the repository :

```bash
git clone https://github.com/your-username/blockchain-simulator.git
cd blockchain-simulator

```
## Install dependencies and run:
```bash
npm install
npm run dev
http://localhost:3000
