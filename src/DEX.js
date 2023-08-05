import { info } from './other.js';
import { dexAbi } from './abi.js';
import { getDataTx } from './web3.js';

export const dataWrapETH = async(amount, addressFrom) => {
    return await getDataTx(info.rpcLinea, dexAbi, info.WETH, 'deposit',
        [],
        amount, addressFrom);
}