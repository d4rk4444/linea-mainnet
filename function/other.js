import { log, timeout } from "../src/other.js";
import { getGasPrice } from "../src/web3.js";

export const waitGasPrice = async(rpc, needGasPrice, pauseTime) => {
    while (true) {
        const gasPriceNow = await getGasPrice(rpc);
        if (Number(gasPriceNow) <= Number(needGasPrice)) {
            log('log', `Gas price = ${Number(gasPriceNow).toFixed(2)}`, 'green');
            return parseFloat(gasPriceNow).toFixed(9);
        } else {
            log('log', `Wait for Gas Price, now = ${Number(gasPriceNow).toFixed(2)}`);
            await timeout(pauseTime);
        }
    }
}