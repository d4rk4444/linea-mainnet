import { multiply } from "mathjs";
import { info, log, timeout } from "../src/other.js";
import { getETHAmount, getGasPrice, toWei } from "../src/web3.js";

export const waitGasPrice = async(rpc, needGasPrice, pauseTime) => {
    while (true) {
        const gasPriceNow = await getGasPrice(rpc);
        if (Number(gasPriceNow) <= Number(needGasPrice)) {
            log('log', `Gas price = ${Number(gasPriceNow).toFixed(2)}`, 'green');
            return parseFloat(gasPriceNow).toFixed(9);
        } else {
            log('log', `Wait for Gas Price, now = ${Number(gasPriceNow).toFixed(2)}`);
            await timeout(pauseTime);
        }
    }
}

export const getTrueAmount = async(rpc, address, type) => {
    const amount = info.typeValue == 'procent'
        ? parseInt(multiply(await getETHAmount(rpc, address), info['value' + type] / 100))
        : toWei(info['value' + type].toString(), 'ether');

    return amount;
}

export const getTrueGasPrice = async(rpc) => {
    const gasPrice = multiply(info.increaseGasPrice, await waitGasPrice(rpc, info.needGasPrice, 7000)).toFixed(9);
    return gasPrice;
}