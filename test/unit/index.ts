import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { getSigners, unitLendingFixture } from "../shared/fixtures";
import { Signers } from "../shared/types";
import { ethers } from "hardhat";
import { expect } from "chai";
import DAI from "../../artifacts/contracts/DAI.sol/DAI.json";

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
        
        console.log("Impersonated Signer: ", this.signers.impersonator.address);

        // Importing DAI ABI to interact for DAI approvals
        const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
        this.DAIcontract = new ethers.Contract(DAIAddress, DAI.abi, this.signers.impersonator);
    });

    describe(`Swap1`, async () => {
        beforeEach(async function () {
            const { lending } = await loadFixture(unitLendingFixture);

            this.lending = lending;
            console.log("swap1: ", this.lending.address);
        });

        describe(`#swapExactInputSingle`, async function () {
            it(`Sending ETH to Impersonator`, async function () {
                let tx = {
                    to: this.signers.impersonator.address,
                    value: ethers.utils.parseEther("10")
                };
                let result = await this.signers.alice.sendTransaction(tx)
                // console.log("Result: ", result);
                const balance1 = await this.signers.impersonator.getBalance()
                console.log("Impersonator balance: ", balance1)
             });

             it(`Approve DAI for amountIn and then Swap`, async function () {
                // Approving the Swap Contract for 1 DAI
                const amountIn =  ethers.utils.parseEther("1");
                const funcTx = await this.DAIcontract.approve(this.lending.address, amountIn);
                await funcTx.wait();

                // Swap 1 DAI for ETH 
                const amount = await this.lending.connect(this.signers.impersonator).swapExactInputSingle(amountIn);
                console.log("Amount: ", amount);
                // This amount will be approx 1/1300 which is expected
             });
        });

        // describe(`#depositLiquidity`, async function () {
        //     it(`Sending ETH to Impersonator`, async function () {
                
        //      });

        // });
    });
});

// 778337639478148