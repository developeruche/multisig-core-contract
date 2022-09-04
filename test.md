BANK CONTRACT

1. check if constructor worked properly
2. deposit erc 20 token (works,revert("Transfer failed))
3. transfer erc20 token (works,revert("sender can't be reciever"),revert("Insufficient fund"))
4. deposit ether function (success, revert(zero not allowed))
5. transfer (success, revert("Invalid address), )
6. getBalance()
7. getWalletBalance()
8. pause()
9. unpause()
10. recoverTrappedMoney



FACTORY CONTRACT
1. constructor(admin,implementation)
2. getImplementation(must be admin, success)
3. clone(success)
4. getWalletOwner(success)




CONSENSE WALLET (as base)
1. constructor(isBase)
2. submitTransaction(shuoldBeInit)
3. cannot init base modifier






CONSENSE WALLET (as proxy contract)
1. isBse = false
2. submitTransaction(success, onlyOwner)
3. confirmTransaction(success, txExist, notExcecuted, notConfirmed)
4. excecuteTransaction(success, ConsensusHasNotBeenRaised, )
5. revokeConfirmation(TransactionHasNotBeenSigned, success)
6. getOwners
7. getTransaction
8. getWalletBalance
9. initialize(cant init base)
10. Should not reach ether via normal transfer, because the contract is not meant to recieve ether.
4. initialize function (cantInitBase, OwnersCannotBeEmpty, InvalidNumberOfComfirmation, OwnersMustBeUnique, ContractAlreadyInitailized,
)


<!-- TODO -->

1. Add transaction name to the struct
2. create a deposit function that would transfer funds to the bank account