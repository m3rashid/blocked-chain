const { blockChain, nodeIdentifier } = require("./blockchain");

const mine = (req, res) => {
  const lastBlock = blockChain.lastBlock();
  const lastProof = lastBlock.proof;
  const proof = blockChain.proofOfWork(lastProof);

  blockChain.newTransaction(0, nodeIdentifier, 1);

  const prevhash = blockChain.hash(lastBlock);
  const block = blockChain.newBlock(proof, prevhash);
  return res.status(200).json({
    ...block,
    message: "The new block has been forged",
  });
};

const newTransaction = (req, res) => {
  const { sender, recipient, amount } = req.body;
  if (!sender || !recipient || !amount) throw new Error("Invalid transaction");

  const index = blockChain.newTransaction(sender, recipient, amount);
  return res.status(201).json({
    message: "Transaction is scheduled to be added to Block No. " + index,
  });
};

const chain = (req, res) => {
  return res.status(200).json({
    chain: blockChain.chain,
    length: blockChain.chain.length,
  });
};

const makeSafe = (check) => (req, res, next) => {
  Promise.resolve(check(req, res, next)).catch(next);
};

module.exports = {
  mineRouter: makeSafe(mine),
  newTransactionRouter: makeSafe(newTransaction),
  chainRouter: makeSafe(chain),
};
