const uuid = require("uuid");
const crypto = require("crypto");

class BlockChain {
  constructor() {
    this.chain = [];
    this.currentTransactions = [];
    this.newBlock(1, 100);
  }

  proofOfWork(lastProof) {
    let proof = 0;
    while (this.validProof(lastProof, proof) === false) {
      proof++;
    }
    return proof;
  }

  validProof(lastProof, proof) {
    const guess = `${lastProof}${proof}`.toString();
    const hash = crypto.createHash("sha256").update(guess).digest("hex");
    return hash.startsWith("0000");
  }

  newBlock(proof, previousHash = null) {
    const block = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      proof: proof,
      previousHash: previousHash,
    };
    this.currentTransactions = [];
    this.chain.push(block);
    return block;
  }

  newTransaction(sender, recipient, amount) {
    this.currentTransactions.push({
      sender,
      recipient,
      amount,
    });
    return this.lastBlock().index + 1;
  }

  hash(block) {
    return crypto
      .createHash("sha256")
      .update(JSON.stringify(block))
      .digest("hex");
  }

  lastBlock() {
    return this.chain[this.chain.length - 1];
  }
}

module.exports = {
  blockChain: new BlockChain(),
  nodeIdentifier: uuid.v4().toString().replaceAll("-", ""),
};
