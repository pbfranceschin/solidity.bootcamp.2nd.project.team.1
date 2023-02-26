import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';
import { argv } from 'node:process';
import ballot from '../artifacts/contracts/Ballot.sol/Ballot.json';


dotenv.config({path: '../.env'});

// // 
// script should be called with arguments (in order):
// address contract , address voter , 
// //
//

const getContractAbi = () => {
    const abi = ballot.abi;
    return abi;
};

 
const network = "goerli"
const account = "0x099A294Bffb99Cb2350A6b6cA802712D9C96676A";
const privateKey =  process.env.PRIVATE_KEY;
const apiKey = process.env.INFURA_API_KEY;

const main = async () => {
    
    const args = process.argv.slice(2);
    // console.log(args)
    if(args.length <= 1){
        throw new Error("missing argument: address voter or address contract");
    }
    if(!privateKey || privateKey.length <= 0) throw new Error("missing enviroment: PRIVATE_KEY");

    const contractAddress = args[0];
    const voter = args[1];
    
    const provider = new ethers.providers.InfuraProvider(network, apiKey);    

    const signer = new ethers.Wallet(privateKey, provider);

    const contractAbi = getContractAbi();
    const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
    );
    
    console.log("sending...");
    const tx = await contract.giveRightToVote(voter);
    console.log("pending...");
    const txReceipt = await tx.wait();
    console.log(`sucess! tx ${txReceipt.transactionHash} included at block ${txReceipt.blockNumber}` );

};

main().catch((err) => {
    console.error(err)
    process.exitCode = 1
});
