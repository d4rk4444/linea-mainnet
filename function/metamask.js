import { info, log, privateToAddress } from "../src/other.js"
import { getTrueAmount, getTrueGasPrice } from "./other.js";
import { fromWei, sendEVMTX, toWei } from "../src/web3.js";
import { dataBridgeMetamask } from "../src/metamask.js";

export const bridgeMetamask = async(nameChain, privateKey) => {
    const address = privateToAddress(privateKey);

    const rpc = info['rpc' + nameChain];
    const router = info['MMBridge' + nameChain];
    const amount = await getTrueAmount(rpc, address, 'Bridge');
    const gasPrice = await getTrueGasPrice(rpc);

    if (Number(amount) < toWei('0.007', 'ether')) {
        throw new Error('Amount < 10$');
    }
    
    await dataBridgeMetamask(rpc, router, amount, address).then(async(res) => {
        await sendEVMTX(rpc, res.estimateGas, res.addressContract, amount, res.encodeABI, privateKey, gasPrice, '0.0005');
    });

    log('log', `Successful Bridge ${nameChain} -> Linea ${fromWei(amount, 'ether')}ETH`, 'green');
}