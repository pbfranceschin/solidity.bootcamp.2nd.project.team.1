import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';
import { argv } from 'node:process';
import { getContractAbi } from '../utils/contractData';
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { accessListify } from 'ethers/lib/utils';


dotenv.config({path: '../.env'});

// script should be called with arguments:
// address contract , 

const network = "goerli"
const account = "0x778070825fE59026A882cAe236109ce30bD33d44";
const privateKey =  process.env.PRIVATE_KEY_1;
// const apiKey = process.env.INFURA_API_KEY;
const apiKey = process.env.ALCHEMY_API_KEY;


const main = async () => {
    const args = process.argv.slice(2);
    if(args.length <= 0){
        throw new Error("missing argument: address contract and/or uint proposal ");
    }
    if(!privateKey || privateKey.length <= 0) throw new Error("missing enviroment: PRIVATE_KEY");
    if(!apiKey || apiKey.length <= 0) throw new Error("missing enviroment: API_KEY");
    
    const contractAddress = args[0];
    const provider = new ethers.providers.AlchemyProvider(network, apiKey);
    
    const contractAbi = getContractAbi();
    const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        provider
    );

    console.log("calling...");
    const winnerNum = await contract.winningProposal();
    const winnerName = await contract.winnerName();
    const num = winnerNum.toNumber() ;
    const nam = ethers.utils.parseBytes32String(winnerName);
    const winnerProp = await contract.proposals(num);
    const votes = winnerProp.voteCount.toNumber();
    console.log(`A proposta vencedora foi #${num + 1} ${nam} com ${votes} votos`  ); 
};

main();
