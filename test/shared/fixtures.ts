import { ContractFactory, Wallet } from "ethers";
import { ethers } from "hardhat";
import { SwapExample1 } from "../../typechain-types";
import { LiquidityExample } from "../../typechain-types";
import { Signers } from './types';

type UnitLendingFixtureType = {
    lending: SwapExample1;
    pool: LiquidityExample;
};

export async function getSigners(): Promise<Signers> {
    const [deployer, alice, bob, impersonator, impersonator2, impersonator3] = await ethers.getSigners();

    return { deployer, alice, bob, impersonator, impersonator2, impersonator3 };
}

export async function unitLendingFixture(): Promise<UnitLendingFixtureType> {
    const { deployer } = await getSigners();

    // Deploy SwapExample1
    const lendingFactory: ContractFactory = await ethers.getContractFactory(
        `SwapExample1`
    );

    const lending: SwapExample1 = (await lendingFactory
        .connect(deployer)
        .deploy("0xE592427A0AEce92De3Edee1F18E0157C05861564")) as SwapExample1;

    await lending.deployed();

    // Deploy LiquidityExample
    const poolFactory: ContractFactory = await ethers.getContractFactory(
        `LiquidityExample`
    );

    const pool: LiquidityExample = (await poolFactory
        .connect(deployer)
        .deploy()) as LiquidityExample;

    await pool.deployed();

    return { lending, pool };
};