const { expect } = require("chai");

describe("StakingContract", function () {
  let stakingContract;
  let deployer;
  let crvToken;
  let veToken;


  before(async function () {

    [deployer] = await ethers.getSigners();
    
    const CrvToken = await ethers.getContractFactory("CrvToken");
    const VeToken = await ethers.getContractFactory("VeToken");

    
    crvToken = await CrvToken.deploy(deployer.address);
    veToken = await VeToken.deploy(deployer.address);

    
    await crvToken.waitForDeployment();
    await veToken.waitForDeployment();
    

    const StakingContract = await ethers.getContractFactory("StakingContract");

    stakingContract = await StakingContract.deploy(crvToken.target,veToken.target);

    await stakingContract.waitForDeployment();


    
    veToken.transfer(deployer.address, stakingContract.target,10000000 * 10 ** 18);

  });

  it("should deploy the contracts correctly", async function () {
    expect(stakingContract.address).to.not.equal(0);
    expect(crvToken.address).to.not.equal(0);
    expect(veToken.address).to.not.equal(0);
  });

  it("should stake CRV tokens", async function () {
    
    
    const amount = ethers.parseUnits("100", 18);

    await crvToken.connect(deployer).approve(stakingContract.address, {value: 100});
    await stakingContract.connect(deployer).stake({value: 100});

    // expect(await crvToken.balanceOf(deployer.address)).to.equal(0);
    expect(await veToken.balanceOf(deployer.address)).to.equal({value: 100});
    // expect(await stakingContract.getStakedAmount(deployer.address)).to.equal(amount);
  });
});
 