pragma solidity ^0.4.24;

import "./StandardToken.sol";
import "./Ownable.sol";

contract ValstoToken is StandardToken, Ownable {

  using SafeMath for uint256;

  string public symbol = "VTO";
  string public name = "Valsto";
  uint256 public decimals = 18;

  address public merchantTokenAddress;
  address public teamTokensAddress;
  address public valstoWalletAddress;

  /* Variable to hold team tokens locking period */
  uint256 public teamTokensLockedPeriod;


  /* TDE status */
  enum State {
    Active,
    Closed
  }
  State public state;

  event Closed();

  // ------------------------------------------------------------------------
  // Constructor
  // ------------------------------------------------------------------------
  constructor(address _merchantTokenAddress, address _teamTokensAddress, address _valstoWalletAddress) public {
    owner = msg.sender;

    merchantTokenAddress = _merchantTokenAddress;
    teamTokensAddress = _teamTokensAddress;
    valstoWalletAddress = _valstoWalletAddress;

    totalSupply_ = 1000000000 ether;

    //60% supporters
    balances[msg.sender] = 600000000 ether;
    //35% merchants
    balances[merchantTokenAddress] = 350000000 ether;
    //5% team
    balances[teamTokensAddress] = 50000000 ether;

    state = State.Active;

    emit Transfer(address(0), msg.sender, balances[msg.sender]);
    emit Transfer(address(0), merchantTokenAddress, balances[merchantTokenAddress]);
    emit Transfer(address(0), teamTokensAddress, balances[teamTokensAddress]);

  }

  modifier checkPeriodAfterTDELock () {

    if (msg.sender == teamTokensAddress){
        require (now >= teamTokensLockedPeriod && state == State.Closed);
    }
    _;
  }

  function transfer(address _to, uint256 _value)   public  checkPeriodAfterTDELock returns (bool) {
    super.transfer(_to,_value);
  }

  function transferFrom(address _from, address _to, uint256 _value)  public  checkPeriodAfterTDELock  returns (bool) {
    super.transferFrom(_from, _to, _value);
  }

  function approve(address _spender, uint256 _value)   public   checkPeriodAfterTDELock  returns (bool) {
    super.approve(_spender, _value);
  }

  function increaseApproval(address _spender, uint _addedValue)  public checkPeriodAfterTDELock returns (bool) {
    super.increaseApproval(_spender, _addedValue);
  }

  function decreaseApproval(address _spender, uint _subtractedValue) public checkPeriodAfterTDELock returns (bool) {
    super.decreaseApproval(_spender, _subtractedValue);
  }

  /**
   * @dev Transfer ownership now transfers all owners tokens to new owner
   */
  function transferOwnership(address newOwner) public onlyOwner {
    balances[newOwner] = balances[newOwner].add(balances[owner]);
    emit Transfer(owner, newOwner, balances[owner]);
    balances[owner] = 0;

    super.transferOwnership(newOwner);
  }

  /**
   * Accept ETH donations only when the TDE event is active
   * @dev all ether transfer to valsto wallet automatic
   */
  function () public payable {
    require(state == State.Active); // Reject the donations after TDE ended

    valstoWalletAddress.transfer(msg.value);
  }

  /**
  * Close TDE
  **/
  function close() onlyOwner public {
    require(state == State.Active);
    state = State.Closed;

    //The team locked period are 2 years
    teamTokensLockedPeriod = now + 730 days;

    emit Closed();
  }
}
