var cron = require('node-cron');
let i = 1;
cron.schedule('20 * * * *', () => {
 require('dotenv').config();
 const API_URL = process.env.API_URL;
 const PUBLIC_KEY = process.env.PUBLIC_KEY;
 const PRIVATE_KEY = process.env.PRIVATE_KEY;
 
 const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
 const web3 = createAlchemyWeb3(API_URL);
 
 const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");
 const contractAddress = "0x0B19047E20Fc82158Fce4420081a00DF8b015885";
 const nftContract = new web3.eth.Contract(contract.abi, contractAddress);
 
 async function mintNFT(tokenURI) {
   const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce
 
   //the transaction
   const tx = {
     'from': PUBLIC_KEY,
     'to': contractAddress,
     'nonce': nonce,
     'gas': 500000,
     'maxPriorityFeePerGas': 2999999987,
     'data': nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI()
   };
 
   const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
   const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
   
   console.log(`Transaction receipt: ${JSON.stringify(transactionReceipt)}`);
 }
 
 //mintNFT("https://gateway.pinata.cloud/ipfs/QmQJF64jqXAwwXmTKZt6iwNDduyMbQv9HWDFELTg7rPrvQ");
 mintNFT("https://greekletters.alwaysdata.net/GreekLetters/"+i+".png");
 i++;
});