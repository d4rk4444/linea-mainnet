import { getNameKey, info, log, privateToAddress, timeout } from "../src/other.js"
import { getTrueAmount, getTrueGasPrice } from "./other.js";
import { checkAllowance, dataApprove, fromWei, getAmountToken, getDecimal, sendEVMTX } from "../src/web3.js";
import { dataSwapETHToToken, dataSwapTokenToETH } from "../src/lineaSwap.js";

export const swapETHToTokenLineaSwap = async(addressToken, privateKey) => {
    const address = privateToAddress(privateKey);

    const ticker = getNameKey(info, addressToken);
    const amount = await getTrueAmount(info.rpcLinea, address, 'Swap');
    const gasPrice = await getTrueGasPrice(info.rpcLinea);
    
    await dataSwapETHToToken(addressToken, amount, info.LineaSwapRouter, address, info.slippageSwap).then(async(res) => {
        await sendEVMTX(info.rpcLinea, res.estimateGas, res.addressContract, amount, res.encodeABI, privateKey, gasPrice);
    });

    log('log', `Successful Swap ${fromWei(amount, 'ether')}ETH to ${ticker} [LineaSwap]`, 'green');
}

export const swapTokenToETHLineaSwap = async(addressToken, privateKey) => {
    const address = privateToAddress(privateKey);

    const ticker = getNameKey(info, addressToken);
    const amountToken = await getAmountToken(info.rpcLinea, addressToken, address);
    const decimal = await getDecimal(info.rpcLinea, addressToken);
    const gasPrice = await getTrueGasPrice(info.rpcLinea);

    if (amountToken == 0) {
        throw new Error(`Balance ${ticker} = 0. Skip this wallet`);
    }

    await checkAllowance(info.rpcLinea, addressToken, address, info.LineaSwapRouter).then(async(allowance) => {
        allowance = Number(allowance);
        if (allowance < amountToken) {
            await dataApprove(info.rpcLinea, addressToken, info.LineaSwapRouter, amountToken, address).then(async(res) => {
                await sendEVMTX(info.rpcLinea, res.estimateGas, addressToken, null, res.encodeABI, privateKey, gasPrice);
            });
            log('log', `Successful Approve ${ticker} [LineaSwap]`, 'green');
        } else {
            log('info', `Find Approve ${ticker} [LineaSwap]`, 'green');
        }
    });
    await timeout(info.pauseTime);

    await dataSwapTokenToETH(addressToken, amountToken, info.LineaSwapRouter, address, info.slippageSwap).then(async(res) => {
        await sendEVMTX(info.rpcLinea, res.estimateGas, res.addressContract, null, res.encodeABI, privateKey, gasPrice);
    });
    log('log', `Successful Swap ${parseFloat(amountToken / 10**decimal).toFixed(4)}${ticker} to ETH [LineaSwap]`, 'green');
}