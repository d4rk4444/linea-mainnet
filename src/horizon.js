import { info } from './other.js';
import { horizenAbi } from './abi.js';
import { multiply } from 'mathjs';
import { getDataTx, getPadLeft, numberToHex } from './web3.js';

export const dataSwapETHToToken = async(tokenB, amountETH, sender) => {
    const deadline = parseInt(Date.now() / 1000 + 3 * 60 * 60);
    const poolFee = 40;

    return await getDataTx(info.rpcLinea, horizenAbi, info.HorizenRouter, 'swapExactInputSingle',
        [
            [
                info.WETH,
                tokenB,
                poolFee,
                sender,
                deadline,
                numberToHex(amountETH),
                '1',
                0
            ]
        ],
        numberToHex(amountETH),
        sender
    );
}

export const dataSwapTokenToETH = async(tokenA, amountToken, sender) => {
    const deadline = parseInt(Date.now() / 1000 + 3 * 60 * 60);
    const poolFee = 40;

    const dataSwap = await getDataTx(info.rpcLinea, horizenAbi, info.HorizenRouter, 'swapExactInputSingle',
        [
            [
                tokenA,
                info.WETH,
                poolFee,
                info.ETH,
                deadline,
                numberToHex(amountToken),
                '1',
                0
            ]
        ],
        null,
        sender
    );

    return await getDataTx(info.rpcLinea, horizenAbi, info.HorizenRouter, 'multicall',
        [
            [
                dataSwap.encodeABI,
                '0xbac37ef7' + (getPadLeft(numberToHex('1000'), 64)).slice(2) + (getPadLeft(sender, 64)).slice(2)
            ]
        ],
        null,
        sender
    );
}