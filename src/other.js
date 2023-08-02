import Web3 from 'web3';
import fs from 'fs';
import consoleStamp from 'console-stamp';
import chalk from 'chalk';
import * as dotenv from 'dotenv';
dotenv.config();

export const log = (type, msg, color) => {
    const output = fs.createWriteStream(`history.log`, { flags: 'a' });
    const logger = new console.Console(output);
    consoleStamp(console, { format: ':date(HH:MM:ss) :label' });
    consoleStamp(logger, { format: ':date(yyyy/mm/dd HH:MM:ss) :label', stdout: output });

    if (!color) {
        console[type](msg);
    } else {
        console[type](chalk[color](msg));
    }
    logger[type](msg);
}

export const generateRandomAmount = (min, max, num) => {
    const amount = Number(Math.random() * (parseFloat(max) - parseFloat(min)) + parseFloat(min));
    return Number(parseFloat(amount).toFixed(num));
}

export const info = {
    rpcEthereum: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    rpcLinea: `https://linea-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    explorerEthereum: 'https://etherscan.io/tx/',
    explorerLinea: 'https://lineascan.build/tx/',
    pauseTime: generateRandomAmount(process.env.TIMEOUT_ACTION_SEC_MIN * 1000, process.env.TIMEOUT_ACTION_SEC_MAX * 1000, 0),
    increaseGasPrice: Number(process.env.Increase_Gas_Price),
    needGasPrice: Number(process.env.Gas_Bridge_Max),
    valueBridge: generateRandomAmount(process.env.Value_Bridge_Min, process.env.Value_Bridge_Max, 5),
    typeBridge: process.env.Type_Bridge,
    bridgeMainet: '0xd19d4B5d358258f05D7B411E21A1460D11B0876F',
    WETH: '0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f',
}

export const timeout = ms => new Promise(res => setTimeout(res, ms));

export const shuffle = (array) => {
    let currentIndex = array.length,  randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}

export const parseFile = (file) => {
    const data = fs.readFileSync(file, "utf-8");
    const array = (data.replace(/[^a-zA-Z0-9\n]/g,'')).split('\n');
    return array;
}

export const privateToAddress = (privateKey) => {
    const w3 = new Web3();
    return w3.eth.accounts.privateKeyToAccount(privateKey).address;
}