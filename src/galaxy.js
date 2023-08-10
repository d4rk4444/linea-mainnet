import { gql, GraphQLClient } from 'graphql-request';
import { getDataTx } from './web3.js';
import { galaxyAbi } from './abi.js';

export const getPropertyClaimNFT = async (campaignID, address) => {
    const graphQLClient = new GraphQLClient('https://graphigo.prd.galaxy.eco/query');
    const query = gql`
        mutation claim {
            prepareParticipate(
                input: {signature: "", campaignID: "${campaignID}", address: "${address}"}
            ) {
                allow
                disallowReason
                signature
                spaceStation
                mintFuncInfo {
                    cap
                    powahs
                    verifyIDs
                    nftCoreAddress
                }
            }
        }
    `;
    const result = await graphQLClient.request(query);

    return result;
}

export const dataClaimNFT = async (rpc, powahs, verifyIDs, addressNFTCore, signature, addressSpace, sender) => {
    return await getDataTx(rpc, galaxyAbi, addressSpace, 'claim',
        [
            powahs,
            addressNFTCore,
            verifyIDs,
            powahs,
            signature
        ],
        null,
        sender);
}