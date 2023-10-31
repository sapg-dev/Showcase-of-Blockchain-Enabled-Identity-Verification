class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = '';
    }

    async calculateHash() {
        const encoder = new TextEncoder();
        const data = encoder.encode(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer)); 
        this.hash = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        return this.hash;
    }
}

class Blockchain {
    constructor() {
        this.chain = [];
        this.createGenesisBlock();
    }

    async createGenesisBlock() {
        const genesisBlock = new Block(0, Date.now(), { name: 'Genesis Block', idNumber: '0000000' });
        genesisBlock.hash = await genesisBlock.calculateHash();
        this.chain.push(genesisBlock);
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    async addBlock(data) {
        const previousBlock = this.getLatestBlock();
        const newBlock = new Block(previousBlock.index + 1, Date.now(), data, previousBlock.hash);
        newBlock.hash = await newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    async isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== await currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

export { Block, Blockchain };
