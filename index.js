import { info,
    timeout,
    shuffle,
    parseFile,
    generateRandomAmount,
    privateToAddress, 
    log } from './src/other.js';
import { checkAllowance,
    getETHAmount,
    getAmountToken,
    getTokenId,
    dataApprove,
    getGasPrice,
    dataSendToken,
    dataApproveNFT,
    sendEVMTX, 
    getTxData,
    toWei } from './src/web3.js';
import { bridgeETHToEthereum, bridgeETHToLinea } from './function/bridge.js';
import readline from 'readline-sync';
import * as dotenv from 'dotenv';
import { wrapETH } from './function/DEX.js';
import { swapETHToTokenSync, swapTokenToETHSync } from './function/syncSwap.js';
dotenv.config();

const getBalanceWalletLinea = async(privateKey) => {
    const address = privateToAddress(privateKey);

    await getETHAmount(info.rpcLinea, address).then(async(res) => {
        log('info',  'Balance Linea', 'magentaBright');
        log('info', `${parseFloat(res / 10**18).toFixed(4)}ETH`);
    });
}

(async() => {
    const wallet = parseFile('private.txt');
    if (process.env.Random_Wallet_List == 'true') {
        shuffle(wallet);
    }

    const mainStage = [
        'Bridge',
        'DEX',
        'SyncSwap',
        'EMPTY',
        'EMPTY',
        'EMPTY',
        'Other'
    ];

    const stageBridge = [
        'Bridge ETH Ethereum -> Linea',
        'Bridge ETH Linea -> Ethereum',
    ];

    const stageDEX = [
        'Wrap ETH',
    ];

    const stageSync = [
        'Swap ETH -> ceBUSD',
        'Swap ceBUSD -> ETH',
        'Swap ETH -> ceBNB',
        'Swap ceBNB -> ETH',
        'Swap ETH -> ceMATIC',
        'Swap ceMATIC -> ETH',
    ];

    const stageOther = [
        'Start',
    ];

    const index = readline.keyInSelect(mainStage, 'Choose stage!');
    let index1;
    let index2;
    let index3;
    let index4;
    let index5;
    let index6;
    let index7;
    if (index == -1) { process.exit() };
    log('info', `Start ${mainStage[index]}`, 'green');
    if (index == 0) {
        index1 = readline.keyInSelect(stageBridge, 'Choose stage!');
        if (index1 == -1) { process.exit() };
        log('info', `Start ${stageBridge[index1]}`, 'green');
    } else if (index == 1) {
        index2 = readline.keyInSelect(stageDEX, 'Choose stage!');
        if (index2 == -1) { process.exit() };
        log('info', `Start ${stageDEX[index2]}`, 'green');
    } else if (index == 2) {
        index3 = readline.keyInSelect(stageSync, 'Choose stage!');
        if (index3 == -1) { process.exit() };
        log('info', `Start ${stageSync[index3]}`, 'green');
    } else if (index == 3) {
        index4 = readline.keyInSelect(otherStage, 'Choose stage!');
        if (index4 == -1) { process.exit() };
    } else if (index == 4) {
        index5 = readline.keyInSelect(otherStage, 'Choose stage!');
        if (index5 == -1) { process.exit() };
    } else if (index == 5) {
        index6 = readline.keyInSelect(otherStage, 'Choose stage!');
        if (index6 == -1) { process.exit() };
    } else if (index == 6) {
        index7 = readline.keyInSelect(stageOther, 'Choose stage!');
        if (index7 == -1) { process.exit() };
        log('info', `Start ${stageOther[index7]}`, 'green');
    }
    
    
    for (let i = 0; i < wallet.length; i++) {
        let pauseWalletTime = generateRandomAmount(process.env.TIMEOUT_WALLET_SEC_MIN * 1000, process.env.TIMEOUT_WALLET_SEC_MAX * 1000, 0);
        try {
            log('info', `Wallet ${i+1}: ${privateToAddress(wallet[i])}`, 'blue');
        } catch (err) { throw new Error('Error: Add Private Keys!') };

        try {
            if (index1 == 0) { //BRIDGE STAGE
                await bridgeETHToLinea(wallet[i]);
            } else if (index1 == 1) {
                await bridgeETHToEthereum(wallet[i]);
            }

            if (index2 == 0) { //DEX STAGE
                await wrapETH(info.rpcLinea, wallet[i]);
            }

            if (index3 == 0) { //SYNC STAGE
                await swapETHToTokenSync(info.ceBUSD, wallet[i]);
            } else if (index3 == 1) {
                await swapTokenToETHSync(info.ceBUSD, wallet[i]);
            } else if (index3 == 2) {
                await swapETHToTokenSync(info.ceBNB, wallet[i]);
            } else if (index3 == 3) {
                await swapTokenToETHSync(info.ceBNB, wallet[i]);
            } else if (index3 == 4) {
                await swapETHToTokenSync(info.ceMATIC, wallet[i]);
            } else if (index3 == 5) {
                await swapTokenToETHSync(info.ceMATIC, wallet[i]);
            }
    
            if (index7 == 0) { //OTHER STAGE
                pauseWalletTime = 0;
                await getBalanceWalletLinea(wallet[i]);
            }
        } catch (error) {
            log('error', error, 'red');
            return;
        }

        if (i + 1 != wallet.length) {
            await timeout(pauseWalletTime);
        }
    }

    log('info', 'Process End!', 'bgMagentaBright');
})();