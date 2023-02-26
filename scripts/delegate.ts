import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';
import { argv } from 'node:process';
import { getContractAbi } from '../utils/contractData';

dotenv.config({path: '../.env'});

// contract should be called with arguments (in order):
// address contract , address to
// //
//

const network = "goerli"
const account = "0x778070825fE59026A882cAe236109ce30bD33d44";
const privateKey =  process.env.PRIVATE_KEY_2;
const apiKey = process.env.INFURA_API_KEY;


const main = async () => {
    const args = process.argv.slice(2);
    // console.log(args);
    if(args.length <= 1){
        throw new Error("missing argument: address to ")
    }
    if(!privateKey || privateKey.length <= 0) throw new Error("missing enviroment: PRIVATE_KEY");

    const contractAddress = args[0];
    const to = args[1];
    const provider = new ethers.providers.InfuraProvider(network, apiKey);
    // const balance = await provider.getBalance(account);
    // console.log(balance);

    const signer = new ethers.Wallet(privateKey, provider);
    
    const contractAbi = getContractAbi();
    const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
    );
    console.log("sending...");
    const tx = await contract.delegate(to);
    console.log("pending...");
    const txReceipt = await tx.wait();
    console.log(`sucess! tx ${txReceipt.transactionHash} included at block ${txReceipt.blockNumber}`);

};

main().catch((err) => {
    console.error(err)
    process.exitCode = 1
});
