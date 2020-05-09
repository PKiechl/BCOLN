import Web3 from "web3";
import data from "../../truffle/build/contracts/roulette";
import oracleData from "../../truffle/build/contracts/Oracle";

//RPC server from GANACHE,
const web3 = new Web3("ws://127.0.0.1:7545");
web3.eth.defaultAccount = web3.eth.accounts[0];

let abi = data.abi;
let contract_address = data.networks[5777].address;
let oracleAbi = oracleData.abi;
let oracle_address = oracleData.networks[5777].address;

const RouletteContract = new web3.eth.Contract(abi, contract_address);
const OracleContract = new web3.eth.Contract(oracleAbi, oracle_address);

// async function getAccountBalance(join = false, address) {
//   if (address) {
//     const balance = await web3.eth.getBalance(address);
//     const eths = await web3.utils.fromWei(balance.toString(), "ether");
//     // await this.setState({ eths: eths });
//     if (join) {
//       // await this.setState({ ethsAtJoin: eths });
//       // console.log("ethsAtJoin: ", this.state.ethsAtJoin);
//       return [eths,ethsAtJoin];
//     }
//     console.log("eths", this.state.eths);
//     return eths;
//   }
// }

export { web3, OracleContract, RouletteContract };
