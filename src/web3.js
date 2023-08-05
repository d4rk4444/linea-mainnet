import Web3 from 'web3';
import { info, privateToAddress } from './other.js';
import { abiToken } from './abi.js';

export const getProvider = (rpc) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    return w3;
}

export const getDataTx = async(rpc, abi, addressContract, nameFunc, property, amountTx, addressFrom) => {
    const w3 = getProvider(rpc);
    const contract = new w3.eth.Contract(abi, addressContract);

    const data = contract.methods[nameFunc](...property);

    const encodeABI = data.encodeABI();
    const estimateGas = await data.estimateGas({ from: addressFrom, value: amountTx });
    return { encodeABI, estimateGas, addressContract };
}

export const getDataCall = async(rpc, abi, addressContract, nameFunc, property) => {
    const w3 = getProvider(rpc);
    const contract = new w3.eth.Contract(abi, addressContract);

    const data = await contract.methods[nameFunc](...property).call();

    return data;
}

export const getGasPrice = async(rpcProvider) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpcProvider));
    const gasPrice = await w3.eth.getGasPrice();
    const gasPriceInGwei = w3.utils.fromWei(gasPrice, 'Gwei');

    return gasPriceInGwei;
}

export const toWei = (amount, type) => {
    const w3 = new Web3();
    return w3.utils.toWei(amount, type);
}

export const fromWei = (amount, type) => {
    const w3 = new Web3();
    return w3.utils.fromWei(amount, type);
}

export const encodeParams = (types, params) => {
    const w3 = new Web3();
    return w3.eth.abi.encodeParameters(types, params);
}

export const numberToHex = (number) => {
    const w3 = new Web3();
    return w3.utils.numberToHex(number);
}

export const getDecimal = async(rpc, tokenAddress) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const token = new w3.eth.Contract(abiToken, w3.utils.toChecksumAddress(tokenAddress));

    const data = await token.methods.decimals().call();

    return data;
}

export const getETHAmount = async(rpc, walletAddress) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const data = await w3.eth.getBalance(walletAddress);
    return data;
}

export const getAmountToken = async(rpc, tokenAddress, walletAddress) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const token = new w3.eth.Contract(abiToken, w3.utils.toChecksumAddress(tokenAddress));

    const data = await token.methods.balanceOf(
        walletAddress
    ).call();

    return data;
}

export const getTokenId = async(rpc, addressNFT, walletAddress, index) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const token = new w3.eth.Contract(abiToken, w3.utils.toChecksumAddress(addressNFT));

    const data = await token.methods.tokenOfOwnerByIndex(
        walletAddress,
        index
    ).call();

    return data;
}

export const checkAllowance = async(rpc, tokenAddress, walletAddress, spender) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const token = new w3.eth.Contract(abiToken, w3.utils.toChecksumAddress(tokenAddress));

    const data = await token.methods.allowance(
        walletAddress,
        spender
    ).call();

    return data;
}

export const dataApprove = async(rpc, tokenAddress, contractAddress, amountApprove, fromAddress) => {
    const w3 = getProvider(rpc);
    const contract = new w3.eth.Contract(abiToken, w3.utils.toChecksumAddress(tokenAddress));

    const data = contract.methods.approve(
        contractAddress,
        numberToHex(amountApprove),
    );
    const encodeABI = data.encodeABI();
    const estimateGas = await data.estimateGas({ from: fromAddress });

    return { encodeABI, estimateGas };
}

export const dataApproveNFT = async(rpc, nftAddress, operatorAddress, fromAddress) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const contract = new w3.eth.Contract(abiToken, w3.utils.toChecksumAddress(nftAddress));

    const data = contract.methods.setApprovalForAll(
        operatorAddress,
        true,
    );
    const encodeABI = data.encodeABI();
    const estimateGas = await data.estimateGas({ from: fromAddress });

    return { encodeABI, estimateGas };
}

export const dataSendToken = async (rpc, tokenAddress, toAddress, amount, fromAddress) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const contract = new w3.eth.Contract(abiToken, w3.utils.toChecksumAddress(tokenAddress));

    const data = contract.methods.transfer(
        toAddress,
        w3.utils.numberToHex(amount)
    );
    const encodeABI = data.encodeABI();
    const estimateGas = await data.estimateGas({ from: fromAddress });

    return { encodeABI, estimateGas };
}

export const getTxData = async(rpc, tx) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const transaction = await w3.eth.getTransactionReceipt(tx);
    return transaction.logs;
}

export const sendEVMTX = async(rpc, typeTx, gasLimit, toAddress, value, data, privateKey, maxFeeOrGasPrice, maxPriorityFee) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const fromAddress = privateToAddress(privateKey);
    let tx;
    
    if (typeTx == 0) {
        tx = {
            'from': fromAddress,
            'gas': gasLimit,
            'gasPrice': w3.utils.toWei(maxFeeOrGasPrice, 'Gwei'),
            'chainId': await w3.eth.getChainId(),
            'to': toAddress,
            'nonce': await w3.eth.getTransactionCount(fromAddress),
            'value': value,
            'data': data
        }
    } else if (typeTx == 2) {
        tx = {
            'from': fromAddress,
            'gas': gasLimit,
            'maxFeePerGas': w3.utils.toWei(maxFeeOrGasPrice, 'Gwei'),
            'maxPriorityFeePerGas': w3.utils.toWei(maxPriorityFee, 'Gwei'),
            'chainId': await w3.eth.getChainId(),
            'to': toAddress,
            'nonce': await w3.eth.getTransactionCount(fromAddress),
            'value': value,
            'data': data
        }
    }

    const signedTx = await w3.eth.accounts.signTransaction(tx, privateKey);
    const result = await w3.eth.sendSignedTransaction(signedTx.rawTransaction, async(error, hash) => {
        if (!error) {
            const chain = (Object.keys(info)[Object.values(info).findIndex(e => e == rpc)]).slice(3);
            const explorer = info['explorer' + (Object.keys(info)[Object.values(info).findIndex(e => e == rpc)]).slice(3)];
            console.log(`${chain} TX: ${explorer + hash}`);
        } else {
            console.log(`Error Tx: ${error}`);
        }
    });

    return result;
}