// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

contract BiteMyShinyContract {
	constructor() payable {}

    // uint256 public pepe;
    uint256 public currentCost = 1;

	function tryToUnlock(string calldata message) external payable returns (uint256){
        require(msg.value >= currentCost, "Not enough RBTC");

		uint256 result = uint256(keccak256(abi.encodePacked(message, blockhash(block.number - 1))));

        uint256 divisor = getDivisor();

        if (result % divisor == 0) {
            // Winner, send the pot
            payable(msg.sender).transfer(address(this).balance);
            return result;
        }
    
        currentCost = currentCost * 2;

        return result;
	}

    function getDivisor() internal view returns (uint256) {
        uint256 bal = address(this).balance;
        if (bal < 100)  return 5;       // 20%
        if (bal < 500) return 7;       // ~14%
        if (bal < 1000) return 10;     // 10%
        return 20;                      // 5%
    }

}
