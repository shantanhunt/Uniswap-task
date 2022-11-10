        // describe(`#swapExactInputSingle`, async function () {
        //     it(`Sending ETH to Impersonator1`, async function () {
        //         let tx = {
        //             to: this.signers.impersonator.address,
        //             value: ethers.utils.parseEther("10")
        //         };
                
        //         let result = await this.signers.alice.sendTransaction(tx);
        //         this.balance1 = await this.signers.impersonator.getBalance();
        //         const wethbalance = await this.WETHcontract.balanceOf(this.signers.impersonator.address);
        //         console.log("Impersonator balance: ", this.balance1);
        //         console.log("Impersonator WETH balance: ", wethbalance);

        //      });

        //      it(`Sending ETH to Impersonator2`, async function () {
        //         let tx2 = {
        //             to: this.signers.impersonator2.address,
        //             value: ethers.utils.parseEther("10")
        //         };
                
        //         let result = await this.signers.alice.sendTransaction(tx2);
        //         this.balance1 = await this.signers.impersonator2.getBalance();
        //         const wethbalance = await this.WETHcontract.balanceOf(this.signers.impersonator2.address);
        //         console.log("Impersonator balance: ", this.balance1);
        //         console.log("Impersonator WETH balance: ", wethbalance);

        //      });

        //      it(`Approve DAI for amountIn and then Swap`, async function () {
                
        //         // Approving the Swap Contract for 1 DAI
        //         const amountIn =  ethers.utils.parseEther("1");
        //         const funcTx = await this.DAIcontract.approve(this.lending.address, amountIn);

        //         // Swap 1 DAI for ETH 
        //         const amount = await this.lending.connect(this.signers.impersonator).swapExactInputSingle(amountIn);
        //         // console.log("Amount: ", amount); // This amount will be approx 1/1300 which is expected

        //         this.balance2 = await this.signers.impersonator.getBalance()
        //         console.log("Impersonator balance difference in ETH: ", (ethers.BigNumber.from(this.balance2)).sub(ethers.BigNumber.from(this.balance1)));
                
        //         const wethbalance = await this.WETHcontract.balanceOf(this.signers.impersonator.address);
        //         console.log("Impersonator balance: ", this.balance1);
        //         console.log("Impersonator WETH balance: ", wethbalance);
        //     });
        // });

        // // Impersonator1 will add liquidity of DAI and WETH
        // // Impersonator2 will make swaps from DAI/WETH, depositing DAI and withdrawing WETH
        // // Impersonator1 will experience impermanent loss
        // describe(`#depositLiquidity`, async function () {
        //     it(`Sending WETH to impersonator1 and Add liquidity`, async function () {
        //         const amount =  ethers.utils.parseEther("1000");
        //         const WETHbalance = await this.WETHcontract.balanceOf(this.signers.impersonator.address);
        //         console.log("WETH balance of Imp: ", WETHbalance);         

        //         const funcTx = await this.WETHcontract.connect(this.signers.impersonator2).transfer(this.signers.impersonator.address, amount);
        //         const WETHbalance2 = await this.WETHcontract.balanceOf(this.signers.impersonator.address);
        //         console.log("WETH balance2 of Imp: ", WETHbalance2); 
        //         const funcTx2 = await this.DAIcontract.connect(this.signers.impersonator).approve(this.pool.address, amount);
        //         const funcTx3 = await this.WETHcontract.connect(this.signers.impersonator).approve(this.pool.address, amount);
        //         const result = await this.pool.connect(this.signers.impersonator).mintNewPosition();
        //         // console.log(result);
        //      });

        //     //  it(`Get Token Id and Pool Id`, async function () {

        //     //  });

        // });