# 🔗 Blockchain Simulator

![Project Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![Tech](https://img.shields.io/badge/built%20with-Vite%20%7C%20Tailwind%20%7C%20TypeScript-blueviolet)

A **modern, interactive, and educational blockchain simulator** designed to visualize the internal mechanics of distributed ledger technology. This project demonstrates **transactions, mining, cryptographic hashing, and block integrity** through a clean and intuitive user interface.

> **Note:** This project is for **educational and demonstration purposes** only and does not implement a real tradable cryptocurrency.

---

## 🏫 Academic Context

This project was developed during a **Practical Work (TP) session** at **ENSIM** (École Nationale Supérieure d'Ingénieurs du Mans).

* **Supervisor:** Professor Youssef Serrestou
* **Goal:** To implement and visualize core cryptographic concepts used in blockchain technology.

---

## 🎮 Try It Out

Explore the live application or view the accompanying research notebook:

| **Live Demo** | **Educational Notebook** |
|:---:|:---:|
| [🚀 **Launch App**](https://blockchainsimulator.lovable.app/) | [📓 **Open Notebook**](https://colab.research.google.com/drive/1m0TmrV35Jvl7je3WKRV9izdXo-K81lPy#scrollTo=UHK2DmKeXUdK) |
| *Click to try the simulator* | *Deep dive into the math & logic* |

---

## ✨ Features

* 🧱 **Interactive Blockchain:** Visualize how blocks are cryptographically linked in real-time.
* 🔐 **SHA-256 Hashing:** See how data changes affect the hash immediately.
* ⛏️ **Proof-of-Work (PoW):** Simulate mining with adjustable difficulty levels (nonce discovery).
* 💸 **Mempool Visualization:** Manage a transaction pool before blocks are mined.
* 🚨 **Tamper Detection:** Visual indicators when chain integrity is broken by data modification.
* 🎨 **Modern UI/UX:** Built with **Lovable** for a polished, responsive, and professional interface.

---

## 🛠️ Technology Stack

This project leverages modern web development tools for performance and developer experience:

* **Framework:** [React](https://react.dev/) (via Vite)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Runtime/Package Manager:** [Bun](https://bun.sh/) (or Node.js)
* **UI Generation:** [Lovable](https://lovable.dev/)

---

## 🚀 Installation & Setup

You can run this project locally using `npm` or `bun`.

### 1. Clone the repository
```bash
git clone https://github.com/FANZIZakariae/chain-explorer-pro.git
cd blockchain-simulator
```
### 2. Install dependencies
```bash
npm install
```
### 3. Run the development server
```bash
npm run dev
```

## 🧠 How It Works

The simulator models a simplified blockchain data structure to visualize the mechanics of distributed ledgers:

1.  **Block Structure**
    Each block contains a `timestamp`, a list of `transactions`, the `previous hash`, a `nonce`, and its own `current hash`.

2.  **Hashing**
    We use the **SHA-256** algorithm. Any change to the data inside a block (even a single character) changes its hash completely, alerting the user to data tampering.

3.  **Linking**
    Blocks point to the hash of the *previous* block.
    * If **Block #1** is modified, its hash changes.
    * Consequently, **Block #2** (which points to Block #1's old hash) becomes invalid.
    * This "domino effect" demonstrates the immutability of the chain.

4.  **Mining**
    To add a block to the chain, the user (miner) must find a specific `nonce` value. This value must result in a block hash that starts with a specific number of zeros (the **Difficulty** target).

---

## 📚 References & Research

The implementation of this simulator is based on foundational concepts in cryptography and distributed systems. Below are the key resources and research papers used:

* **Bitcoin Whitepaper (The Foundation)**
    * *Nakamoto, S. (2008). Bitcoin: A Peer-to-Peer Electronic Cash System.*
    * 📄 [Read the paper](https://bitcoin.org/bitcoin.pdf)
    * **Used for:** Understanding the Proof-of-Work (PoW) mechanism and the linked-list structure of blocks.

* **SHA-256 Standard**
    * *National Institute of Standards and Technology (NIST). (2015). Secure Hash Standard (SHS) (FIPS PUB 180-4).*
    * 📄 [Read the standard](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf)
    * **Used for:** Implementing the cryptographic hashing algorithm that secures the chain integrity.

* **Visualizing Blockchain**
    * *Anders Brownworth (MIT). Blockchain 101 Demo.*
    * 🔗 [View the demo](https://andersbrownworth.com/blockchain/)
    * **Used for:** Inspiration for the visual interaction model and state management logic.
 
## 📄 License
This project is open-source and available under the MIT License.
