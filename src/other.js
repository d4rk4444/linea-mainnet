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
    typeValue: process.env.Type_Value,
    valueBridge: generateRandomAmount(process.env.Value_Bridge_Min, process.env.Value_Bridge_Max, 5),
    valueSwap: generateRandomAmount(process.env.Value_Swap_Min, process.env.Value_Swap_Max, 5),
    slippageSwap: (100 - Number(process.env.Slippage_Max)) / 100,
    bridgeMainet: '0xd19d4B5d358258f05D7B411E21A1460D11B0876F',
    bridgeLinea: '0x508Ca82Df566dCD1B0DE8296e70a96332cD644ec',
    WETH: '0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f',
    ETH: '0x0000000000000000000000000000000000000000',
    SyncRouter: '0x80e38291e06339d10AAB483C65695D004dBD5C69',
    SyncPoolFactory: '0x37BAc764494c8db4e54BDE72f6965beA9fa0AC2d',
    LineaSwapRouter: '0x3228d205A96409a07A44D39916b6EA7B765D61F4',
    ceBUSD: '0x7d43AABC515C356145049227CeE54B608342c0ad',
    ceBNB: '0xf5C6825015280CdfD0b56903F9F8B5A2233476F5',
    ceMATIC: '0x265B25e22bcd7f10a5bD6E6410F10537Cc7567e8',
    ceAVAX: '0x5471ea8f739dd37E9B81Be9c5c77754D8AA953E4',
    Lineans: '0xda4c3eb39707ad82ea7a31afd42bdf850fed8f41',
    domenLenghtMax: process.env.Lenght_Max,
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

export const getNameKey = (object, property) => {
    return Object.keys(object)[Object.values(object).findIndex(e => e == property)];
}