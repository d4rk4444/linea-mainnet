import { info } from './other.js';
import { SSRouterAbi, SSClassicPoolFactoryAbi, SSPoolMasterAbi, SSLPPoolAbi } from './abiSync.js';
import { multiply } from 'mathjs';
import { encodeParams, getDataCall, getDataTx, numberToHex } from './web3.js';

export const getPool = async(tokenA, tokenB) => {
    return await getDataCall(
        info.rpcLinea,
        SSClassicPoolFactoryAbi,
        info.SyncPoolFactory,
        'getPool',
        [tokenA, tokenB]
    );
}

export const getAmountOut = async(addressLP, tokenIn, amountIn, sender) => {
    return await getDataCall(
        info.rpcLinea,
        SSLPPoolAbi,
        addressLP,
        'getAmountOut',
        [tokenIn, numberToHex(amountIn), sender]
    );
}

export const getAmountIn = async(addressLP, tokenOut, amountOut, sender) => {
    return await getDataCall(
        info.rpcLinea,
        SSLPPoolAbi,
        addressLP,
        'getAmountIn',
        [tokenOut, numberToHex(amountOut), sender]
    );
}

export const dataSwapETHToToken = async(addressToken, amountETH, sender, slippage) => {
    const dataSwap = encodeParams(['address', 'address', 'uint8'], [info.WETH, sender, 2]);
    const addressLP = await getPool(info.WETH, addressToken);
    const amountOut = parseInt(multiply(await getAmountOut(addressLP, info.WETH, amountETH, sender), slippage));
    const deadline = parseInt(Date.now() / 1000 + 3 * 60 * 60);

    return await getDataTx(info.rpcLinea, SSRouterAbi, info.SyncRouter, 'swap',
        [
            [[
                [[
                    addressLP,
                    dataSwap,
                    "0x0000000000000000000000000000000000000000",
                    "0x"
                ]],
                info.ETH,
                numberToHex(amountETH)
            ]],
            numberToHex(amountOut),
            deadline
        ],
        numberToHex(amountETH),
        sender
    );
}

export const dataSwapTokenToETH = async(addressToken, amount, sender, slippage) => {
    const dataSwap = encodeParams(['address', 'address', 'uint8'], [addressToken, sender, 1]);
    const addressLP = await getPool(info.WETH, addressToken);
    const amountOut = parseInt(multiply(await getAmountOut(addressLP, addressToken, amount, sender), slippage));
    const deadline = Date.now() + 20 * 60 * 1000;

    return await getDataTx(info.rpcLinea, SSRouterAbi, info.SyncRouter, 'swap',
            [[[
                [[
                    addressLP,
                    dataSwap,
                    "0x0000000000000000000000000000000000000000",
                    "0x"
                ]],
                addressToken,
                amount
            ]],
            numberToHex(amountOut),
            deadline
        ],
        null,
        sender
    );
}