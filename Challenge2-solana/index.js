// Import Solana web3 functionalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmRawTransaction,
    sendAndConfirmTransaction
  } = require("@solana/web3.js");
  
  //Generated a new Key Pair to extract Secret Key
  
  /*
  const newPair = Keypair.generate();
  console.log(newPair);*/
// Generated new key pair from above code and replaced the secret key below with my secret key
  
  
  
  const DEMO_FROM_SECRET_KEY = new Uint8Array(
    [
        194, 240,   1, 166,  57,  15, 222,  73,  30, 144, 254,
        138, 204, 137,  30, 248,  65, 100, 139,   7,  17, 154,
        109,  34, 110, 250,  82, 161, 133,   6, 240,  46, 233,
        164, 204, 189, 124,  84, 117, 198,  77, 216, 199,  48,
        190, 167, 132, 164, 169, 139, 177, 218, 173,  52, 242,
         97, 134,  25, 232, 254, 133,  37,   2, 114
      ]
      
  );
  
  const transferSol = async() => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  
    // Get Keypair from Secret Key
    var from = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);
  
    
  
    // Generate another Keypair (account we'll be sending to)
    const to = Keypair.generate();
  
    // Aidrop 2 SOL to Sender wallet
    console.log("Airdopping 2 SOL to Sender wallet!");
    const fromAirDropSignature = await connection.requestAirdrop(
        new PublicKey(from.publicKey),
        2 * LAMPORTS_PER_SOL
    );
  
    // Latest blockhash (unique identifer of the block) of the cluster
    let latestBlockHash = await connection.getLatestBlockhash();
  
    // Confirm transaction using the last valid block height (refers to its time)
    // to check for transaction expiration
    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: fromAirDropSignature
    });
  
    console.log("Airdrop completed for the Sender account");
  
    let fromBalance = await connection.getBalance(from.publicKey);
    let lamportFromBalance = fromBalance / LAMPORTS_PER_SOL;
    console.log('from wallet balance: ', lamportFromBalance);
  
    // Send 50%
    const HalfTransfer = lamportFromBalance / 2;
    console.log('token to transfer: ', HalfTransfer);
  
    let toBalance = await connection.getBalance(to.publicKey);
    let lamportToBalance = toBalance / LAMPORTS_PER_SOL;
    console.log('to wallet Balance: ', lamportToBalance);
  
    // Send money from "from" wallet and into "to" wallet
    // i.e send sol from sender to receiver
    var transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to.publicKey,
            lamports: parseFloat(HalfTransfer) * LAMPORTS_PER_SOL
        })
    );
  
    // Sign transaction with your private key
    var signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [from]
  );
  
    toBalance = await connection.getBalance(to.publicKey);
    lamportToBalance = toBalance / LAMPORTS_PER_SOL;
    console.log("to wallet balance: ", lamportToBalance);
    console.log('Signature is ', signature);
  }
  transferSol();