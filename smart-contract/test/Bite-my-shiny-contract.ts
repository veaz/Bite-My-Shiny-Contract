import { ethers } from "hardhat";
import hre from "hardhat";
import { expect } from "chai";


describe("BiteMyShinyContract", () => {

    it("should have a contract named 'BiteMyShinyContract'", async function () {
        const artifacts = await hre.artifacts.readArtifact("BiteMyShinyContract");
        expect(artifacts.contractName).to.equal("BiteMyShinyContract");
    });

    it("should deploy the BiteMyShinyContract contract successfully", async function () {
        // Get contract factory
        const BiteMyShinyContract = await ethers.getContractFactory("BiteMyShinyContract");
        
        // Deploy the contract
        const bender = await BiteMyShinyContract.deploy();
        await bender.waitForDeployment();
        
        // Verify the contract address exists
        const address = await bender.getAddress();
        expect(address).to.be.a("string");
        expect(address).to.match(/^0x[a-fA-F0-9]{40}$/);
    });

    it("should hash the message with tryToUnlock", async function () {                                                                                                                                                                                                                                                                    
        const BiteMyShinyContract = await ethers.getContractFactory("BiteMyShinyContract");                                                                                                                                                                                                                                               
        const bender = await BiteMyShinyContract.deploy();                                                                                                                                                                                                                                                                                
        await bender.waitForDeployment();                                                                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                                                                                                          
        // Llamar tryToUnlock con un mensaje (value = 0 porque currentCost es 0)                                                                                                                                                                                                                                                          
        const result = await bender.tryToUnlock.staticCall("hello bender", { value: 1}); 

        ///console.log("Hash result:", result);    
        // console.log("Hash result:", result.toString());                                                                                                                                                                                                                                                                                   
        // console.log("Hash hex:", "0x" + result.toString(16));                                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                                                                                                          
        expect(result).to.be.a("bigint");                           
        expect(result).to.be.greaterThan(0n);                                                                                                                                                                                                                                                                                             
    }); 
})