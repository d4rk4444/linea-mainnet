import { info } from './other.js';
import { lineansAbi } from './abi.js';
import { getDataTx, numberToHex, toWei } from './web3.js';

export const dataMintLineans = async(domenName, sender) => {
    return await getDataTx(info.rpcLinea, lineansAbi, info.Lineans, 'directRegister',
        [
            domenName,
            sender,
            '31536000',
            'linea',
            '0xaEde002BbBE985DdaBD208FdFd80Fa6d7b97B9d1',
            sender,
            '0x0000000000000000000000000000000000000000000000000000000000000000'
        ],
        numberToHex(toWei('0.0027105', 'ether')),
        sender
    );
}