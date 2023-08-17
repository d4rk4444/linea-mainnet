import { info } from './other.js';
import { SSRouterAbi, SSClassicPoolFactoryAbi, SSPoolMasterAbi, SSLPPoolAbi } from './abiSync.js';
import { divide, multiply } from 'mathjs';
import { encodeParams, fromWei, getDataCall, getDataTx, getProvider, numberToHex, toWei } from './web3.js';

export const getPool = async(tokenA, tokenB) => {
    return await getDataCall(
        info.rpcLinea,
        SSClassicPoolFactoryAbi,
        info.SyncPoolFactory,
        'getPool',
        [tokenA, tokenB]
    );
}

export const getAmountOut = async(addressLP, tokenIn, amountIn, slippage, sender) => {
    return parseInt(multiply(await getDataCall(
        info.rpcLinea,
        SSLPPoolAbi,
        addressLP,
        'getAmountOut',
        [tokenIn, numberToHex(amountIn), sender]
    ), slippage));
}

export const getAmountIn = async(addressLP, tokenOut, amountOut, slippage, sender) => {
    return parseInt(multiply(await getDataCall(
        info.rpcLinea,
        SSLPPoolAbi,
        addressLP,
        'getAmountIn',
        [tokenOut, numberToHex(amountOut), sender]
    ), slippage));
}

export const dataSwapETHToToken = async(addressToken, amountETH, sender, slippage) => {
    const dataSwap = encodeParams(['address', 'address', 'uint8'], [info.WETH, sender, 2]);
    const addressLP = await getPool(info.WETH, addressToken);
    const amountOut = await getAmountOut(addressLP, info.WETH, amountETH, slippage, sender);
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
    const amountOut = await getAmountOut(addressLP, addressToken, amount, slippage, sender);
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

//===============================================================

export const getPoolAmount = async(addressLP) => {
    const data = await getDataCall(info.rpcLinea, SSLPPoolAbi, addressLP, 'getReserves', []);
    const _reserve0 = (data._reserve0).toString();
    const _reserve1 = (data._reserve1).toString();

    const totalSupply = await getDataCall(info.rpcLinea, SSLPPoolAbi, addressLP, 'totalSupply', []);

    return { _reserve0, _reserve1, totalSupply };
}

export const getLiquidityData = async(addressLP, amountToken, slippage) => {
    const dataPool = await getPoolAmount(addressLP);

    const minLPOutAmount = parseInt( divide(fromWei(dataPool.totalSupply, 'ether'), fromWei(dataPool._reserve0, 'ether')) * amountToken * slippage );
    const priceETH =  toWei( divide(fromWei(dataPool._reserve0, 'ether'), fromWei(dataPool._reserve1, 'ether')).toString(), 'ether');
    //const priceUSDC = parseInt( divide(parseInt(poolETH._reserve1 / 10**18), parseInt(poolETH._reserve0 / 10**6)) * 10**18 * 0.995);

    return { minLPOutAmount, priceETH };
}

export const dataAddLiquidity = async(addressToken, amountToken, sender, slippage) => {
    const addressLP = await getPool(info.WETH, addressToken);
    const dataLiq = await getLiquidityData(addressLP, amountToken, slippage);
    const amountETH = parseInt( toWei( ((amountToken / 10**18) / (dataLiq.priceETH / 10**18)).toString(), 'ether'));
    const dataAddress = encodeParams(['address'], [sender]);

    return await getDataTx(info.rpcLinea, SSRouterAbi, info.SyncRouter, 'addLiquidity2',
        [
            addressLP,
            [
                [
                    addressToken,
                    numberToHex(amountToken)
                ],
                [
                    info.ETH,
                    numberToHex(amountETH)
                ]
            ],
            dataAddress,
            numberToHex(dataLiq.minLPOutAmount),
            "0x0000000000000000000000000000000000000000",
            "0x"
        ],
        numberToHex(amountETH),
        sender
    );
}

//===============================================================

export const getWithdrawLiquidityData = async(addressLP, amountLP, slippage) => {
    const dataPool = await getPoolAmount(addressLP);
    const minETHAmount = toWei((divide(
        parseInt(fromWei((dataPool._reserve1 * 2).toString(), 'ether')),
        parseInt(dataPool.totalSupply / 10**6)
    ) * amountLP/10**6 * slippage).toString(), 'ether');

    return minETHAmount;
}

export const dataDeleteLiquidity = async(addressLP, amountLP, sender, slippage) => {
    const amountETH = await getWithdrawLiquidityData(addressLP, amountLP, slippage);
    const dataSwap = encodeParams(['address', 'address', 'uint8'], [info.WETH, sender, 1]);

    return await getDataTx(info.rpcLinea, SSRouterAbi, info.SyncRouter, 'burnLiquiditySingle',
        [
            addressLP,
            numberToHex(amountLP),
            dataSwap,
            numberToHex(amountETH),
            "0x0000000000000000000000000000000000000000",
            "0x",
        ],
        null,
        sender
    );
}