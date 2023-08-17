import { getNameKey, info, log, privateToAddress, timeout } from "../src/other.js"
import { getTrueAmount, getTrueGasPrice } from "./other.js";
import { checkAllowance, dataApprove, fromWei, getAmountToken, getDecimal, sendEVMTX } from "../src/web3.js";
import { dataSwapETHToToken, dataSwapTokenToETH } from "../src/izumi.js";

export const swapETHToTokenIzumi = async(addressToken, privateKey) => {
    const address = privateToAddress(privateKey);

    const ticker = getNameKey(info, addressToken);
    const amount = await getTrueAmount(info.rpcLinea, address, 'Swap');
    const gasPrice = await getTrueGasPrice(info.rpcLinea);
    
    await dataSwapETHToToken(amount, addressToken, info.slippageSwap, address).then(async(res) => {
        await sendEVMTX(info.rpcLinea, 0, res.estimateGas, res.addressContract, amount, res.encodeABI, privateKey, gasPrice);
    });

    log('log', `Successful Swap ${fromWei(amount, 'ether')}ETH to ${ticker} [Izumi]`, 'green');
}

export const swapTokenToETHIzumi = async(addressToken, privateKey) => {
    const address = privateToAddress(privateKey);

    const ticker = getNameKey(info, addressToken);
    const amountToken = await getAmountToken(info.rpcLinea, addressToken, address);
    const decimal = await getDecimal(info.rpcLinea, addressToken);
    const gasPrice = await getTrueGasPrice(info.rpcLinea);

    if (amountToken == 0) {
        log('info', `Balance ${ticker} = 0. Skip this wallet`, 'red');
        return;
    }

    await checkAllowance(info.rpcLinea, addressToken, address, info.IzumiRouter).then(async(allowance) => {
        allowance = Number(allowance);
        if (allowance < amountToken) {
            await dataApprove(info.rpcLinea, addressToken, info.IzumiRouter, amountToken, address).then(async(res) => {
                await sendEVMTX(info.rpcLinea, 0, res.estimateGas, addressToken, null, res.encodeABI, privateKey, gasPrice);
            });
            log('log', `Successful Approve ${ticker} [Izumi]`, 'green');
        } else {
            log('info', `Find Approve ${ticker} [Izumi]`, 'green');
        }
    });
    await timeout(info.pauseTime);

    await dataSwapTokenToETH(amountToken, addressToken,  info.slippageSwap, address).then(async(res) => {
        await sendEVMTX(info.rpcLinea, 0, res.estimateGas, res.addressContract, null, res.encodeABI, privateKey, gasPrice);
    });
    log('log', `Successful Swap ${parseFloat(amountToken / 10**decimal).toFixed(4)}${ticker} to ETH [Izumi]`, 'green');
}