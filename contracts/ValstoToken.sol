pragma solidity ^0.4.24;

import "./StandardBurnableToken.sol";
import "./Ownable.sol";

contract ValstoToken is StandardBurnableToken, Ownable {

  using SafeMath for uint256;

  string public symbol = "VTO";
  string public name = "Valsto";
  uint256 public decimals = 18;

  address public valstoWalletAddress;
  address public reservedTokensAddress;
  address public teamTokensAddress;

  /* Variables to hold reserved and team tokens locking period */
  uint256 public reservedTokensLockedPeriod;
  uint256 public teamTokensLockedPeriod;

  
  /* ICO status */
  enum State {
    Active,
    Closed
  }

  event Closed();

  State public state;

  // ------------------------------------------------------------------------
  // Constructor
  // ------------------------------------------------------------------------
  constructor(address _reservedTokensAddress, address _teamTokensAddress, address _valstoWalletAddress) public {
    owner = msg.sender;

    reservedTokensAddress = _reservedTokensAddress;
    teamTokensAddress = _teamTokensAddress;
    valstoWalletAddress = _valstoWalletAddress;

    totalSupply_ = 1000000000 ether;
   
    //50%
    balances[msg.sender] = 500000000 ether; 
    //18%
    balances[reservedTokensAddress] = 180000000 ether;
    //5%
    balances[teamTokensAddress] = 50000000 ether;
    //bounty 2%
    balances[this] = 20000000 ether;
   
    state = State.Active;
   
    emit Transfer(address(0), msg.sender, balances[msg.sender]);
    emit Transfer(address(0), reservedTokensAddress, balances[reservedTokensAddress]);
    emit Transfer(address(0), teamTokensAddress, balances[teamTokensAddress]);
    emit Transfer(address(0), address(this), balances[this]);
  }

  modifier checkAfterICOLock () {
    if (msg.sender == reservedTokensAddress){
        require (now >= reservedTokensLockedPeriod);
    }
    if (msg.sender == teamTokensAddress){
        require (now >= teamTokensLockedPeriod);
    }
    _;
  }
 
  function transfer(address _to, uint256 _value)   public  checkAfterICOLock returns (bool) {
    super.transfer(_to,_value);
  }

  function transferFrom(address _from, address _to, uint256 _value)  public  checkAfterICOLock  returns (bool) {
    super.transferFrom(_from, _to, _value);
  }

  function approve(address _spender, uint256 _value)   public   checkAfterICOLock  returns (bool) {
    super.approve(_spender, _value);
  }

  function increaseApproval(address _spender, uint _addedValue)  public checkAfterICOLock returns (bool) {
    super.increaseApproval(_spender, _addedValue);
  }

  function decreaseApproval(address _spender, uint _subtractedValue) public checkAfterICOLock returns (bool) {
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
   * @dev all ether transfer to another wallet automatic
   */
  function () public payable {
    require(state == State.Active); // Reject the transactions after ICO ended
    require(msg.value >= 0.1 ether);

    valstoWalletAddress.transfer(msg.value);
  }

  /**
  * After ICO close it helps to lock tokens for pools
  **/
  function close() onlyOwner public {
    require(state == State.Active);
    state = State.Closed;
    
    teamTokensLockedPeriod = now + 365 days;
    reservedTokensLockedPeriod = now + 1095 days; //3 years

    emit Closed();
  }
}