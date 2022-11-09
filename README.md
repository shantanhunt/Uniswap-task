# How to deploy contracts (defaulted to Mainnet Fork)

In the first terminal run 

```shell
npx hardhat node
```

Open second terminal and run

```shell
npx hardhat test
```

## Strategy
- I need to get the PoolId of the pool.
- I mostly need two things to calculate impermnent loss:
1) I need to track the liquidity present the pool each time swaps happen, so that I can calculate how much 
the LP will get when he will withdraw his tokens. 
2) Then I need to calculate what is the current price of both the tokens. Using that impermanent loss can be calculated.  
(This is because it will help to tell how much the tokens would have been worth if the LP would have simply held the tokens instead
of providing liquidity to the Uniswap Pair)
- Maybe Chainlink External Adapter will be needed that queries the Uniswap subgraph and sends the necessary data to smart
contract.
- Maybe Uniswap SDK will do all the required stuff instead of an external adapter. 

## Uniswap SDK
- Note
- https://docs.uniswap.org/sdk/guides/quick-start

## Uniswap Docs

- https://docs.uniswap.org/protocol/guides/local-environment
- Note: The setup used here is for demonstration purposes. It must be improved with proper security checks for production use.

## References

- https://github.com/Uniswap/v3-periphery/blob/main/contracts/NonfungiblePositionManager.sol
- https://ethereum.org/en/developers/tutorials/the-graph-fixing-web3-data-querying/
- Chainlink External Adapter in Typescript
https://github.com/smartcontractkit/external-adapters-js/tree/develop/packages/examples/source

## Goal 

The goal is to

- Continuously monitor the impermanent loss incurred for a position in Uniswap V3
- If there is a loss, we need to exit the position
Monitoring a position
We can use the Uniswap V3's subgraph to know a position's details like tokens, price at the time of providing liquidity, etc. We will also know the current tick in the pool.

We can use the following Impermanent Loss Calculation.

When the loss crosses a threshold (like say 50%), we need to trigger the recovery process.

## Exiting a position

We need to deploy a simple smart contract that wraps around Uniswap V3's LP exiting function and trigger this function when the above monitoring logic is executed. The output of this should result in the wallet having the LP tokens back with the position fuly exited.