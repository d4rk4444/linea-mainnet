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
    }
];