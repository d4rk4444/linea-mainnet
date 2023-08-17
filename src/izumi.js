import Web3 from 'web3';
import { ethers } from 'ethers';
import { info } from './other.js';
import { iziAbi } from './abi.js';
import { getDataTx, numberToHex } from './web3.js';
import { getAmountOut, getPool } from './syncSwap.js';

export const dataSwapETHToToken = async(amountETH, tokenAddress, slippage, sender) => {
    const dataEncode = tokenAddress == info.izumiUSD ? [
        ['address', 'uint24', 'address'],
        [info.WETH, '3000', info.izumiUSD]
    ] : [
        ['address', 'uint24', 'address', 'uint24', 'address'],
        [info.WETH, '3000', info.izumiUSD, '500', tokenAddress]
    ];
    const encoded = ethers.utils.solidityPack(...dataEncode);
    const amountOutMin = tokenAddress == info.izumiUSD ? '1'
        : await getAmountOut(await getPool(info.WETH, tokenAddress), info.WETH, amountETH, slippage, sender);

    const swapAmount = await getDataTx(info.rpcLinea, iziAbi, info.IzumiRouter, 'swapAmount',
        [[
            encoded,
            sender,
            numberToHex(amountETH),
            numberToHex(amountOutMin),
            parseInt(Date.now() + 10 * 60 / 1000)
        ]],
        numberToHex(amountETH),
        sender
    );

    return await getDataTx(info.rpcLinea, iziAbi, info.IzumiRouter, 'multicall',
        [[
            swapAmount.encodeABI,
            '0x12210e8a'
        ]],
        numberToHex(amountETH),
        sender
    );
}

export const dataSwapTokenToETH = async(amountToken, tokenAddress, slippage, sender) => {
    const dataEncode = tokenAddress == info.izumiUSD ? [
        ['address', 'uint24', 'address'],
        [tokenAddress, '500', info.WETH]
    ] : [
        ['address', 'uint24', 'address', 'uint24', 'address'],
        [tokenAddress, '500', info.izumiUSD, '500', info.WETH]
    ];
    const encoded = ethers.utils.solidityPack(...dataEncode);
    const amountOutMin = tokenAddress == info.izumiUSD ? '1'
        : await getAmountOut(await getPool(info.WETH, tokenAddress), tokenAddress, amountToken, slippage, sender);

    const swapAmount = await getDataTx(info.rpcLinea, iziAbi, info.IzumiRouter, 'swapAmount',
        [[
            encoded,
            sender,
            numberToHex(amountToken),
            numberToHex(amountOutMin),
            parseInt(Date.now() + 10 * 60 / 1000)
        ]],
        null,
        sender
    );

    const dataUnwrap = await getDataTx(info.rpcLinea, iziAbi, info.IzumiRouter, 'unwrapWETH9',
        [0, sender],
        null,
        sender
    );

    return await getDataTx(info.rpcLinea, iziAbi, info.IzumiRouter, 'multicall',
        [[
            swapAmount.encodeABI,
            dataUnwrap.encodeABI
        ]],
        null,
        sender
    );
}