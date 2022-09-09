// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";



interface IBank {
    function deposit() external payable;
}




/// @title A title that should describe the contract/interface
/// @author developeruche
contract MultiSigWallet is Initializable {


    // CUSTOM ERRORS


    /// Wallet has not been Intialized
    error HasNotBeenInitialized();

    /// A base wallet contract cannot call Initalize
    error CannotCallInitalized();

    /// Invalid Number Of Comfirmation
    error InvalidNumberOfComfirmation();

    /// Owners Cannot Be Empty
    error OwnersCannotBeEmpty();

    /// Invalid Owner Address
    error InvalidOwnerAddress();

    /// Owners must be unique
    error OwnersMustBeUnique();

    /// Contract Already Initialized 
    error ContractAlreadyInitailized();

    /// You are not a owner in this wallet
    error NotPartOfOwners();

    /// Transaction Does not exist
    error TransactionDoesNotExist();

    /// Transaction has been excecuted
    error TransactionHasBeenExcecuted();

    /// You have already confirmed this transaction
    error YouHaveAlreadyConfirmedThisTransaction();

    /// Invalid amount of ether was passed to the function
    error InvalidAmountOfEther();

    /// Cannot perform this transaction consensus has not been raised
    error ConsensusHasNotBeenRaised(); 

    /// Oops... Transaction failed
    error TransactionFailed();

    /// Transaction has not been signed
    error TransactionHasNotBeenSigned();





    // EVENTS



    /// @dev this event would be logged when a deposit is  made
    event Deposit(address indexed sender, uint256 amount);
    /// @dev this event would be logged when a transaction is submitted by any of the owner
    event SubmitTransaction(
        address indexed owner,
        uint256 indexed txIndex,
        address indexed to,
        uint256 value,
        bytes data,
        string topic
    );
    /// @dev this event would be logged when a tranaction is confirmed
    event ConfirmTransaction(address indexed owner, uint256 indexed txIndex);
    /// @dev this event would be logged when a transaction is terminated
    event RevokeConfirmation(address indexed owner, uint256 indexed txIndex);
    /// @dev this would be logged when a transaction is finally excuted
    event ExecuteTransaction(address indexed owner, uint256 indexed txIndex, bytes data);


    //STATE VARIABLES



    /// @dev this is the nubmer of comfirmations need before a transaction would go through
    uint256 public numConfirmationsRequired;    
    bool public isBase;
    bool private isInitialized;
    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        bool executed;
        uint256 numConfirmations;
        string topic;
    }

    /// @dev this array hold the list of owner in this contract
    address[] public owners;
    /// @dev this mapping would be used to see if an address is part of the user (i am using a mapping because it is EFFICENT)
    mapping(address => bool) public isOwner;

    // mapping from tx index => owner => bool
    mapping(uint256 => mapping(address => bool)) public isConfirmed;
    /// @dev storing all the transaction in an array
    Transaction[] public transactions;
    /// @dev this variable holds the contract address of the bank contract used to manage funds
    address bank;


    // MODIFERS


    modifier onlyOwner() {
        if(!isOwner[msg.sender]){
            revert NotPartOfOwners();
        }
        _;
    }

    modifier txExists(uint256 _txIndex) {
        if(_txIndex >= transactions.length){
            revert TransactionDoesNotExist();
        }
        _;
    }

    modifier notExecuted(uint256 _txIndex) {
        if(transactions[_txIndex].executed) {
            revert TransactionHasBeenExcecuted();
        }
        _;
    }

    modifier notConfirmed(uint256 _txIndex) {
        if(isConfirmed[_txIndex][msg.sender]) {
            revert YouHaveAlreadyConfirmedThisTransaction();
        }
        _;
    }

    modifier shouldBeInit() {
        if(!isInitialized) {
            revert HasNotBeenInitialized();
        }
        _;
    }

    modifier cantInitBase() {
        if(isBase) {
            revert CannotCallInitalized();
        }
        _;
    }



    // CONSTRUCTOR

    constructor() {
        isBase = true;
    }



    /// @dev this function would push new transactions to the transactons array 
    /// @param _to: this is the address that the low level call would be sent to
    /// @param _value: this is the amount of ether that would be passed to the low level transaction call when the transaction have been excecuted
    /// @param _data: this is the low level representation of the transaction which would be passed to the .call method to the _to address
    function submitTransaction (
        address _to,
        uint256 _value,
        bytes memory _data, // this would be a function signature
        string memory _topic
    ) shouldBeInit public payable onlyOwner {

        uint256 txIndex = transactions.length;

        if(msg.value != _value) {
            revert InvalidAmountOfEther();
        }

        transactions.push(
            Transaction({
                to: _to,
                value: _value,
                data: _data,
                executed: false,
                numConfirmations: 0,
                topic: _topic
            })
        );

        emit SubmitTransaction(msg.sender, txIndex, _to, _value, _data, _topic);
    }

    /// @dev using this function, a user can consent to a transaction that has been submited
    /// @param _txIndex: this is the transaction index
    function confirmTransaction(uint256 _txIndex)
        public
        shouldBeInit
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
        notConfirmed(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];
        transaction.numConfirmations += 1;
        isConfirmed[_txIndex][msg.sender] = true;

        emit ConfirmTransaction(msg.sender, _txIndex);
    }

    /// @dev here the transaction would be excuted
    /// @notice the transaction can only be excecuted is the number of quorum is satified!!
    /// @param _txIndex: this is the index of the transaction that is to be excecuted
    function executeTransaction(uint256 _txIndex)
        public
        payable
        shouldBeInit
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
        returns (bytes memory)
    {
        Transaction storage transaction = transactions[_txIndex];


        if(transaction.numConfirmations < numConfirmationsRequired) {
            revert ConsensusHasNotBeenRaised();
        }


        transaction.executed = true;

        (bool success, bytes memory data) = transaction.to.call{value: transaction.value}(
            transaction.data
        );

        if(!success) {
            revert TransactionFailed();
        }
        

        emit ExecuteTransaction(msg.sender, _txIndex, data);

        return data;
    }

    /// @dev using this function, the user can cancel the revoke his/her vote given to a transaction
    /// @param _txIndex: this is the index of the tranaction to be revoked
    function revokeConfirmation(uint256 _txIndex)
        public
        shouldBeInit
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {

        if(!isConfirmed[_txIndex][msg.sender]) {
            revert TransactionHasNotBeenSigned();
        }

        Transaction storage transaction = transactions[_txIndex];        

        transaction.numConfirmations -= 1;
        isConfirmed[_txIndex][msg.sender] = false;

        emit RevokeConfirmation(msg.sender, _txIndex);
    }

    /// @dev this is a function to return all the owners in a wallet quorum
    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    /// @dev obtaining the length of the transactions of the wallet
    function getTransactionCount() public view shouldBeInit returns (uint256) {
        return transactions.length;
    }

    /// @dev this function would return a transaction on input of the transaction id
    /// @param _txIndex: this is the id of the transaction to be returned
    function getTransaction(uint256 _txIndex)
        public
        view
        returns (
            address to,
            uint256 value,
            bytes memory data,
            bool executed,
            uint256 numConfirmations
        )
    {
        Transaction storage transaction = transactions[_txIndex];

        return (
            transaction.to,
            transaction.value,
            transaction.data,
            transaction.executed,
            transaction.numConfirmations
        );
    }


    /// @dev this function is meant for owners to qurey the balance of the contract
    function getWalletBalance()
        public
        view
        returns (
            uint256
        )
    {
        return address(this).balance;
    }


    /// @dev this function would return all the transaction
    function returnTransaction() 
        public
        view  
        returns (
            Transaction[] memory
        ) {
            return transactions;
        }

    /// @dev this is acting as the constructor (because this contract is implemented using the EIP-1167) (this function can only run once and it must be on deployment)
    function initialize(address[] memory _owners, uint256 _numConfirmationsRequired, address _bank) 
        public 
        cantInitBase 
    {

        // the input owner must be more than zero
        if (_owners.length <= 0) {
            revert OwnersCannotBeEmpty();
        }

        // require the number of comfirmation is not greater than the number of owners
        if(_numConfirmationsRequired < 0 || _numConfirmationsRequired >= _owners.length) {
            revert InvalidNumberOfComfirmation();
        }

        
        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];


            if(owner == address(0)) {
                revert InvalidOwnerAddress();
            }

            if(isOwner[owner]) {
                revert OwnersMustBeUnique();
            }

            isOwner[owner] = true;
            owners.push(owner);
        }

        if(isInitialized) {
            revert ContractAlreadyInitailized();
        }

        numConfirmationsRequired = _numConfirmationsRequired;

        bank = _bank;

        isInitialized = true;
    }

        /// @dev I am creating a function that would enable the contract recieve ether: Note: because this function is not supposed to recieve ether when funds is transfered to this contract, it would be redirected to the bank contract where anything related to money would be done 
    receive() external payable {
      // sending the funds to the bank contract
      IBank(bank).deposit{value: msg.value}();
    }
}
// ["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4","0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db","0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"]