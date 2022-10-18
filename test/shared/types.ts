import { MockContract } from '@ethereum-waffle/mock-contract';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { SwapExample1 } from "../../typechain-types";

declare module "mocha" {
    export interface Context {
        signers: Signers;
        swap1: SwapExample1;
        pool: LiquidityExample;
    }
}

export interface Signers {
    deployer: SignerWithAddress;
    alice: SignerWithAddress;
    bob: SignerWithAddress;
    impersonator: SignerWithAddress;
    impersonator2: SignerWithAddress;
    impersonator3: SignerWithAddress;

}

// export interface Mocks {
//     mockUsdc: MockContract;
// }