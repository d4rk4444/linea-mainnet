import { info,
    timeout,
    shuffle,
    parseFile,
    generateRandomAmount,
    privateToAddress, 
    log } from './src/other.js';
import { bridgeETHToEthereum, bridgeETHToLinea, claimETHMainnet } from './function/bridge.js';
import { wrapETH } from './function/DEX.js';
import { addLPETHWithTokenSync, deleteLPETHWithTokenSync, swapETHToTokenSync, swapTokenToETHSync } from './function/syncSwap.js';
import { swapETHToTokenLineaSwap, swapTokenToETHLineaSwap } from './function/lineaSwap.js';
import { swapETHToTokenEcho, swapTokenToETHEcho } from './function/echoDEX.js';
import { swapETHToTokenHorizon, swapTokenToETHHorizon } from './function/horizon.js';
import { swapETHToTokenIzumi, swapTokenToETHIzumi } from './function/izumi.js';
import { mintDomenName } from './function/lineans.js';
import { mintOwltoLineaGalaxyNFT } from './function/galaxy.js';
import { getBalanceLinea } from './function/other.js';
import { clearBridgeInfo } from './src/bridge.js';
import readline from 'readline-sync';
import * as dotenv from 'dotenv';
dotenv.config();

(async() => {
    const wallet = parseFile('private.txt');
    if (process.env.Random_Wallet_List == 'true') {
        shuffle(wallet);
    }

    const mainStage = [
        'Bridge',
        'DEX',
        'SyncSwap',
        'LineaSwap',
        'EchoDEX',
        'Horizon',
        'Izumi',
        'LineaName',
        'Other'
    ];

    const stageBridge = [
        'Bridge ETH Ethereum -> Linea',
        'Bridge ETH Linea -> Ethereum [Manual Claiming]',
        'Claim ETH Ethereum',
        'Clear History Bridge File',
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
        'Swap ETH -> ceAVAX',
        'Swap ceAVAX -> ETH',
        'Random ETH -> ceBUSD/ceBNB/ceMATIC/ceAVAX',
        'Swap All Tokens -> ETH',
        'Add LP ETH/BUSD',
        'Delete LP ETH/BUSD',
    ];

    const stageLineaSwap = [
        'Swap ETH -> ceBUSD',
        'Swap ceBUSD -> ETH',
        'Swap ETH -> ceBNB',
        'Swap ceBNB -> ETH',
        'Swap ETH -> ceMATIC',
        'Swap ceMATIC -> ETH',
        'Swap ETH -> ceAVAX',
        'Swap ceAVAX -> ETH',
        'Random ETH -> ceBUSD/ceBNB/ceMATIC/ceAVAX',
        'Swap All Tokens -> ETH',
    ];

    const stageEchoDEX = [
        'Swap ETH -> ceBUSD',
        'Swap ceBUSD -> ETH',
        'Swap ETH -> ceMATIC',
        'Swap ceMATIC -> ETH',
        'Random ETH -> ceBUSD/ceMATIC',
        'Swap All Tokens -> ETH',
    ];

    const stageHorizon = [
        'Swap ETH -> ceBUSD',
        'Swap ceBUSD -> ETH',
        'Swap ETH -> ceBNB',
        'Swap ceBNB -> ETH',
        'Random ETH -> ceBUSD/ceBNB',
        'Swap All Tokens -> ETH',
    ];

    const stageIzumi = [
        'Swap ETH -> ceBUSD',
        'Swap ceBUSD -> ETH',
        'Swap ETH -> izumiUSD',
        'Swap izumiUSD -> ETH',
        'Random ETH -> ceBUSD/izumiUSD',
        'Swap All Tokens -> ETH',
    ];

    const stageLineans = [
        'Mint Domen Name 0.0027ETH',
    ];

    const stageOther = [
        'Check Balance Linea',
        'Mint Owlto x Linea Bridger',
    ];

    const index = readline.keyInSelect(mainStage, 'Choose stage!');
    let index1;
    let index2;
    let index3;
    let index4;
    let index5;
    let index6;
    let index7;
    let index8;
    let index9;
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
        index4 = readline.keyInSelect(stageLineaSwap, 'Choose stage!');
        if (index4 == -1) { process.exit() };
        log('info', `Start ${stageLineaSwap[index4]}`, 'green');
    } else if (index == 4) {
        index5 = readline.keyInSelect(stageEchoDEX, 'Choose stage!');
        if (index5 == -1) { process.exit() };
        log('info', `Start ${stageEchoDEX[index5]}`, 'green');
    } else if (index == 5) {
        index6 = readline.keyInSelect(stageHorizon, 'Choose stage!');
        if (index6 == -1) { process.exit() };
        log('info', `Start ${stageHorizon[index6]}`, 'green');
    } else if (index == 6) {
        index7 = readline.keyInSelect(stageIzumi, 'Choose stage!');
        if (index7 == -1) { process.exit() };
        log('info', `Start ${stageIzumi[index7]}`, 'green');
    } else if (index == 7) {
        index8 = readline.keyInSelect(stageLineans, 'Choose stage!');
        if (index8 == -1) { process.exit() };
        log('info', `Start ${stageLineans[index8]}`, 'green');
    } else if (index == 8) {
        index9 = readline.keyInSelect(stageOther, 'Choose stage!');
        if (index9 == -1) { process.exit() };
        log('info', `Start ${stageOther[index9]}`, 'green');
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
            } else if (index1 == 2) {
                await claimETHMainnet('historyBridge.json', wallet[i]);
            } else if (index1 == 3) {
                clearBridgeInfo('historyBridge.json');
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
            } else if (index3 == 6) {
                await swapETHToTokenSync(info.ceAVAX, wallet[i]);
            } else if (index3 == 7) {
                await swapTokenToETHSync(info.ceAVAX, wallet[i]);
            } else if (index3 == 8) {
                const arrTokens = [info.ceBUSD, info.ceBNB, info.ceMATIC, info.ceAVAX];
                await swapETHToTokenSync(arrTokens[generateRandomAmount(0, arrTokens.length - 1), 0], wallet[i]);
            } else if (index3 == 9) {
                const arrTokens = [info.ceBUSD, info.ceBNB, info.ceMATIC, info.ceAVAX];
                for (let n = 0; n < arrTokens.length; n++) {
                    await swapTokenToETHSync(arrTokens[n], wallet[i]);
                }
            } else if (index3 == 10) {
                await addLPETHWithTokenSync(info.ceBUSD, wallet[i]);
            } else if (index3 == 11) {
                await deleteLPETHWithTokenSync(info.ceBUSD, wallet[i]);
            }

            if (index4 == 0) { //LINEASWAP STAGE
                await swapETHToTokenLineaSwap(info.ceBUSD, wallet[i]);
            } else if (index4 == 1) {
                await swapTokenToETHLineaSwap(info.ceBUSD, wallet[i]);
            } else if (index4 == 2) {
                await swapETHToTokenLineaSwap(info.ceBNB, wallet[i]);
            } else if (index4 == 3) {
                await swapTokenToETHLineaSwap(info.ceBNB, wallet[i]);
            } else if (index4 == 4) {
                await swapETHToTokenLineaSwap(info.ceMATIC, wallet[i]);
            } else if (index4 == 5) {
                await swapTokenToETHLineaSwap(info.ceMATIC, wallet[i]);
            } else if (index4 == 6) {
                await swapETHToTokenLineaSwap(info.ceAVAX, wallet[i]);
            } else if (index4 == 7) {
                await swapTokenToETHLineaSwap(info.ceAVAX, wallet[i]);
            } else if (index4 == 8) {
                const arrTokens = [info.ceBUSD, info.ceBNB, info.ceMATIC, info.ceAVAX];
                await swapETHToTokenLineaSwap(arrTokens[generateRandomAmount(0, arrTokens.length - 1), 0], wallet[i]);
            } else if (index4 == 9) {
                const arrTokens = [info.ceBUSD, info.ceBNB, info.ceMATIC, info.ceAVAX];
                for (let n = 0; n < arrTokens.length; n++) {
                    await swapTokenToETHLineaSwap(arrTokens[n], wallet[i]);
                }
            }

            if (index5 == 0) { //ECHODEX STAGE
                await swapETHToTokenEcho(info.ceBUSD, wallet[i]);
            } else if (index5 == 1) {
                await swapTokenToETHEcho(info.ceBUSD, wallet[i]);
            } else if (index5 == 2) {
                await swapETHToTokenEcho(info.ceMATIC, wallet[i]);
            } else if (index5 == 3) {
                await swapTokenToETHEcho(info.ceMATIC, wallet[i]);
            } else if (index5 == 4) {
                const arrTokens = [info.ceBUSD, info.ceMATIC];
                await swapETHToTokenEcho(arrTokens[generateRandomAmount(0, arrTokens.length - 1), 0], wallet[i]);
            } else if (index5 == 5) {
                const arrTokens = [info.ceBUSD, info.ceMATIC];
                for (let i = 0; i < arrTokens.length; i++) {
                    await swapTokenToETHEcho(arrTokens[i], wallet[i]);
                }
            }

            if (index6 == 0) { //HORIZON STAGE
                await swapETHToTokenHorizon(info.ceBUSD, wallet[i]);
            } else if (index6 == 1) {
                await swapTokenToETHHorizon(info.ceBUSD, wallet[i]);
            } else if (index6 == 2) {
                await swapETHToTokenHorizon(info.ceBNB, wallet[i]);
            } else if (index6 == 3) {
                await swapTokenToETHHorizon(info.ceBNB, wallet[i]);
            } else if (index6 == 4) {
                const arrTokens = [info.ceBUSD, info.ceBNB];
                await swapETHToTokenHorizon(arrTokens[generateRandomAmount(0, arrTokens.length - 1), 0], wallet[i]);
            } else if (index6 == 5) {
                const arrTokens = [info.ceBUSD, info.ceBNB];
                for (let n = 0; n < arrTokens.length; n++) {
                    await swapTokenToETHHorizon(arrTokens[n], wallet[i]);
                }
            }

            if (index7 == 0) { //IZUMI STAGE
                await swapETHToTokenIzumi(info.ceBUSD, wallet[i]);
            } else if (index7 == 1) {
                await swapTokenToETHIzumi(info.ceBUSD, wallet[i]);
            } else if (index7 == 2) {
                await swapETHToTokenIzumi(info.izumiUSD, wallet[i]);
            } else if (index7 == 3) {
                await swapTokenToETHIzumi(info.izumiUSD, wallet[i]);
            } else if (index7 == 4) {
                const arrTokens = [info.ceBUSD, info.izumiUSD];
                await swapETHToTokenIzumi(arrTokens[generateRandomAmount(0, arrTokens.length - 1), 0], wallet[i]);
            } else if (index7 == 5) {
                const arrTokens = [info.ceBUSD, info.izumiUSD];
                for (let n = 0; n < arrTokens.length; n++) {
                    await swapTokenToETHIzumi(arrTokens[n], wallet[i]);
                }
            }

            if (index8 == 0) { //LINEANS STAGE
                await mintDomenName(wallet[i]);
            }
    
            if (index9 == 0) { //OTHER STAGE
                pauseWalletTime = 0;
                await getBalanceLinea(wallet);
                return;
            } else if (index9 == 1) {
                await mintOwltoLineaGalaxyNFT(wallet[i]);
            }
        } catch (error) {
            log('error', error, 'red');
        }

        if (i + 1 != wallet.length) {
            await timeout(pauseWalletTime);
        }
    }

    log('info', 'Process End!', 'bgMagentaBright');
})();