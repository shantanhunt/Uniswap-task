// import { MockContract } from '@ethereum-waffle/mock-contract';
import { ContractFactory, Wallet } from "ethers";
import { ethers } from "hardhat";
import { SwapExample1 } from "../../typechain-types";
// import { deployMockUsdc } from "./mocks";
import { Signers } from './types';

type UnitLendingFixtureType = {
    lending: SwapExample1;
};

export async function getSigners(): Promise<Signers> {
    const [deployer, alice, bob, impersonator] = await ethers.getSigners();

    return { deployer, alice, bob, impersonator };
}

export async function unitLendingFixture(): Promise<UnitLendingFixtureType> {
    const { deployer } = await getSigners();

    const lendingFactory: ContractFactory = await ethers.getContractFactory(
        `SwapExample1`
    );

    const lending: SwapExample1 = (await lendingFactory
        .connect(deployer)
        .deploy("0xE592427A0AEce92De3Edee1F18E0157C05861564")) as SwapExample1;

    await lending.deployed();

    return {lending};
};