// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

/// @title BiteMyShinyContract
/// @notice A gambling game on RSK where players bet RBTC trying to win the treasury
/// @dev Uses a 2-step bet/claim pattern with future blockhash for secure randomness
contract BiteMyShinyContract {
	/// @notice Deploy the contract with initial treasury funding
	constructor() payable {}

	/// @notice Accepts direct RBTC donations to the treasury
	/// @custom:bender I always accept donations. Shut up and give me your money!
	receive() external payable {}

	/// @notice Current cost to place a bet, doubles after each loss, resets after a win
	uint256 public currentCost = 10000000000; // 1 sat

	/// @notice Maps player address to the block number of their active bet
	mapping(address => uint256) public bets;

	/// @notice Maps player address to the hash of their committed message
	mapping(address => bytes32) public commitedMessages;

	/// @notice Emitted when a player places a bet
	event BetPlaced(address indexed player, uint256 amount, string message);

	/// @notice Emitted when a player wins the prize
	event Win(address indexed winner, uint256 prize);

	/// @notice Emitted when a player loses their bet
	event Loss(address indexed player);

	/// @notice Place a bet by sending a message and paying the current cost
	/// @param message The message the player sends to Bender
	/// @dev Stores block.number and message hash. If player has an expired bet, it gets replaced and cost doubles.
	/// @custom:bender You wanna pay more? Who am I to stop you, meatbag!
	function bet(string calldata message) external payable {
		require(msg.value >= currentCost, "Not enough rBTC");

		if (bets[msg.sender] > 0) {
			require(
				block.number > bets[msg.sender] + 256,
				"Already have active bet"
			);
			delete commitedMessages[msg.sender];
			currentCost = currentCost * 2;
		}
		emit BetPlaced(msg.sender, msg.value, message);

		bets[msg.sender] = block.number;
		commitedMessages[msg.sender] = keccak256(abi.encodePacked(message));
	}

	/// @notice Claim the result of your bet after at least 1 block
	/// @dev Uses blockhash(betBlock) + msg.sender + message hash for randomness.
	///      Winner gets 90% of the treasury, 10% stays for the next round.
	///      Follows checks-effects-interactions pattern to prevent reentrancy.
	function claim() external {
		uint256 betBlock = bets[msg.sender];
		require(betBlock > 0, "You dont have a bet");
		require(block.number > betBlock, "Wait 1 block");
		require(block.number <= betBlock + 256, "Bet expired");

		delete bets[msg.sender];
		bytes32 message = commitedMessages[msg.sender];
		delete commitedMessages[msg.sender];

		uint256 result = uint256(
			keccak256(
				abi.encodePacked(msg.sender, message, blockhash(betBlock))
			)
		);
		uint256 divisor = getDivisor();

		if (result % divisor == 0) {
			uint256 prize = (address(this).balance * 90) / 100;
			emit Win(msg.sender, prize);
			(bool sent, ) = payable(msg.sender).call{ value: prize }("");
			require(sent, "Failed to send");
			currentCost = 10000000000; // 1 sat
		} else {
			emit Loss(msg.sender);
			if (currentCost < 0.01 ether) {
				currentCost = currentCost * 2;
			}
		}
	}

	/// @notice Calculates the divisor based on treasury size (higher treasury = harder to win)
	/// @dev The divisor determines win probability: result % divisor == 0 means win
	/// @return The divisor used for the win condition
	/// @custom:bender The more money I have, the harder it is to take it from me!
	function getDivisor() internal view returns (uint256) {
		uint256 bal = address(this).balance;
		if (bal < 0.001 ether) return 5; // 20%
		if (bal < 0.01 ether) return 7; // ~14%
		if (bal < 0.1 ether) return 10; // 10%
		return 20; // 5%
	}
}
