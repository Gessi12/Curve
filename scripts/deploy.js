const { ethers } = require("hardhat");

async function main() {
  // 部署者账户
  const [deployer] = await ethers.getSigners();

  console.log("部署合约使用账户：", deployer.address);

  //部署USDT合约
  const TetherToken = await ethers.getContractFactory("TetherToken");

  const tetherToken = await TetherToken.deploy(deployer.address);

  await tetherToken.waitForDeployment();

  console.log("USDT 合约已成功部署，地址：", tetherToken.target);



  // 部署 CrvToken 合约
  const CrvToken = await ethers.getContractFactory("CrvToken");
  const crvToken = await CrvToken.deploy(deployer.address);

  //部署 VeToken 合约
  const VeToken = await ethers.getContractFactory("VeToken");
  const veToken = await VeToken.deploy(deployer.address);

  //部署 WETH10 合约
  const Weth = await ethers.getContractFactory("WETH9");
  const weth = await Weth.deploy();

  // 等待合约部署完成
  await crvToken.waitForDeployment();
  await veToken.waitForDeployment();
  await weth.waitForDeployment();

  console.log("CrvToken 合约已成功部署，地址：", crvToken.target);
  console.log("VeToken 合约已成功部署，地址：", veToken.target);
  console.log("WETH 合约已成功部署，地址：", weth.target)

  //部署 Stake- crv-weth 合约
  const Stake1 = await ethers.getContractFactory("StakingContract");
  const stake1 = await Stake1.deploy(
    crvToken.target,
    "5"
  );
  //等待stake合约部署完成
  await stake1.waitForDeployment();

  //stake合约地址
  console.log("Stake-- crv-weth 合约已成功部署，地址：", stake1.target);

  //部署USDT-CRV Stake合约
  const Stake2 = await ethers.getContractFactory("USDTStakingContract");
  const stake2 = await Stake2.deploy(
    tetherToken.target,
    crvToken.target,
    "5"
  );
  //等待stake合约部署完成
  await stake2.waitForDeployment();

  //stake合约地址
  console.log("Stake-- crv-USDT 合约已成功部署，地址：", stake2.target);


  // //部署UniswapV2Factory合约
  // const UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory");
  // const uniswapV2Factory = await UniswapV2Factory.deploy(deployer.address);

  // //等待UniswapV2Factory合约部署完成
  // await uniswapV2Factory.waitForDeployment();
  

  // //UniswapV2Factory合约地址
  // console.log("UniswapFactory 合约已成功部署，地址：", uniswapV2Factory.target);

  // //生成交易对
  // const tokenA = crvToken.target; // 替换为实际的 ERC20 Token A 地址
  // const tokenB = veToken.target; // 替换为实际的 ERC20 Token B 地址

  // console.log("创建 Pair...");

  // await uniswapV2Factory.createPair(tokenA, tokenB);

  // const pairAddress = await uniswapV2Factory.getPair(tokenA, tokenB);

  // console.log("Pair 创建完成！交易对地址：", pairAddress);

  // //部署UniSwapV2Router02合约
  // const UniswapV2Router01 = await ethers.getContractFactory("UniswapV2Router01");
  // const uniswapV2Router01 = await UniswapV2Router01.deploy(uniswapV2Factory.target, weth.target);

  // //等待UniswapV2Factory合约部署完成
  // await uniswapV2Router01.waitForDeployment();

  // //UniswapV2Factory合约地址
  // console.log("uniswapV2Router01 合约已成功部署，地址：", uniswapV2Router01.target);



}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });