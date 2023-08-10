import { info } from './other.js';
import { lineaSwapAbi, echoDEXAbi } from './abi.js';
import { multiply } from 'mathjs';
import { getDataCall, getDataTx, getPadLeft, numberToHex } from './web3.js';

export const getAmountsOut = async(tokenIn, tokenOut, amountIn) => {
    return (await getDataCall(
        info.rpcLinea,
        lineaSwapAbi,
        info.EchoDEXFee,
        'getAmountsOut',
        [numberToHex(amountIn), [tokenIn, tokenOut]]
    ))[1];
}

export const getAmountIn = async(tokenIn, tokenOut, amountOut) => {
    return (await getDataCall(
        info.rpcLinea,
        lineaSwapAbi,
        info.EchoDEXFee,
        'getAmountsIn',
        [numberToHex(amountOut), [tokenIn, tokenOut]]
    ))[0];
}

export const dataSwapETHToToken = async(tokenB, amountETH, sender, slippage) => {
    const amountOut = parseInt(multiply(await getAmountsOut(info.WETH, tokenB, amountETH), slippage));
    const deadline = parseInt(Date.now() / 1000 + 3 * 60 * 60);
    const poolFee = tokenB == info.ceBUSD ? 100
        : info.ceMATIC ? 2500 : 0;

    const dataSwap = await getDataTx(info.rpcLinea, echoDEXAbi, info.EchoDEXRouter, 'exactInputSingle',
        [
            [
                info.WETH,
                tokenB,
                poolFee,
                sender,
                numberToHex(amountETH),
                numberToHex(amountOut),
                0
            ]
        ],
        numberToHex(amountETH),
        sender
    );

    return await getDataTx(info.rpcLinea, echoDEXAbi, info.EchoDEXRouter, 'multicall',
        [
            numberToHex(deadline),
            [
                dataSwap.encodeABI
            ]
        ],
        numberToHex(amountETH),
        sender
    );
}

export const dataSwapTokenToETH = async(tokenA, amountToken, sender, slippage) => {
    const amountOut = parseInt(multiply(await getAmountsOut(tokenA, info.WETH, amountToken), slippage));
    const deadline = parseInt(Date.now() / 1000 + 3 * 60 * 60);
    const poolFee = tokenA == info.ceBUSD ? 100
        : info.ceMATIC ? 2500 : 0;

    const dataSwap = await getDataTx(info.rpcLinea, echoDEXAbi, info.EchoDEXRouter, 'exactInputSingle',
        [
            [
                tokenA,
                info.WETH,
                poolFee,
                '0x0000000000000000000000000000000000000002',
                numberToHex(amountToken),
                numberToHex(amountOut),
                0
            ]
        ],
        null,
        sender
    );

    return await getDataTx(info.rpcLinea, echoDEXAbi, info.EchoDEXRouter, 'multicall',
        [
            numberToHex(deadline),
            [
                dataSwap.encodeABI,
                '0x49404b7c' + (getPadLeft(numberToHex(amountOut), 64)).slice(2) + (getPadLeft(sender, 64)).slice(2)
            ]
        ],
        null,
        sender
    );
}