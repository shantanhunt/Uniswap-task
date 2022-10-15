import { MockContract } from '@ethereum-waffle/mock-contract';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { SwapExample1 } from "../../typechain-types";

declare module "mocha" {
    export interface Context {
        signers: Signers;
        swap1: SwapExample1;
    }
}

export interface Signers {
    deployer: SignerWithAddress;
    alice: SignerWithAddress;
    bob: SignerWithAddress;
    impersonator: SignerWithAddress;
}

// export interface Mocks {
//     mockUsdc: MockContract;
// }