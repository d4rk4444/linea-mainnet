import { info, log, privateToAddress } from "../src/other.js"
import { getTrueGasPrice } from "./other.js";
import { sendEVMTX } from "../src/web3.js";
import { dataClaimNFT, getPropertyClaimNFT } from "../src/galaxy.js";

export const mintOwltoLineaGalaxyNFT = async(privateKey) => {
    const address = privateToAddress(privateKey);

    const campaignID = 'GCGVkUjdpy';
    const gasPrice = await getTrueGasPrice(info.rpcLinea);
    
    await getPropertyClaimNFT(campaignID, address).then(async(property) => {
        if (property.prepareParticipate.allow) {
            await dataClaimNFT(info.rpcLinea,
                property.prepareParticipate.mintFuncInfo.powahs[0],
                property.prepareParticipate.mintFuncInfo.verifyIDs[0],
                property.prepareParticipate.mintFuncInfo.nftCoreAddress,
                property.prepareParticipate.signature,
                property.prepareParticipate.spaceStation,
                address).then(async(res) => {
                    await sendEVMTX(info.rpcLinea, 0, res.estimateGas, res.addressContract, null, res.encodeABI, privateKey, gasPrice);
            });
            log('log', 'Successful Claim Owlto x Linea Bridger NFT', 'green');
        } else {
            log('log', 'This address is not eligible or has already been claimed', 'red');
        }
    });
}