# Consense Multisig Core {}=>

## How to uses this project

This project consense wallet is a DAPP for carrying out multisig operation (Banking and Signing transaction) in consenus with a percentage of the qourom members. A frontend is developed to easy user experence. 

The contract was implemented using the * minimal proxy cloning pattern * . The contract compromises of;
1. Implementation contract (Holding all the multisig wallet functionalities)
2. Factory contract (deploys a clone of the implementation contract in a gas efficent manner (minimal proxy))
3. Bank contract (for handling finacial operations of the multisig wallet and can also be used by a normal EOA)


NOTE: Test script has been writen for this project, if you clone or fork the repo do well the run the test just to be sure



```shell
npx hardhat test
```


This project is built for the Ethonline hackathon september 2022 => wish me luck :)


built with love @developeruche
