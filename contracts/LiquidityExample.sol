// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.7.6;
pragma abicoder v2;

import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-core/contracts/libraries/TickMath.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol";
import "@uniswap/v3-periphery/contracts/base/LiquidityManagement.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract LiquidityExample is IERC721Receiver {
    address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address public constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    // PoolId for Pool with fee 100 is 0xd8dec118e1215f02e10db846dcbbfe27d477ac19
    // 0.01% fee
    uint24 public constant poolFee = 100;

    INonfungiblePositionManager public nonfungiblePositionManager = 
        INonfungiblePositionManager(0xC36442b4a4522E871399CD717aBDD847Ab11FE88);

    IUniswapV3Pool public uniswapV3Pool = 
        IUniswapV3Pool(0x076c373a9aeb3E2F72f45339e9e11A4D37Dc7fEf);



    /// @notice Represents the deposit of an NFT
    struct Deposit {
        address owner;
        uint128 liquidity;
        address token0;
        address token1;
    }

    /// @dev deposits[tokenId] => Deposit
    mapping(uint => Deposit) public deposits;

    // Store token id used in this example
    uint public tokenId;

    mapping(address => uint) public myTokenId;

    // Implementing `onERC721Received` so this contract can receive custody of erc721 tokens
    function onERC721Received(
        address operator,
        address,
        uint _tokenId,
        bytes calldata
    ) external override returns (bytes4) {
        _createDeposit(operator, _tokenId);
        return this.onERC721Received.selector;
    }

    function _createDeposit(address owner, uint _tokenId) internal {
        (
            ,
            ,
            address token0,
            address token1,
            ,
            ,
            ,
            uint128 liquidity,
            ,
            ,
            ,

        ) = nonfungiblePositionManager.positions(_tokenId);
        // set the owner and data for position
        // operator is msg.sender
        deposits[_tokenId] = Deposit({
            owner: owner,
            liquidity: liquidity,
            token0: token0,
            token1: token1
        });

        tokenId = _tokenId;
        myTokenId[msg.sender] = tokenId;
    }

    function mintNewPosition()
        external
        returns (
            uint _tokenId,
            uint128 liquidity,
            uint amount0,
            uint amount1
        )
    {
        // For this example, we will provide equal amounts of liquidity in both assets.
        // Providing liquidity in both assets means liquidity will be earning fees and is considered in-range.
        uint amount0ToMint = 100 * 1e18;
        uint amount1ToMint = 100 * 1e18;

        // transfer tokens to contract
        TransferHelper.safeTransferFrom(DAI, msg.sender, address(this), amount0ToMint);
        TransferHelper.safeTransferFrom(WETH, msg.sender, address(this), amount1ToMint);

        // Approve the position manager
        TransferHelper.safeApprove(
            DAI,
            address(nonfungiblePositionManager),
            amount0ToMint
        );
        TransferHelper.safeApprove(
            WETH,
            address(nonfungiblePositionManager),
            amount1ToMint
        );

        INonfungiblePositionManager.MintParams
            memory params = INonfungiblePositionManager.MintParams({
                token0: DAI,
                token1: WETH,
                fee: poolFee,
                // By using TickMath.MIN_TICK and TickMath.MAX_TICK, 
                // we are providing liquidity across the whole range of the pool. 
                // Not recommended in production.
                tickLower: TickMath.MIN_TICK,
                tickUpper: TickMath.MAX_TICK,
                amount0Desired: amount0ToMint,
                amount1Desired: amount1ToMint,
                amount0Min: 0,
                amount1Min: 0,
                recipient: address(this),
                deadline: block.timestamp
            });

        // Note that the pool defined by DAI/WETH and fee tier 0.01% must 
        // already be created and initialized in order to mint
        (_tokenId, liquidity, amount0, amount1) = nonfungiblePositionManager
            .mint(params);
        console.log("--------------------------------------------------");            
        console.log("Token Id: ", _tokenId);
        console.log("liquidity :", liquidity);
        console.log("amount 0: ", amount0);
        console.log("amount 1: ", amount1);
        console.log("--------------------------------------------------");            

        // Create a deposit
        _createDeposit(msg.sender, _tokenId);

        // Remove allowance and refund in both assets.
        if (amount0 < amount0ToMint) {
            TransferHelper.safeApprove(
                DAI,
                address(nonfungiblePositionManager),
                0
            );
            uint refund0 = amount0ToMint - amount0;
            TransferHelper.safeTransfer(DAI, msg.sender, refund0);
        }

        if (amount1 < amount1ToMint) {
            TransferHelper.safeApprove(
                WETH,
                address(nonfungiblePositionManager),
                0
            );
            uint refund1 = amount1ToMint - amount1;
            TransferHelper.safeTransfer(WETH, msg.sender, refund1);
        }
    }

    function collectAllFees() external returns (uint256 amount0, uint256 amount1) {
        // set amount0Max and amount1Max to uint256.max to collect all fees
        // alternatively can set recipient to msg.sender and avoid another transaction in `sendToOwner`
        INonfungiblePositionManager.CollectParams memory params =
            INonfungiblePositionManager.CollectParams({
                tokenId: tokenId,
                recipient: address(this),
                amount0Max: type(uint128).max,
                amount1Max: type(uint128).max
            });

        (amount0, amount1) = nonfungiblePositionManager.collect(params);

        console.log("fee 0", amount0);
        console.log("fee 1", amount1);
    }

    function increaseLiquidityCurrentRange(
        uint256 amountAdd0,
        uint256 amountAdd1
    )
        external
        returns (
            uint128 liquidity,
            uint256 amount0,
            uint256 amount1
        )
    {
        TransferHelper.safeTransferFrom(DAI, msg.sender, address(this), amountAdd0);
        TransferHelper.safeTransferFrom(WETH, msg.sender, address(this), amountAdd1);

        TransferHelper.safeApprove(DAI, address(nonfungiblePositionManager), amountAdd0);
        TransferHelper.safeApprove(WETH, address(nonfungiblePositionManager), amountAdd1);

        INonfungiblePositionManager.IncreaseLiquidityParams memory params =
            INonfungiblePositionManager.IncreaseLiquidityParams({
                tokenId: tokenId,
                amount0Desired: amountAdd0,
                amount1Desired: amountAdd1,
                amount0Min: 0,
                amount1Min: 0,
                deadline: block.timestamp
            });

        (liquidity, amount0, amount1) = nonfungiblePositionManager.increaseLiquidity(params);

        console.log("liquidity", liquidity);
        console.log("amount 0", amount0);
        console.log("amount 1", amount1);
    }

    function exitPosition(uint256 _tokenId) external returns (uint amount0, uint amount1) {
        require(msg.sender == deposits[_tokenId].owner, 'Not the owner');
        uint128 _liquidity = deposits[_tokenId].liquidity;
        INonfungiblePositionManager.DecreaseLiquidityParams memory params =
            INonfungiblePositionManager.DecreaseLiquidityParams({
                tokenId: tokenId,
                liquidity: _liquidity,
                amount0Min: 0,
                amount1Min: 0,
                deadline: block.timestamp
            });

        (amount0, amount1) = nonfungiblePositionManager.decreaseLiquidity(params);

        console.log("amount 0", amount0);
        console.log("amount 1", amount1);
    }

    function getLiquidityAndTokensAddress(uint _tokenId) public view returns(address token0, address token1, uint128 liquidity) {
        (
            ,
            ,
            token0,
            token1,
            ,
            ,
            ,
            liquidity,
            ,
            ,
            ,

        ) = nonfungiblePositionManager.positions(_tokenId);
    }
 
    function calculateRatioOfLPShare (uint256 _tokenId) public view returns(uint128) {
        uint128 liquidity = getLiquidity(_tokenId);
        uint128 TotalPoolLiquidity = getPoolLiquidity();
        uint128 ratioOfLPShare = (liquidity * 10000) / (TotalPoolLiquidity) ; // Here 8297 Means 82.97% And 10000 is bcoz it was in decimal
        return ratioOfLPShare;
}

    function calculateWithdrawableTokens(uint256 _tokenId) public view returns (uint256 amount0, uint256 amount11){
        uint256 ratio = calculateRatioOfLPShare(_tokenId);
        address _token0 = uniswapV3Pool.token0();
        address _token1 = uniswapV3Pool.token1();
        uint256 balance0 = getPoolTokenBalance(_token0);
        uint256 balance1 = getPoolTokenBalance(_token1);
        amount0 = (ratio * balance0 ) / 10000;
        amount11 = (ratio * balance1 ) / 10000;
    }

    function getLiquidity(uint _tokenId) public view returns (uint128) {
        (
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            uint128 liquidity,
            ,
            ,
            ,

        ) = nonfungiblePositionManager.positions(_tokenId);
        return liquidity;
    }

    function getPoolLiquidity() public view returns (uint128) {
        uint128 liq;
        liq = uniswapV3Pool.liquidity();
        return liq;
    }

    function getPoolTokenBalance(address _tokenAdd) public view returns(uint256) {
        IERC20 token = IERC20(_tokenAdd);
        uint256 tokenBalance = token.balanceOf(address(uniswapV3Pool));
        return tokenBalance;
    }

    function getGlobalPriceOfToken0() public pure returns(uint256) {
        return 1; // For DAI it is $1
    }

    function getGlobalPriceOfToken1() public pure returns(uint256) {
        return 800; // Assuming SAND value drops to 800
    }

    // Assuming stablecoin DAI's value is same same $1 during addLiquidity event
    function getInitialPriceOfToken0() public pure returns(uint256){
        return 1;
    }

    // Assume initial price for the token SAND was $1500 
    // This was also set during initialization of Uni-V3 pool of MockDAI-SAND 
    function getInitialPriceOfToken1() public pure returns(uint256){
        return 1500;
    }

    // Calulating the value of both tokens in terms of dollar
    function calculateCurrentValue(uint256 _tokenId) public view returns(uint256){
        uint256 amount0;
        uint256 amount1;
        (amount0, amount1) = calculateWithdrawableTokens(_tokenId);
        uint256 totalValue = amount0*getGlobalPriceOfToken0() + amount1*getGlobalPriceOfToken1();
        return totalValue;
    }
}

