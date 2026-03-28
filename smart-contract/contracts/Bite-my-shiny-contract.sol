// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

contract BiteMyShinyContract {
	constructor() payable {}

    uint256 public currentCost = 1;
    mapping(address => uint256) public bets;
    mapping(address => bytes32) public commitedMessages;

    function bet(string calldata message) external payable {
        require(msg.value >= currentCost, "Not enough rBTC"); // You wanna pay more? Who am I to stop you, meatbag!

        if (bets[msg.sender] > 0) {
            require(block.number > bets[msg.sender] + 256, "Already have active bet");
            delete commitedMessages[msg.sender];
            currentCost = currentCost * 2;
        }

        bets[msg.sender] = block.number;
        commitedMessages[msg.sender] = keccak256(abi.encodePacked(message));
    }

    function claim() external {
        uint256 betBlock = bets[msg.sender];
        require(betBlock > 0, "You dont have a bet");
        require(block.number > betBlock, "Wait 1 block");
        require(block.number <= betBlock + 256, "Bet expired");

        delete bets[msg.sender];
        bytes32 message = commitedMessages[msg.sender];
        delete commitedMessages[msg.sender];

        uint256 result = uint256(keccak256(abi.encodePacked(msg.sender, message, blockhash(betBlock))));
        uint256 divisor = getDivisor();

        if (result % divisor == 0) {
            // Send all the money (?)
            (bool sent, ) = payable(msg.sender).call{value: address(this).balance}("");
            require(sent, "Failed to send");
            currentCost = 1;
        }
        else
            currentCost = currentCost * 2;
    }

    function getDivisor() internal view returns (uint256) {
        uint256 bal = address(this).balance;
        if (bal < 100)  return 5;       // 20%
        if (bal < 500) return 7;       // ~14%
        if (bal < 1000) return 10;     // 10%
        return 20;                      // 5%
    }
}
