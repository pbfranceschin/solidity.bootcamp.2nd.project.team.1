import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';
import { argv } from 'node:process';
import { Ballot__factory } from '../typechain-types';


dotenv.config({path: '../.env'});

// script should be called with arguments:
// bytes32 proposal_1, ..., bytes32 proposal_i
//

const PROPOSALS: any[] = [];
const network = "goerli";
// const apiKey = process.env.ALCHEMY_API_KEY;
const apiKey = process.env.INFURA_API_KEY;
const privateKey =  process.env.PRIVATE_KEY_1;



const main = async () => {
    const arr = process.argv.slice(2)
    if(arr.length <= 0){
        throw new Error("missing arguments: bytes32[] proposalNames")
    }
    console.log(arr)
    arr.map((e) => {
        PROPOSALS.push(ethers.utils.formatBytes32String(e))
    })
    console.log(PROPOSALS)

    if(!privateKey || privateKey.length <= 0) throw new Error("missing enviroment: PRIVATE_KEY")
    console.log("key check")
    const provider = new ethers.providers.InfuraProvider(
        network, apiKey
    )
    const signer = new ethers.Wallet(privateKey, provider)
        
    const ballotFactory = new Ballot__factory(signer)
    console.log('deploying...')
    const ballotContract = await ballotFactory.deploy(PROPOSALS)
    console.log('pending...')
    const receipt = await ballotContract.deployTransaction.wait()
    console.log(`contract deployed to ${network} at address ${ballotContract.address} in tx ${receipt.transactionHash} at block ${receipt.blockNumber}`)
    

};

main().catch((err) => {
    console.error(err)
    process.exitCode = 1
});

