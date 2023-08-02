import { generateRandomAmount, info, privateToAddress } from "../src/other.js"
import { waitGasPrice } from "./other.js";
import { getETHAmount, getGasPrice, sendEVMTX, toWei } from "../src/web3.js";
import { dataBridgeMainet } from "../src/bridge.js";
import { add, multiply } from "mathjs";

export const bridgeETHToLinea = async(privateKey) => {
    const address = privateToAddress(privateKey);

    const amount = info.typeBridge == 'procent'
        ? parseInt(multiply(await getETHAmount(info.rpcEthereum, address), info.valueBridge / 100))
        : toWei(info.valueBridge, 'ether');

    const gasPriceEthereum = multiply(info.increaseGasPrice, await waitGasPrice(info.rpcEthereum, info.needGasPrice, 7000)).toFixed(9).toString();
    const gasPriceLinea = await getGasPrice(info.rpcLinea);
    const fee = toWei(parseFloat(gasPriceLinea * (100000 + 6000) * 2).toFixed(9), 'gwei');
    const amountTx = add(amount, fee);
    const priorityFee = generateRandomAmount(0.05, 0.1, 2).toString();
    
    await dataBridgeMainet(amount, fee, address).then(async(res) => {
        await sendEVMTX(info.rpcEthereum, 2, res.estimateGas, info.bridgeMainet, amountTx, res.encodeABI, privateKey, gasPriceEthereum, priorityFee);
    });
}