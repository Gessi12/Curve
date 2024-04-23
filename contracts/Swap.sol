
library Math {
    function min(uint x, uint y) internal pure returns (uint z) {
        z = x < y ? x : y;
    }

    // babylonian method (https://en.wikipedia.org/wiki/Methods_of_computing_square_roots#Babylonian_method)
    function sqrt(uint y) internal pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
}

library UQ112x112 {
    uint224 constant Q112 = 2**112;

    // encode a uint112 as a UQ112x112
    function encode(uint112 y) internal pure returns (uint224 z) {
        z = uint224(y) * Q112; // never overflows
    }

    // divide a UQ112x112 by a uint112, returning a UQ112x112
    function uqdiv(uint224 x, uint112 y) internal pure returns (uint224 z) {
        z = x / uint224(y);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";


contract CrvVePair  {
    using SafeERC20 for IERC20;

    IERC20 public crvToken;
    IERC20 public veToken;

    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    uint256 private reserve0;           // uses single storage slot, accessible via getReserves
    uint256 private reserve1;           // uses single storage slot, accessible via getReserves
    uint32  private blockTimestampLast; // uses single storage slot, accessible via getReserves

    uint public price0CumulativeLast;
    uint public price1CumulativeLast;
    uint public kLast; // reserve0 * reserve1, as of immediately after the most recent liquidity event


    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event AddLiquidity(address indexed provider, uint256 amountCrv, uint256 amountVe, uint256 liquidity);
    event RemoveLiquidity(address indexed provider, uint256 amountCrv, uint256 amountVe, uint256 liquidity);
    event Swap(address indexed user, uint256 amountIn, uint256 amountOut);
    event Sync(uint256 reserve0, uint256 reserve1);

    constructor(address _crvToken, address _veToken) {
        crvToken = IERC20(_crvToken);
        veToken = IERC20(_veToken);
    }

    function getReserves() public view returns (uint256 _reserve0, uint256 _reserve1, uint32 _blockTimestampLast) {
        _reserve0 = reserve0;
        _reserve1 = reserve1;
        _blockTimestampLast = blockTimestampLast;
    }

        // update reserves and, on the first call per block, price accumulators
    function _update(uint balance0, uint balance1) private {
       
        uint32 blockTimestamp = uint32(block.timestamp % 2**32);

        reserve0 = uint256(balance0);
        reserve1 = uint256(balance1);
        blockTimestampLast = blockTimestamp;
        emit Sync(reserve0, reserve1);
    }


    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        uint256 currentAllowance = allowance[from][msg.sender];
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        allowance[from][msg.sender] = currentAllowance - amount;
        _transfer(from, to, amount);
        return true;
    }

    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
    }

    function addLiquidity(uint256 amountCrv, uint256 amountVe) external {
        IERC20(crvToken).transferFrom(msg.sender, address(this), amountCrv);
        IERC20(veToken).transferFrom(msg.sender, address(this), amountVe);
        
        uint256 liquidity = amountCrv * amountVe / totalSupply;
        totalSupply += liquidity;
        balanceOf[msg.sender] += liquidity;

        uint balance0;
        uint balance1;

        balance0 = IERC20(crvToken).balanceOf(address(this));
        balance1 = IERC20(veToken).balanceOf(address(this));


        _update(balance0, balance1);
        
        emit AddLiquidity(msg.sender, amountCrv, amountVe, liquidity);
    }

    function removeLiquidity(uint256 liquidity) external {
        (uint256 _reserve0, uint256 _reserve1,) = getReserves();
        require(liquidity > 0 && totalSupply >= liquidity, "Invalid liquidity");
        uint256 amountCrv = liquidity * crvToken.balanceOf(address(this)) / totalSupply;
        uint256 amountVe = liquidity * veToken.balanceOf(address(this)) / totalSupply;
        require(amountCrv > 0 && amountVe > 0, "Insufficient liquidity");
        require(amountCrv < _reserve0 && amountVe < _reserve1);

        totalSupply -= liquidity;
        balanceOf[msg.sender] -= liquidity;

        IERC20(crvToken).transfer(msg.sender, amountCrv);
        IERC20(veToken).transfer(msg.sender, amountVe);

        uint balance0;
        uint balance1;

        balance0 = IERC20(crvToken).balanceOf(address(this));
        balance1 = IERC20(veToken).balanceOf(address(this));

        _update(balance0, balance1);

        emit RemoveLiquidity(msg.sender, amountCrv, amountVe, liquidity);
    }

    function swapVEToken(uint256 CrvAmount, address to) external {
        // Simplified swap function, actual implementation depends on the exchange mechanism
        // Swap CRV for VE or vice versa, based on the amountIn
        // Update balances and emit event
        (uint256 _reserve0, uint256 _reserve1,) = getReserves();
        require(CrvAmount > 0 && CrvAmount <= _reserve0);
        IERC20(crvToken).transferFrom(msg.sender,address(this), CrvAmount);
        uint256 VeAmount = CrvAmount;
        require(VeAmount <= _reserve1);
        IERC20(veToken).transfer(to, VeAmount);

        uint balance0;
        uint balance1;

        balance0 = IERC20(crvToken).balanceOf(address(this));
        balance1 = IERC20(veToken).balanceOf(address(this));


        _update(balance0, balance1);

        emit Swap(msg.sender, CrvAmount, VeAmount);
    }

    function swapCRVToken(uint256 VeAmount, address to) external {
        // Simplified swap function, actual implementation depends on the exchange mechanism
        // Swap CRV for VE or vice versa, based on the amountIn
        // Update balances and emit event
        (uint256 _reserve0, uint256 _reserve1,) = getReserves();
        require(VeAmount > 0 && VeAmount <= _reserve1);
        IERC20(veToken).transferFrom(msg.sender,address(this), VeAmount);
        uint256 CrvAmount = VeAmount;
        require(CrvAmount <= _reserve0);
        IERC20(crvToken).transfer(to, VeAmount);

        uint balance0;
        uint balance1;

        balance0 = IERC20(crvToken).balanceOf(address(this));
        balance1 = IERC20(veToken).balanceOf(address(this));


        _update(balance0, balance1);

        emit Swap(msg.sender, CrvAmount, VeAmount);
    }
    
    function sync() external  {
        _update(IERC20(crvToken).balanceOf(address(this)), IERC20(veToken).balanceOf(address(this)));
    }
}
