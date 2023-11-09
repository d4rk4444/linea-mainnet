import { metamaskAbi } from './abi.js';
import { subtract, multiply } from 'mathjs';
import { getDataTx, getProvider, numberToHex, toWei } from './web3.js';

export const dataBridgeMetamask = async(rpc, router, amount, addressTo) => {
    const w3 = getProvider();
    const fee = numberToHex(parseInt(multiply(amount, 0.00875)));
    const amountWithFee = numberToHex(subtract(amount, fee));
    const bonderFee = numberToHex(toWei('0.001', 'ether'));
    const amountOutMin = numberToHex(parseInt(amount * 0.8));

    const dataBytes = '0x0000000000000000000000006ef81a18e1e432c289dc0d1a670b78e8bbf9aa35'
        + '0000000000000000000000006ef81a18e1e432c289dc0d1a670b78e8bbf9aa35'
        + '000000000000000000000000000000000000000000000000000000000000e708'
        + '0000000000000000000000000000000000000000000000000000000000000000'
        + '0000000000000000000000000000000000000000000000000000000000000000' 
        + (w3.utils.padLeft(amountWithFee, 64)).slice(2)
        + '0000000000000000000000000000000000000000000000000000000000000140'
        + (w3.utils.padLeft(fee, 64)).slice(2)
        + '000000000000000000000000716a8b9dd056055c84b7a2ba0a016099465a5187'
        + '0000000000000000000000000000000000000000000000000000000000000044'
        + '161be5423e12e350bbf230f3' + addressTo.slice(2)
        + '0000e708'
        + (w3.utils.padLeft(bonderFee, 32)).slice(2)
        + (w3.utils.padLeft(amountOutMin, 32)).slice(2)
        + '00000000000000000000000000000000000000000000000000000000';

    return await getDataTx(rpc, metamaskAbi, router, 'bridge',
        [
            'lifiAdapterV2',
            '0x0000000000000000000000000000000000000000',
            numberToHex(amount),
            dataBytes
        ],
        numberToHex(amount),
        addressTo
    );
}