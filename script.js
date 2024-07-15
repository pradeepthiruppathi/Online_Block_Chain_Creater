class Block {
    constructor(index, timestamp, data, previous_hash) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previous_hash = previous_hash;
        this.hash = this.calculate_hash();
    }

    calculate_hash() {
        const sha = new jsSHA("SHA-256", "TEXT");
        sha.update(this.index + this.timestamp + this.data + this.previous_hash);
        return sha.getHash("HEX");
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.create_genesis_block()];
    }

    create_genesis_block() {
        return new Block(0, new Date().toISOString(), "Genesis Block", "0");
    }

    get_latest_block() {
        return this.chain[this.chain.length - 1];
    }

    add_block(new_block) {
        new_block.previous_hash = this.get_latest_block().hash;
        new_block.hash = new_block.calculate_hash();
        this.chain.push(new_block);
    }

    is_valid() {
        for (let i = 1; i < this.chain.length; i++) {
            const current_block = this.chain[i];
            const previous_block = this.chain[i - 1];

            if (current_block.hash !== current_block.calculate_hash()) {
                return false;
            }

            if (current_block.previous_hash !== previous_block.hash) {
                return false;
            }
        }
        return true;
    }
}

let blockchain = null;

document.getElementById('create-blockchain-btn').addEventListener('click', () => {
    blockchain = new Blockchain();
    document.getElementById('block-form').classList.remove('hidden');
    document.getElementById('show-blockchain-btn').classList.remove('hidden');
});

document.getElementById('add-block-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = document.getElementById('data').value;
    const new_block = new Block(blockchain.chain.length, new Date().toISOString(), data, '');
    blockchain.add_block(new_block);
    document.getElementById('data').value = '';
    alert('Block added successfully!');
});

document.getElementById('show-blockchain-btn').addEventListener('click', () => {
    const blockchainContent = blockchain.chain.map(block => `
        Block #${block.index}
        Timestamp: ${block.timestamp}
        Data: ${block.data}
        Hash: ${block.hash}
        Previous Hash: ${block.previous_hash}
    `).join('\n\n');
    document.getElementById('blockchain-content').textContent = blockchainContent;
    document.getElementById('blockchain-display').classList.remove('hidden');
});
