const { expect } = require("chai");

describe("UniswapV2Factory", function () {
  let factory;
  let deployer;
  let tokenA;
  let tokenB;
  let pairAddress;

  before(async function () {
    const Factory = await ethers.getContractFactory("UniswapV2Factory");
    const TokenA = await ethers.getContractFactory("CrvToken");
    const TokenB = await ethers.getContractFactory("WETH9");

    [deployer] = await ethers.getSigners();

    factory = await Factory.deploy(deployer.address);
    tokenA = await TokenA.deploy(deployer.address);
    tokenB = await TokenB.deploy();

    await factory.waitForDeployment();
    await tokenA.waitForDeployment();
    await tokenB.waitForDeployment();

    await factory.createPair(tokenA.target, tokenB.target);
    pairAddress = await factory.getPair(tokenA.target, tokenB.target);
  });

  it("should deploy the contracts correctly", async function () {
    expect(factory.address).to.not.equal(0);
    expect(tokenA.address).to.not.equal(0);
    expect(tokenB.address).to.not.equal(0);
  });

  it("should create a valid pair", async function () {
    expect(pairAddress).to.not.equal(0);
  });

  it("should set the feeTo address correctly", async function () {
    const feeToAddress = deployer.address; // 替换为实际的 feeTo 地址
    await factory.setFeeTo(feeToAddress);
    const storedFeeToAddress = await factory.feeTo();
    expect(storedFeeToAddress).to.equal(feeToAddress);
  });

  it("should set the feeToSetter address correctly", async function () {
    const feeToSetterAddress = deployer.address; // 替换为实际的 feeToSetter 地址
    await factory.setFeeToSetter(feeToSetterAddress);
    const storedFeeToSetterAddress = await factory.feeToSetter();
    expect(storedFeeToSetterAddress).to.equal(feeToSetterAddress);
  });
});