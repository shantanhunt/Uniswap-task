import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { getSigners, unitLendingFixture } from "../shared/fixtures";
import { Signers } from "../shared/types";
import { shouldDeposit } from "./Lending/LendingShouldDeposit.spec";
import { ethers } from "hardhat";
import { expect } from "chai";

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
    });

    describe(`Swap1`, async () => {
        beforeEach(async function () {
            const { lending } = await loadFixture(unitLendingFixture);

            this.lending = lending;
            console.log("swap1: ", this.lending.address);

        });

        // shouldDeposit();
        describe(`#swapExactInputSingle`, async function () {
            it(`swap should happen`, async function () {
    
                let tx = {
                    to: this.signers.impersonator.address,
                    // Convert currency unit from ether to wei
                    value: ethers.utils.parseEther("10")
                };
                let result = await this.signers.alice.sendTransaction(tx)
                console.log("Result: ", result);
                // const amount = await this.lending.connect(this.signers.impersonator).swapExactInputSingle(1000000000000);
                // console.log("Amount: ", amount);
                const balance1 = await this.signers.impersonator.getBalance()
                console.log("Impersonator balance: ", balance1)
             });
        });
    });
});