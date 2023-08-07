import { info } from './other.js';
import { lineaSwapAbi } from './abi.js';
import { multiply } from 'mathjs';
import { encodeParams, getDataCall, getDataTx, numberToHex } from './web3.js';

export const getAmountsOut = async(tokenIn, tokenOut, amountIn) => {
    return (await getDataCall(
        info.rpcLinea,
        lineaSwapAbi,
        info.LineaSwapRouter,
        'getAmountsOut',
        [numberToHex(amountIn), [tokenIn, tokenOut]]
    ))[1];
}

export const getAmountIn = async(tokenIn, tokenOut, amountOut) => {
    return (await getDataCall(
        info.rpcLinea,
        lineaSwapAbi,
        info.LineaSwapRouter,
        'getAmountsIn',
        [numberToHex(amountOut), [tokenIn, tokenOut]]
    ))[0];
}

export const dataSwapETHToToken = async(tokenB, amountETH, sender, slippage) => {
    const amountOut = parseInt(multiply(await getAmountsOut(info.WETH, tokenB, amountETH), slippage));
    const deadline = parseInt(Date.now() / 1000 + 3 * 60 * 60);

    return await getDataTx(info.rpcLinea, lineaSwapAbi, info.LineaSwapRouter, 'swapExactETHForTokens',
        [
            numberToHex(amountOut),
            [info.WETH, tokenB],
            sender,
            deadline
        ],
        numberToHex(amountETH),
        sender
    );
}

export const dataSwapTokenToETH = async(tokenA, amountToken, sender, slippage) => {
    const amountOut = parseInt(multiply(await getAmountsOut(tokenA, info.WETH, amountToken), slippage));
    const deadline = parseInt(Date.now() / 1000 + 3 * 60 * 60);

    return await getDataTx(info.rpcLinea, lineaSwapAbi, info.LineaSwapRouter, 'swapExactTokensForETH',
        [
            numberToHex(amountToken),
            numberToHex(amountOut),
            [tokenA, info.WETH],
            sender,
            deadline
        ],
        null,
        sender
    );
}