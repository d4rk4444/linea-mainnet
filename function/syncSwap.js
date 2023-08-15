import { getNameKey, info, log, privateToAddress, timeout } from "../src/other.js"
import { getTrueAmount, getTrueGasPrice } from "./other.js";
import { checkAllowance, dataApprove, fromWei, getAmountToken, getDecimal, sendEVMTX } from "../src/web3.js";
import { dataAddLiquidity, dataDeleteLiquidity, dataSwapETHToToken, dataSwapTokenToETH, getPool } from "../src/syncSwap.js";

export const swapETHToTokenSync = async(addressToken, privateKey) => {
    const address = privateToAddress(privateKey);

    const ticker = getNameKey(info, addressToken);
    const amount = await getTrueAmount(info.rpcLinea, address, 'Swap');
    const gasPrice = await getTrueGasPrice(info.rpcLinea);
    
    await dataSwapETHToToken(addressToken, amount, address, info.slippageSwap).then(async(res) => {
        await sendEVMTX(info.rpcLinea, 0, res.estimateGas, res.addressContract, amount, res.encodeABI, privateKey, gasPrice);
    });

    log('log', `Successful Swap ${fromWei(amount, 'ether')}ETH to ${ticker} [SyncSwap]`, 'green');
}

export const swapTokenToETHSync = async(addressToken, privateKey) => {
    const address = privateToAddress(privateKey);

    const ticker = getNameKey(info, addressToken);
    const amountToken = await getAmountToken(info.rpcLinea, addressToken, address);
    const decimal = await getDecimal(info.rpcLinea, addressToken);
    const gasPrice = await getTrueGasPrice(info.rpcLinea);

    if (amountToken == 0) {
        log('info', `Balance ${ticker} = 0. Skip this wallet`, 'red');
        return;
    }

    await checkAllowance(info.rpcLinea, addressToken, address, info.SyncRouter).then(async(allowance) => {
        allowance = Number(allowance);
        if (allowance < amountToken) {
            await dataApprove(info.rpcLinea, addressToken, info.SyncRouter, amountToken, address).then(async(res) => {
                await sendEVMTX(info.rpcLinea, 0, res.estimateGas, addressToken, null, res.encodeABI, privateKey, gasPrice);
            });
            log('log', `Successful Approve ${ticker} [SyncSwap]`, 'green');
        } else {
            log('info', `Find Approve ${ticker} [SyncSwap]`, 'green');
        }
    });
    await timeout(info.pauseTime);

    await dataSwapTokenToETH(addressToken, amountToken, address, info.slippageSwap).then(async(res) => {
        await sendEVMTX(info.rpcLinea, 0, res.estimateGas, res.addressContract, null, res.encodeABI, privateKey, gasPrice);
    });
    log('log', `Successful Swap ${parseFloat(amountToken / 10**decimal).toFixed(4)}${ticker} to ETH [SyncSwap]`, 'green');
}

export const addLPETHWithTokenSync = async(addressToken, privateKey) => {
    const address = privateToAddress(privateKey);

    const ticker = getNameKey(info, addressToken);
    const amountToken = await getAmountToken(info.rpcLinea, addressToken, address);
    const gasPrice = await getTrueGasPrice(info.rpcLinea);
    
    await dataAddLiquidity(addressToken, amountToken, address, info.slippageSwap).then(async(res) => {
        await sendEVMTX(info.rpcLinea, 0, res.estimateGas, res.addressContract, res.amountTx, res.encodeABI, privateKey, gasPrice);
    });

    log('log', `Successful Add Liquidity ETH/${ticker} with ${fromWei(amountToken, 'ether')}${ticker} [SyncSwap]`, 'green');
}

export const deleteLPETHWithTokenSync = async(addressToken, privateKey) => {
    const address = privateToAddress(privateKey);

    const addressLP = await getPool(info.WETH, addressToken);
    const ticker = getNameKey(info, addressLP);
    const amountToken = await getAmountToken(info.rpcLinea, addressLP, address);
    const decimal = await getDecimal(info.rpcLinea, addressLP);
    const gasPrice = await getTrueGasPrice(info.rpcLinea);

    if (amountToken == 0) {
        log('info', `Balance ${ticker} = 0. Skip this wallet`, 'red');
        return;
    }

    await checkAllowance(info.rpcLinea, addressLP, address, info.SyncRouter).then(async(allowance) => {
        allowance = Number(allowance);
        if (allowance < amountToken) {
            await dataApprove(info.rpcLinea, addressLP, info.SyncRouter, amountToken, address).then(async(res) => {
                await sendEVMTX(info.rpcLinea, 0, res.estimateGas, addressLP, res.amountTx, res.encodeABI, privateKey, gasPrice);
            });
            log('log', `Successful Approve ${ticker} [SyncSwap]`, 'green');
        } else {
            log('info', `Find Approve ${ticker} [SyncSwap]`, 'green');
        }
    });
    await timeout(info.pauseTime);

    await dataDeleteLiquidity(addressLP, amountToken, address, info.slippageSwap).then(async(res) => {
        await sendEVMTX(info.rpcLinea, 0, res.estimateGas, res.addressContract, res.amountTx, res.encodeABI, privateKey, gasPrice);
    });
    log('log', `Successful Delete ${parseFloat(amountToken / 10**decimal).toFixed(4)}${ticker} to ETH [SyncSwap]`, 'green');
}