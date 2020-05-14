import Web3 from "web3";
import data from "../../truffle/build/contracts/roulette";
import oracleData from "../../truffle/build/contracts/Oracle";

/*
contains variables related to web3.js and connectivity
 */


window.web3 = new Web3(window.ethereum);
window.ethereum.enable();


//RPC server from GANACHE,
window.web3.eth.defaultAccount = window.web3.eth.accounts[0];

let abi = data.abi;
let contract_address = data.networks[5777].address;
let oracleAbi = oracleData.abi;
let oracle_address = oracleData.networks[5777].address;

const RouletteContract = new window.web3.eth.Contract(abi, contract_address);
const OracleContract = new window.web3.eth.Contract(oracleAbi, oracle_address);

export {OracleContract, RouletteContract};
