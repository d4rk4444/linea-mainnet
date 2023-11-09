import { info, log, privateToAddress } from "../src/other.js"
import { getTrueAmount, getTrueGasPrice } from "./other.js";
import { sendEVMTX } from "../src/web3.js";
import { dataWrapETH } from "../src/DEX.js";

export const wrapETH = async(rpc, privateKey) => {
    const address = privateToAddress(privateKey);

    const amount = await getTrueAmount(rpc, address, 'Swap');
    const gasPrice = await getTrueGasPrice(rpc);
    
    await dataWrapETH(amount, address).then(async(res) => {
        await sendEVMTX(rpc, res.estimateGas, info.WETH, amount, res.encodeABI, privateKey, gasPrice);
    });

    log('log', `Successful Wrap ${amount}ETH`, 'green');
}