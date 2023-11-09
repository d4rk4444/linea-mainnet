import { generateRandomAmount, info, log, parseJsonFile, privateToAddress } from "../src/other.js"
import { getTrueAmount, getTrueGasPrice } from "./other.js";
import { fromWei, getGasPrice, sendEVMTX, toWei } from "../src/web3.js";
import { dataBridgeMainnet, dataBridgeLinea, writeBridgeInfo, dataClaimBridgeMainnet } from "../src/bridge.js";
import { add } from "mathjs";

export const bridgeETHToLinea = async(privateKey) => {
    const address = privateToAddress(privateKey);

    const amount = await getTrueAmount(info.rpcEthereum, address, 'Bridge');

    const gasPriceEthereum = await getTrueGasPrice(info.rpcEthereum);
    const gasPriceLinea = await getGasPrice(info.rpcLinea);
    const fee = toWei(parseFloat(gasPriceLinea * (100000 + 6000) * 2).toFixed(9), 'gwei');
    const amountTx = add(amount, fee);
    const priorityFee = generateRandomAmount(0.05, 0.1, 2).toString();
    
    await dataBridgeMainnet(amount, fee, address).then(async(res) => {
        await sendEVMTX(info.rpcEthereum, res.estimateGas, res.addressContract, amountTx, res.encodeABI, privateKey, gasPriceEthereum, priorityFee);
    });

    log('log', `Successful Bridge ${fromWei(amount, 'ether')}ETH to Linea`, 'green');
}

export const bridgeETHToEthereum = async(privateKey) => {
    const address = privateToAddress(privateKey);

    const amount = await getTrueAmount(info.rpcLinea, address, 'Bridge');

    const gasPrice = await getTrueGasPrice(info.rpcLinea);
    const fee = '1000000000000000';
    const amountTx = add(amount, fee);
    
    await dataBridgeLinea(amount, fee, address).then(async(res) => {
        await sendEVMTX(info.rpcLinea, res.estimateGas, res.addressContract, amountTx, res.encodeABI, privateKey, gasPrice).then(res => {
            writeBridgeInfo('historyBridge.json', res.logs[0].data, address);
            log('log', `Successful Write Info Bridge for Claim`);
        });
    });

    log('log', `Successful Bridge ${fromWei(amount, 'ether')}ETH to Ethereum`, 'green');
}

export const claimETHMainnet = async(file, privateKey) => {
    const address = privateToAddress(privateKey);

    const bridgeInfo = parseJsonFile(file);
    if (!bridgeInfo[address]) {
        log('log', `There's no information about this address`, 'red');
        return;
    }
    const value = bridgeInfo[address].value;
    const nonce = bridgeInfo[address].nonce;

    const gasPriceEthereum = await getTrueGasPrice(info.rpcEthereum);
    const priorityFee = generateRandomAmount(0.05, 0.1, 2).toString();
    await dataClaimBridgeMainnet(value, nonce, address).then(async(res) => {
        await sendEVMTX(info.rpcEthereum, res.estimateGas, res.addressContract, res.amountTx, res.encodeABI, privateKey, gasPriceEthereum, priorityFee);
    });

    log('log', `Successful Claim ${fromWei(value, 'ether')}ETH in Ethereum`, 'green');
}