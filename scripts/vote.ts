import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';
import { argv } from 'node:process';
import { getContractAbi } from '../utils/contractData';
import { Contract } from 'ethers';

dotenv.config({path: '../.env'});

// script should be called with arguments (in order):
// address contract , uint proposal
//

const network = "goerli"
const account = "0x778070825fE59026A882cAe236109ce30bD33d44";
const privateKey =  process.env.PRIVATE_KEY_1;
// const apiKey = process.env.INFURA_API_KEY;
const apiKey = process.env.ALCHEMY_API_KEY;


const main =async () => {
    
    const args = process.argv.slice(2);
    // console.log(args);
    if(args.length <= 1){
        throw new Error("missing argument: address contract and/or uint proposal ")
    }
    if(!privateKey || privateKey.length <= 0) throw new Error("missing enviroment: PRIVATE_KEY");
    if(!apiKey || apiKey.length <= 0) throw new Error("missing enviroment: API_KEY");
    // console.log(args);
    // console.log(privateKey);

    const contractAddress = args[0];
    const proposal = args[1];

    const provider = new ethers.providers.AlchemyProvider(network, apiKey);
    // const balance = await provider.getBalance(account);
    // console.log(balance);

    const signer = new ethers.Wallet(privateKey, provider)
    const contractAbi = getContractAbi();
    const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
    );
    
    console.log("sending...");
    const tx = await contract.vote(proposal);
    console.log("pending...");
    const txReceipt = await tx.wait();
    console.log(`sucess! tx ${txReceipt.transactionHash} included at block ${txReceipt.blockNumber}`);

};

main().catch((err) => {
    console.error(err)
    process.exitCode = 1
});
