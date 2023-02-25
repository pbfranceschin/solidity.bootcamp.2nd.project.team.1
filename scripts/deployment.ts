import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';
import { argv } from 'node:process';
import ballot from '../artifacts/contracts/Ballot.sol/Ballot.json'
import { Ballot__factory } from '../typechain-types';

dotenv.config();

const PROPOSALS: any[] = [];
const network = "goerli";
// const apiKey = process.env.ALCHEMY_API_KEY;
const apiKey = process.env.INFURA_API_KEY;
const privateKey =  process.env.PRIVATE_KEY;
// const account = "0x099A294Bffb99Cb2350A6b6cA802712D9C96676A";

const getContracData = () => {
    const abi = ballot.abi
    const bytecode = ballot.bytecode

    return [abi, bytecode]
}

const main = async () => {
    const arr = process.argv.slice(2)
    if(arr.length <= 0){
        throw new Error("missing arguments to constructor")
    }
    console.log(arr)
    arr.map((e) => {
        PROPOSALS.push(ethers.utils.formatBytes32String(e))
    })
    console.log(PROPOSALS)

    if(!privateKey || privateKey.length <= 0) throw new Error("missing enviroment: PRIVATE_KEY")
    
    const provider = new ethers.providers.InfuraProvider(
        network, apiKey
    )
    const signer = new ethers.Wallet(privateKey, provider)
    
    // const balance = await provider.getBalance(account)
    // console.log(balance)
    
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

// console.log(privateKey)
// const [abi, bytecode] = getContracData();

// console.log('abi', abi, 'bytecode', bytecode)