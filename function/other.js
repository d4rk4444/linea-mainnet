import { multiply } from "mathjs";
import { generateRandomAmount, info, log, parseFile, privateToAddress, timeout } from "../src/other.js";
import { fromWei, getAmountToken, getETHAmount, getGasPrice, numberToHex, toWei } from "../src/web3.js";
import { table } from 'table';
import chalk from 'chalk';

export const getBalanceLinea = async(wallets) => {
    let dataTabl = [];
    const title = ['#', 'Wallet', 'ETH', 'USDC', 'USDT', 'ceBUSD', 'ceBNB', 'ceMATIC', 'ceAVAX', 'izumiUSD'];
    dataTabl.push(title);

    for (let i = 0; i < wallets.length; i++) {
        const address = privateToAddress(wallets[i]);

        let amountETH = parseFloat(fromWei(await getETHAmount(info.rpcLinea, address), 'ether')).toFixed(5);
        amountETH = amountETH > 0 ? chalk.green(amountETH) : chalk.red(amountETH);
        const nextArr = [`${i + 1}`, address, amountETH];
        for (let n = 3; n < title.length; n++) {
            let type = title[n] == 'USDC' || title[n] == 'USDT' ? 'lovelace' : 'ether';
            let amountToken = parseFloat(fromWei(await getAmountToken(info.rpcLinea, info[title[n]], address), type)).toFixed(2);
            amountToken = amountToken > 0 ? chalk.green(amountToken) : chalk.red(amountToken);
            nextArr.push(amountToken);
        }
        dataTabl.push(nextArr);
    }
    log('info', `\n${table(dataTabl)}`);
}

export const waitGasPrice = async(rpc, needGasPrice, pauseTime) => {
    while (true) {
        const gasPriceNow = await getGasPrice(rpc);
        if (Number(gasPriceNow) <= Number(needGasPrice)) {
            log('log', `Gas price = ${Number(gasPriceNow).toFixed(2)}`, 'green');
            return parseFloat(gasPriceNow).toFixed(9);
        } else {
            log('log', `Wait for Gas Price, now = ${Number(gasPriceNow).toFixed(2)}. Need = ${needGasPrice}`);
            await timeout(pauseTime);
        }
    }
}

export const getTrueAmount = async(rpc, address, type) => {
    const amount = info.typeValue == 'procent'
        ? toWei(parseFloat(fromWei(numberToHex(multiply(await getETHAmount(rpc, address),
            generateRandomAmount(process.env['Value_' + type + '_Min'], process.env['Value_' + type + '_Max'], 0) / 100)), 'ether')).toFixed(4), 'ether')
        : toWei(generateRandomAmount(process.env['Value_' + type + '_Min'], process.env['Value_' + type + '_Max'], 5).toString(), 'ether');

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

export const getTrueArrBalanceTokens = async(arrToken, address) => {
    let result = [];
    for (const token of arrToken) {
        await getAmountToken(info.rpcLinea, info[token], address).then(res => {
            if (res > 1 * 10**4) {
                result.push(token);
            }
        });
    }

    return result;
}