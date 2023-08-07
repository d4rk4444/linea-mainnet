import { multiply } from "mathjs";
import { generateRandomAmount, info, log, parseFile, timeout } from "../src/other.js";
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

export const generateRandomDomenName = async(lenghtMax) => {
    const words = parseFile('./src/words.txt');
    let domen = words[generateRandomAmount(0, words.length - 1, 0)];
    const lenght = lenghtMax - domen.length;
    const number  = lenght > 0 ? generateRandomAmount(1, 1 * 10**lenght, 0).toString() : '';
    domen = domen + number;

    return domen;
}