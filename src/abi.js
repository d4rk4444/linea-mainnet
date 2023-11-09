export const abiToken = [
    {
        "type":"function",
        "name":"balanceOf",
        "inputs": [{"name":"account","type":"address"}],
        "outputs": [{"name":"amount","type":"uint256"}]
    },
    {
        "type":"function",
        "name":"allowance",
        "inputs": [
            {"name":"owner","type":"address"},
            {"name":"spender","type":"address"}
        ],
        "outputs": [{"name":"amount","type":"uint256"}]
    },
    {
        "type":"function",
        "name":"decimals",
        "inputs": [],
        "outputs": [{"name":"","type":"uint8"}]
    },
    {
        "type":"function",
        "name":"transfer",
        "inputs": [
            {"name":"recipient","type":"address"},
            {"name":"amount","type":"uint256"}
        ]
    },
    {
        "type":"function",
        "name":"transferFrom",
        "inputs": [
            {"name":"sender","type":"address"},
            {"name":"recipient","type":"address"},
            {"name":"amount","type":"uint256"}
        ]
    },
    {
        "type":"function",
        "name":"approve",
        "inputs": [
            {"name":"spender","type":"address"},
            {"name":"amount","type":"uint256"}
        ]
    },
    {
        "type":"function",
        "name":"mint",
        "inputs": [
            {"name":"recipient","type":"address"},
            {"name":"amount","type":"uint256"}
        ]
    },
    {
        "type":"function",
        "name":"tokenOfOwnerByIndex",
        "inputs": [
            {"name":"owner","type":"address"},
            {"name":"index","type":"uint256"}
        ],
        "outputs": [{"name":"","type":"uint256"}]
    },
    {
        "type":"function",
        "name":"setApprovalForAll",
        "inputs": [
            {"name":"operator","type":"address"},
            {"name":"approved","type":"bool"}
        ],
    },
    {
        "type":"function",
        "name":"safeTransferFrom",
        "inputs": [
            {"name":"from","type":"address"},
            {"name":"to","type":"address"},
            {"name":"amount","type":"uint256"},
        ],
    },
];

export const bridgeAbi = [
    {
        "type":"function",
        "name":"sendMessage",
        "inputs": [
            {"name":"_to","type":"address"},
            {"name":"_fee","type":"uint256"},
            {"name":"_calldata","type":"bytes"}
        ]
    },
    {
        "type":"function",
        "name":"claimMessage",
        "inputs": [
            {"name":"_from","type":"address"},
            {"name":"_to","type":"address"},
            {"name":"_fee","type":"uint256"},
            {"name":"_value","type":"uint256"},
            {"name":"_feeRecipient","type":"address"},
            {"name":"_calldata","type":"bytes"},
            {"name":"_nonce","type":"uint256"}
        ]
    }
];

export const dexAbi = [
    {
        "type":"function",
        "name":"deposit",
        "inputs": []
    }
];

export const lineaSwapAbi = [
    {
        "type":"function",
        "name":"factory",
        "inputs": [],
        "outputs": [{"name":"","type":"address"}]
    },
    {
        "type":"function",
        "name":"getPair",
        "inputs": [
          {"name":"tokenA","type":"address"},
          {"name":"tokenB","type":"address"}
        ],
        "outputs": [{"name":"pair","type":"address"}]
    },
    {
        "type":"function",
        "name":"getAmountsOut",
        "inputs": [
            {"name":"amountIn","type":"uint256"},
            {"name":"path","type":"address[]"},
        ],
        "outputs": [
            {"name":"amounts","type":"uint256[]"},
        ]
    },
    {
        "type":"function",
        "name":"getAmountsIn",
        "inputs": [
            {"name":"amountOut","type":"uint256"},
            {"name":"path","type":"address[]"},
        ],
        "outputs": [
            {"name":"amounts","type":"uint256[]"},
        ]
    },
    {
        "type":"function",
        "name":"swapExactETHForTokens",
        "inputs": [
            {"name":"amountOutMin","type":"uint256"},
            {"name":"path","type":"address[]"},
            {"name":"to","type":"address"},
            {"name":"deadline","type":"uint256"}
        ]
    },
    {
        "type":"function",
        "name":"swapExactTokensForETH",
        "inputs": [
            {"name":"amountIn","type":"uint256"},
            {"name":"amountOutMin","type":"uint256"},
            {"name":"path","type":"address[]"},
            {"name":"to","type":"address"},
            {"name":"deadline","type":"uint256"}
        ]
    },
    {
        "type":"function",
        "name":"getReserves",
        "inputs": [],
        "outputs": [
          {"name":"_reserve0","type":"uint112"},
          {"name":"_reserve1","type":"uint112"},
          {"name":"_blockTimestampLast","type":"uint32"},
        ]
    },
    {
        "type":"function",
        "name":"totalSupply",
        "inputs": [],
        "outputs": [{"name":"","type":"uint256"}]
    },
    {
        "type":"function",
        "name":"addLiquidityETH",
        "inputs": [
            {"name":"token","type":"address"},
            {"name":"amountTokenDesired","type":"uint256"},
            {"name":"amountTokenMin","type":"uint256"},
            {"name":"amountETHMin","type":"uint256"},
            {"name":"to","type":"address"},
            {"name":"deadline","type":"uint256"}
        ]
    },
    {
        "type":"function",
        "name":"addLiquidityETH",
        "inputs": [
            {"name":"token","type":"address"},
            {"name":"amountTokenDesired","type":"uint256"},
            {"name":"amountTokenMin","type":"uint256"},
            {"name":"amountETHMin","type":"uint256"},
            {"name":"to","type":"address"},
            {"name":"deadline","type":"uint256"}
        ]
    },
    {
        "type":"function",
        "name":"deposit",
        "inputs": [
            {"name":"_pid","type":"uint256"},
            {"name":"_amount","type":"uint256"},
        ]
    },
    {
        "type":"function",
        "name":"userInfo",
        "inputs": [
            {"name":"","type":"uint256"},
            {"name":"","type":"address"}
        ],
        "outputs": [
          {"name":"amount","type":"uint256"}
        ]
    },
    {
        "type":"function",
        "name":"withdraw",
        "inputs": [
            {"name":"_pid","type":"uint256"},
            {"name":"_amount","type":"uint256"},
        ]
    },
    {
        "type":"function",
        "name":"removeLiquidityETH",
        "inputs": [
            {"name":"token","type":"address"},
            {"name":"liquidity","type":"uint256"},
            {"name":"amountTokenMin","type":"uint256"},
            {"name":"amountETHMin","type":"uint256"},
            {"name":"to","type":"address"},
            {"name":"deadline","type":"uint256"}
        ]
    },
];

export const lineansAbi = [
    {
        "type":"function",
        "name":"directRegister",
        "inputs": [
            {"name":"","type":"string"},
            {"name":"","type":"address"},
            {"name":"","type":"uint256"},
            {"name":"","type":"string"},
            {"name":"","type":"address"},
            {"name":"","type":"address"},
            {"name":"","type":"bytes32"}
        ]
    }
];

export const echoDEXAbi = [
    {
        "type":"function",
        "name":"multicall",
        "inputs": [
            {"name":"deadline","type":"uint256"},
            {"name":"data","type":"bytes[]"},
        ],
    },
    {
        "type":"function",
        "name":"exactInputSingle",
        "inputs": [
            {
                "name":"params",
                "type":"tuple",
                "components": [
                    {"name": "tokenIn","type": "address"},
                    {"name": "tokenOut","type": "address"},
                    {"name": "fee","type": "uint24"},
                    {"name": "recipient","type": "address"},
                    {"name": "amountIn","type": "uint256"},
                    {"name": "amountOutMinimum","type": "uint256"},
                    {"name": "sqrtPriceLimitX96","type": "uint160"},
                ]
            }
        ]
    },
    {
        "type":"function",
        "name":"unwrapWETH9",
        "inputs": [
            {"name":"amountMinimum","type":"uint256"},
            {"name":"recipient","type":"address"},
        ],
    },
    {
        "type":"function",
        "name":"quoteExactOutputSingle",
        "inputs": [
            {
                "name":"params",
                "type":"tuple",
                "components": [{
                    "name": "tokenIn",
                    "type": "address"
                },
                {
                    "name": "tokenOut",
                    "type": "address"
                },
                {
                    "name": "amount",
                    "type": "uint256"
                },
                {
                    "name": "fee",
                    "type": "uint24"
                },
                {
                    "name": "sqrtPriceLimitX96",
                    "type": "uint160"
                }]
            }
        ],
        "outputs": [
            {"name":"amountIn","type":"uint256"},
            {"name":"sqrtPriceX96After","type":"uint160"},
            {"name":"initializedTicksCrossed","type":"uint32"},
            {"name":"gasEstimate","type":"uint256"},
        ]
    },
];

export const horizenAbi = [
    {
        "type":"function",
        "name":"multicall",
        "inputs": [
            {"name":"data","type":"bytes[]"}
        ],
    },
    {
        "type":"function",
        "name":"swapExactInputSingle",
        "inputs": [
            {
                "name":"params",
                "type":"tuple",
                "components": [
                    {"name": "tokenIn","type": "address"},
                    {"name": "tokenOut","type": "address"},
                    {"name": "fee","type": "uint24"},
                    {"name": "recipient","type": "address"},
                    {"name": "deadline","type": "uint256"},
                    {"name": "amountIn","type": "uint256"},
                    {"name": "minAmountOut","type": "uint256"},
                    {"name": "limitSqrtP","type": "uint160"},
                ]
            }
        ]
    },
    {
        "type":"function",
        "name":"unwrapWeth",
        "inputs": [
            {"name":"minAmount","type":"uint256"},
            {"name":"recipient","type":"address"}
        ]
    }
];

export const galaxyAbi = [
    {
        "type":"function",
        "name":"galaxy_signer",
        "inputs": [
        ],
        "outputs": [
            {"name":"galaxy_signer","type":"address"},
        ]
    },
    {
        "type":"function",
        "name":"manager",
        "inputs": [
        ],
        "outputs": [
            {"name":"r0","type":"address"},
        ]
    },
    {
        "type":"function",
        "name":"treasury_manager",
        "inputs": [
        ],
        "outputs": [
            {"name":"treasury_manager","type":"address"},
        ]
    },
    {
        "type":"function",
        "name":"campaign_setter",
        "inputs": [
        ],
        "outputs": [
            {"name":"campaign_setter","type":"address"},
        ]
    },
    {
        "type":"function",
        "name":"_hash",
        "inputs": [
            {"name":"_cid","type":"uint256"},
            {"name":"_starNFT","type":"address"},
            {"name":"_dummyId","type":"uint256"},
            {"name":"_powah","type":"uint256"},
            {"name":"_account","type":"address"},
        ],
        "outputs": [
            {"name":"hash","type":"bytes32"},
        ]
    },
    {
        "type":"function",
        "name":"claim",
        "inputs": [
            {"name":"_cid","type":"uint256"},
            {"name":"_starNFT","type":"address"},
            {"name":"_dummyId","type":"uint256"},
            {"name":"_powah","type":"uint256"},
            {"name":"_signature","type":"bytes"},
        ],
    },
    {
        "type":"function",
        "name":"mintToken",
        "inputs": [
            {"name":"nftType","type":"uint256"}
        ],
    }
];

export const iziAbi = [
    {
        "type":"function",
        "name":"multicall",
        "inputs": [
            {"name":"data","type":"bytes[]"}
        ]
    },
    {
        "type":"function",
        "name":"swapAmount",
        "inputs": [
            {
                "name":"params",
                "type":"tuple",
                "components": [
                    {"name":"","type":"bytes"},
                    {"name":"","type":"address"},
                    {"name":"","type":"uint128"},
                    {"name":"","type":"uint256"},
                    {"name":"","type":"uint256"}
                ]
            }
        ]
    },
    {
        "type":"function",
        "name":"unwrapWETH9",
        "inputs": [
            {"name":"minAmount","type":"uint256"},
            {"name":"recipient","type":"address"}
        ]
    },
];

export const metamaskAbi = [
    {
        "type":"function",
        "name":"swap",
        "inputs": [
            {"name": "rootHash", "type": "string"},
            {"name": "destinationChainId", "type": "address"},
            {"name": "totalAmount", "type": "uint256"},
            {"name": "destinationChainId", "type": "bytes"}
        ]
    },
    {
        "type":"function",
        "name":"bridge",
        "inputs": [
            {"name": "rootHash", "type": "string"},
            {"name": "destinationChainId", "type": "address"},
            {"name": "totalAmount", "type": "uint256"},
            {"name": "destinationChainId", "type": "bytes"}
        ]
    },
    {
        "type":"function",
        "name":"getAmountsOut",
        "inputs": [
            {"name":"amountIn","type":"uint256"},
            {"name":"path","type":"address[]"}
        ],
        "outputs": [
            {"name":"amounts","type":"uint256[]"}
        ]
    },
    {
        "type":"function",
        "name":"startBridgeTokensViaHopL1ERC20Min",
        "inputs": [
            {"name": "transactionId", "type": "bytes8"},
            {"name": "receiver", "type": "address"},
            {"name": "destinationChainId", "type": "uint256"},
            {"name": "sendingAssetId", "type": "uint256"},
            {"name": "minAmount", "type": "uint256"},
            {"name": "destinationAmountOutMin", "type": "uint256"},
            {"name": "relayer", "type": "address"},
            {"name": "relayerFee", "type": "uint256"},
            {"name": "hopBridge", "type": "address"},
        ]
    },
    {
        "type":"function",
        "name":"depositToLido",
        "inputs": [
            {"name": "maxFeeRate", "type": "uint256"}
        ]
    },
];