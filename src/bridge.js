import fs from 'fs';
import { info, parseJsonFile } from './other.js';
import { bridgeAbi } from './abi.js';
import { decodeParams, getDataTx, numberToHex } from './web3.js';
import { add } from 'mathjs';

export const dataBridgeMainnet = async(amount, fee, addressFrom) => {
    return await getDataTx(info.rpcEthereum, bridgeAbi, info.bridgeMainet, 'sendMessage',
        [addressFrom, numberToHex(fee), '0x'],
        add(amount, fee), addressFrom);
}

export const dataBridgeLinea = async(amount, fee, addressFrom) => {
    return await getDataTx(info.rpcLinea, bridgeAbi, info.bridgeLinea, 'sendMessage',
        [addressFrom, fee, '0x'],
        add(amount, fee), addressFrom);
}

export const dataClaimBridgeMainnet = async(value, nonce, addressFrom) => {
    return await getDataTx(info.rpcEthereum, bridgeAbi, info.bridgeMainet, 'claimMessage',
        [addressFrom, addressFrom, '0', numberToHex(value), '0x0000000000000000000000000000000000000000', '0x', nonce],
        null, addressFrom);
}

export const writeBridgeInfo = (file, data, addressFrom) => {
    let oldData = parseJsonFile(file);

    const bridgeInfo = decodeParams(['uint256', 'uint256', 'uint256', 'bytes'], data);
    oldData[addressFrom] = {
        value: bridgeInfo['1'],
        nonce: bridgeInfo['2']
    };

    oldData = JSON.stringify(oldData, null, 2);
    fs.writeFileSync(file, oldData, 'utf8');
}

export const clearBridgeInfo = (file) => {
    fs.writeFileSync(file, '{}', 'utf8');
}