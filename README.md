# linea-mainnet
A script for automating actions in Linea Mainnet network.        
Interacts with projects such as EchoDEX, SyncSwap, Horizon, IzumiSwap, SyncSwap, LineaSwap, Lineans, Galaxy.        

## Description
The script has functions such as:   
- Creating a domain name on Lineans     
- Swaps on different DEX in such pairs as ETH -> BUSD/BNB/MATIC/AVAX/IzumiUSD/WETH      
- Randomization of many swaps       
- Balance checker       

## Installation
Must have NodeJS version 18+, NPM 9+ installed

```
git clone https://github.com/d4rk4444/linea-mainnet.git
cd linea-mainnet
npm i
```

## Configuration
All required settings are in the .env file    

1. API Infura key   
2. API [Lineascan](https://lineascan.build/)    
3. Pause time between actions          
4. Pause time between wallets   
5. Main settings
    - Wallets are randomized
    - Gas price multiplication
    - Type Value for all functions (amount/procent)
    - Limit for Gas price on both networks
6. Bridge settings
    - Value for bridge (in % or ETH Depending on the Type Value)
7. DEX settings
    - Value for swap (in % or ETH Depending on the Type Value)
    - Slippage for swap (in %)  
    - List of DEXes that are used in random     
    - List of Tokens that are used in random    
8. Lineans settings for domen length    
      
Insert private Metamask addresses in the private.txt file in this format:    
```
key1
key2
```

## Usage
```
node index
```
or      
```
npm run start
```
