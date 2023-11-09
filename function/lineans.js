import { sendEVMTX } from "../src/web3.js";
import { dataMintLineans } from "../src/lineans.js";
import { info, log, privateToAddress } from "../src/other.js"
import { generateRandomDomenName, getTrueGasPrice } from "./other.js";

export const mintDomenName = async(privateKey) => {
    const address = privateToAddress(privateKey);

    const gasPrice = await getTrueGasPrice(info.rpcLinea);
    const domenName = await generateRandomDomenName(info.domenLenghtMax);
    
    await dataMintLineans(domenName, address).then(async(res) => {
        await sendEVMTX(info.rpcLinea, res.estimateGas, res.addressContract, res.amountTx, res.encodeABI, privateKey, gasPrice);
    });

    log('log', `Successful Mint ${domenName} Domen`, 'green');
}