import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { getSigners, unitLendingFixture } from "../shared/fixtures";
import { Signers } from "../shared/types";
import { ethers } from "hardhat";
import { expect } from "chai";
import DAI from "../../artifacts/contracts/DAI.sol/DAI.json";
import WETH9 from "../../artifacts/contracts/WETH.sol/WETH9.json";
import FiatTokenProxy from "../../artifacts/contracts/USDC.sol/FiatTokenProxy.json";

describe(`Unit tests`, async () => {
    before(async function () {
        const { deployer, alice, bob } = await loadFixture(getSigners);

        this.signers = {} as Signers;
        this.signers.deployer = deployer;
        this.signers.alice = alice;
        this.signers.bob = bob;

        // Impersonating account from mainnet with DAI holding
        const helpers = require("@nomicfoundation/hardhat-network-helpers");
        const address = "0x5d38b4e4783e34e2301a2a36c39a03c45798c4dd";
        await helpers.impersonateAccount(address);
        const impersonatedSigner = await ethers.getSigner(address);
        this.signers.impersonator = impersonatedSigner;
        console.log("Impersonated Signer with DAI: ", this.signers.impersonator.address);

        // Impersonating account from mainnet with WETH
        const address2 = "0x06920c9fc643de77b99cb7670a944ad31eaaa260";
        await helpers.impersonateAccount(address2);
        const impersonatedSigner2 = await ethers.getSigner(address2);
        this.signers.impersonator2 = impersonatedSigner2;
        console.log("Impersonated Signer with WETH: ", this.signers.impersonator2.address);

        // Impersonating account from mainnet with WETH
        const address3 = "0x19d675bbb76946785249a3ad8a805260e9420cb8";
        await helpers.impersonateAccount(address3);
        const impersonatedSigner3 = await ethers.getSigner(address3);
        this.signers.impersonator3 = impersonatedSigner3;
        console.log("Impersonated Signer with WETH: ", this.signers.impersonator3.address);

        // Importing DAI ABI to interact for DAI approvals
        const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
        this.DAIcontract = new ethers.Contract(DAIAddress, DAI.abi, this.signers.impersonator);
        
        // Importing WETH ABI to check WETH balances
        const WETHAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
        this.WETHcontract = new ethers.Contract(WETHAddress, WETH9.abi, this.signers.impersonator);

        // Importing USDC ABI to check USDC balances
        // const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
        // this.USDCcontract = new ethers.Contract(USDCAddress, FiatTokenProxy.abi, this.signers.impersonator);

        // Impersonate USDC Whale 
        const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
        const USDC_WHALE = "0x2FAF487A4414Fe77e2327F0bf4AE2a264a776AD2"
        this.usdc = await ethers.getContractAt("IERC20", USDC)
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [USDC_WHALE],
          })
        
        const usdcWhale = await ethers.getSigner(USDC_WHALE);
        const amt = await this.usdc.balanceOf(usdcWhale.address);
        console.log("USDC Amt: ", amt);

        // Send USDC to DAI Impersonator 
        this.usdc.connect(usdcWhale).transfer(this.signers.impersonator.address, 1000*10**18);
        // const usdcbalance = await this.usdc.balanceOf(this.signers.impersonator.address);
        // console.log("USDC First Impersonator: ", usdcbalance);

    });

    describe(`Swap1`, async () => {
        beforeEach(async function () {
            const { lending, pool } = await loadFixture(unitLendingFixture);

            this.lending = lending;
            this.pool = pool;
            console.log("swap1: ", this.lending.address);
            console.log("pool: ", this.pool.address);
        });

        describe(`#swapExactInputSingle`, async function () {
            it(`Sending ETH to Impersonator1`, async function () {
                let tx = {
                    to: this.signers.impersonator.address,
                    value: ethers.utils.parseEther("10")
                };
                
                let result = await this.signers.alice.sendTransaction(tx);
                this.balance1 = await this.signers.impersonator.getBalance();
                const wethbalance = await this.WETHcontract.balanceOf(this.signers.impersonator.address);
                console.log("Impersonator balance: ", this.balance1);
                console.log("Impersonator WETH balance: ", wethbalance);

             });

             it(`Sending ETH to Impersonator2`, async function () {
                let tx2 = {
                    to: this.signers.impersonator2.address,
                    value: ethers.utils.parseEther("10")
                };
                
                let result = await this.signers.alice.sendTransaction(tx2);
                this.balance1 = await this.signers.impersonator2.getBalance();
                const wethbalance = await this.WETHcontract.balanceOf(this.signers.impersonator2.address);
                console.log("Impersonator balance: ", this.balance1);
                console.log("Impersonator WETH balance: ", wethbalance);

             });

             it(`Approve DAI for amountIn and then Swap`, async function () {
                
                // Approving the Swap Contract for 1 DAI
                const amountIn =  ethers.utils.parseEther("1");
                const funcTx = await this.DAIcontract.approve(this.lending.address, amountIn);

                // Swap 1 DAI for ETH 
                const amount = await this.lending.connect(this.signers.impersonator).swapExactInputSingle(amountIn);
                // console.log("Amount: ", amount); // This amount will be approx 1/1300 which is expected

                this.balance2 = await this.signers.impersonator.getBalance()
                console.log("Impersonator balance difference in ETH: ", (ethers.BigNumber.from(this.balance2)).sub(ethers.BigNumber.from(this.balance1)));
                
                const wethbalance = await this.WETHcontract.balanceOf(this.signers.impersonator.address);
                console.log("Impersonator balance: ", this.balance1);
                console.log("Impersonator WETH balance: ", wethbalance);
            });
        });

        // Impersonator1 will add liquidity of DAI and WETH
        // Impersonator2 will make swaps from DAI/WETH, depositing DAI and withdrawing WETH
        // Impersonator1 will experience impermanent loss
        describe(`#depositLiquidity`, async function () {
            it(`Sending WETH to impersonator1 and Add liquidity`, async function () {
                const amount =  ethers.utils.parseEther("1000");
                const WETHbalance = await this.WETHcontract.balanceOf(this.signers.impersonator.address);
                console.log("WETH balance of Imp: ", WETHbalance);         

                const funcTx = await this.WETHcontract.connect(this.signers.impersonator2).transfer(this.signers.impersonator.address, amount);
                const WETHbalance2 = await this.WETHcontract.balanceOf(this.signers.impersonator.address);
                console.log("WETH balance2 of Imp: ", WETHbalance2); 
                const funcTx2 = await this.DAIcontract.connect(this.signers.impersonator).approve(this.pool.address, amount);
                const funcTx3 = await this.WETHcontract.connect(this.signers.impersonator).approve(this.pool.address, amount);
                const result = await this.pool.connect(this.signers.impersonator).mintNewPosition();
                // console.log(result);
             });

            //  it(`Get Token Id and Pool Id`, async function () {

            //  });

        });
    });
});

// 778337639478148
// -10015300720000000000
// -10015297760000000000
// 9989998320000000000000

        // console.log(" tokenId: ", tokenId);
        // console.log("liquidity: ", liquidity); 
        // console.log("amount0: ", amount0);
        // console.log("amount1: ", amount1);
