import { generateRandomAmount, info, log, privateToAddress } from "../src/other.js"
import { getTrueAmount, getTrueGasPrice } from "./other.js";
import { fromWei, getGasPrice, sendEVMTX, toWei } from "../src/web3.js";
import { dataBridgeMainet, dataBridgeMainetBack } from "../src/bridge.js";
import { add } from "mathjs";

export const bridgeETHToLinea = async(privateKey) => {
    const address = privateToAddress(privateKey);

    const amount = await getTrueAmount(info.rpcEthereum, address, 'Bridge');

    const gasPriceEthereum = await getTrueGasPrice(info.rpcEthereum);
    const gasPriceLinea = await getGasPrice(info.rpcLinea);
    const fee = toWei(parseFloat(gasPriceLinea * (100000 + 6000) * 2).toFixed(9), 'gwei');
    const amountTx = add(amount, fee);
    const priorityFee = generateRandomAmount(0.05, 0.1, 2).toString();
    
    await dataBridgeMainet(amount, fee, address).then(async(res) => {
        await sendEVMTX(info.rpcEthereum, 2, res.estimateGas, res.addressContract, amountTx, res.encodeABI, privateKey, gasPriceEthereum, priorityFee);
    });

    log('log', `Successful Bridge ${fromWei(amount, 'ether')}ETH to Linea`, 'green');
}

export const bridgeETHToEthereum = async(privateKey) => {
    const address = privateToAddress(privateKey);

    const amount = await getTrueAmount(info.rpcLinea, address, 'Bridge');

    const gasPrice = await getTrueGasPrice(info.rpcLinea);
    const fee = '1000000000000000';
    const amountTx = add(amount, fee);
    
    await dataBridgeMainetBack(amount, fee, address).then(async(res) => {
        await sendEVMTX(info.rpcLinea, 0, res.estimateGas, res.addressContract, amountTx, res.encodeABI, privateKey, gasPrice);
    });

    log('log', `Successful Bridge ${fromWei(amount, 'ether')}ETH to Ethereum`, 'green');
}