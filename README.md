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
- MockDAI address on Mumbai: 0x4d582295afB968eA3b9492c5ec594b830D180E8d 
- I need to get the PoolId of the pool.
- I mostly need two things to calculate impermnent loss:
1) I need to track the liquidity present the pool each time swaps happen, so that I can calculate how much 
the LP will get when he will withdraw his tokens. 
2) Then I need to calculate what is the current price of both the tokens. Using that impermanent loss can be calculated.  
(This is because it will help to tell how much the tokens would have been worth if the LP would have simply held the tokens instead
of providing liquidity to the Uniswap Pair)
- UniswapPool contract has liquidity variable which gives its total liquidity.
Using NFT of a position, we can get the local liquidity of an LP. So if two LPs are present,
then the ratio of local liquidity to total liquidity may tell how much percent of tokens will each LP get back (need to test this and verify).
- Now if you know the percent of Liquidity provided by the LP. You now want how many tokens will he get if he withdraws now.
For that simply check the balance of the UniswapPool using the ERC20 token contracts. Then let's say the LP has 10 percent of the 
liquidity share. Then he will get back 10 percent of the total tokens that the UniswapPool holds.

## Additional
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

## Possible Errors
- While writing the return values of the function, if there are multiple return values then you only need to declare them once in the 
returns statement of the function and not inside the function. 

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

## Testing with MockDAI and SAND
- [Alice Added liquidity at price 1000 DAI per SAND](https://mumbai.polygonscan.com/tx/0x95ccc2b695cf34ea89b1ec52501d49fa345f377506360baca04c9c1a8d23a73e)
- [NFT with Minted for the position](https://mumbai.polygonscan.com/token/0xc36442b4a4522e871399cd717abdd847ab11fe88?a=6318#readProxyContract)
- Pool id for the tokens- 0x076c373a9aeb3E2F72f45339e9e11A4D37Dc7fEf
- [Bob provides some liquidity](https://mumbai.polygonscan.com/tx/0xa5a0cece0d115dae490dc574326c4a36de04d63404dbf0d021a2e8e6eeed8f92)
- [Bob added more liquidity](https://mumbai.polygonscan.com/tx/0x9a5296834e98747fde9fe3d94fafdbb1e9c720ddb0537e630ecd58516c0b6d2d)

## Alice before removing liquidity
-   Aliceliquidity: BigNumber { value: "4627199995519345936797" }
    Ratio:  BigNumber { value: "82" }
    PoolLiquidity:  BigNumber { value: "5575930413013974886531" }
## Alice after removing liquidity
-   Aliceliquidity: BigNumber { value: "0" }
    Ratio:  BigNumber { value: "0" }
    PoolLiquidity:  BigNumber { value: "948730417494628949734" }
-   Note: This remaining Pool liquidity is of Bob. 

## Liquidity Example contracts on Mumbai Testnet
1) 0x2A1bF12712f4D5b043761CAA8A06F5fA528f3328