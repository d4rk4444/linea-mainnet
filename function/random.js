import { info,
    timeout,
    shuffle,
    generateRandomAmount,
    privateToAddress, 
    log, 
    pathData } from '../src/other.js';
import { swapETHToTokenSync, swapTokenToETHSync } from './syncSwap.js';
import { swapETHToTokenLineaSwap, swapTokenToETHLineaSwap } from './lineaSwap.js';
import { swapETHToTokenEcho, swapTokenToETHEcho } from './echoDEX.js';
import { swapETHToTokenHorizon, swapTokenToETHHorizon } from './horizon.js';
import { swapETHToTokenIzumi, swapTokenToETHIzumi } from './izumi.js';
import { getTrueArrBalanceTokens } from './other.js';
import * as dotenv from 'dotenv';
dotenv.config();

export const randomSwapETHToTokenAll = async(arrDexList, privateKey) => {
    const ticker = info.tokenList[generateRandomAmount(0, info.tokenList.length - 1, 0)]
    const token = info[ticker];
    let DEXs = [];
    for (const DEX of arrDexList) {
        if (pathData[DEX].includes(token)) {
            DEXs.push(DEX);
        }
    }

    if (DEXs.length == 0) {
        throw new Error('That path doesn\'t exist, change the config.');
    }

    const DEX = DEXs[generateRandomAmount(0, DEXs.length - 1, 0)]
    const nameFunc = 'swapETHToToken' + DEX;
    log('log', `Select ${ticker} and ${DEX} DEX`, 'yellow');
    await eval(nameFunc + `('${token}', '${privateKey}')`);
}

export const randomSwapTokenToETHAll = async(swapAll, privateKey) => {
    let arrToken = await getTrueArrBalanceTokens(info.tokenList, privateToAddress(privateKey));
    if (arrToken.length == 0) {
        throw new Error('Balance of all tokens 0');
    }
    if (!swapAll) {
        arrToken = [arrToken[generateRandomAmount(0, arrToken.length - 1, 0)]];
    }
    log('info', `Find ${arrToken} with balance > 0`);

    for (let i = 0; i < arrToken.length; i++) {
        let DEXs = [];
        const ticker = arrToken[i];
        const token = info[ticker];
        for (const DEX of info.dexList) {
            if (pathData[DEX].includes(token)) {
                DEXs.push(DEX);
            }
        }

        if (DEXs.length == 0) {
            throw new Error('That path doesn\'t exist, change the config.');
        }

        const DEX = DEXs[generateRandomAmount(0, DEXs.length - 1, 0)]
        const nameFunc = 'swapTokenToETH' + DEX;
        log('log', `Select ${ticker} and ${DEX} DEX`, 'yellow');
        await eval(nameFunc + `('${token}', '${privateKey}')`);

        if (i != arrToken.length - 1) {
            await timeout(info.pauseTime);
        }
    }
}