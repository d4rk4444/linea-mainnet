import { info } from './other.js';
import { bridgeAbi } from './abi.js';
import { getDataTx, numberToHex } from './web3.js';
import { add } from 'mathjs';

export const dataBridgeMainet = async(amount, fee, addressFrom) => {
    return await getDataTx(info.rpcEthereum, bridgeAbi, info.bridgeMainet, 'sendMessage',
        [addressFrom, numberToHex(fee), '0x'],
        add(amount, fee), addressFrom
    );
}