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
- Here we are providing liquidity for the entire range such as in the Uniswap V2.
- [Impersonator 1 with DAI](https://etherscan.io/address/0x16b34ce9a6a6f7fc2dd25ba59bf7308e7b38e186)
- [Impersonator 2 with WETH](https://etherscan.io/address/0x06920c9fc643de77b99cb7670a944ad31eaaa260) 
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

- https://docs.uniswap.org/sdk/guides/quick-start

## Uniswap Subgraph

- https://docs.uniswap.org/sdk/subgraph/subgraph-examples
- [Query Uniswap LP position data using subgraph](https://docs.uniswap.org/sdk/subgraph/subgraph-examples#position-data)

## Uniswap Docs

- https://docs.uniswap.org/protocol/guides/local-environment
- Note: The setup used here is for demonstration purposes. It must be improved with proper security checks for production use.

## References
- [Uniswap V3 Deep Dive](https://trapdoortech.medium.com/uniswap-deep-dive-into-v3-technical-white-paper-2fe2b5c90d2)
- [Uniswap V3 Math](https://atiselsts.github.io/pdfs/uniswap-v3-liquidity-math.pdf)
- [Uniswap V3 whitepaper](https://uniswap.org/whitepaper-v3.pdf)
- [Get a Uniswap V3 Pool Address for a Testnet](https://www.youtube.com/watch?v=gPCMxTKAvXk)
- https://github.com/Uniswap/v3-periphery/blob/main/contracts/NonfungiblePositionManager.sol
- https://ethereum.org/en/developers/tutorials/the-graph-fixing-web3-data-querying/
- Chainlink External Adapter in Typescript
- https://github.com/smartcontractkit/external-adapters-js/tree/develop/packages/examples/source

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

## Testing with MockDAI and UFO
- [Account 1 provides liquidity at price initialized at 1000 UFO per MockDAI](https://mumbai.polygonscan.com/tx/0xdfbfdfefcfd653eed93b240c7b602bf25a521e4fb22726d832ca93d3b111f7f4)
- [Bob swaps MockDAI for UFO](https://mumbai.polygonscan.com/tx/0x85cce4ce9946c28d8b2d801bf67621e37b39b591fef51424d883587524971883)