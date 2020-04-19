pragma solidity ^0.5.11;
import "./oracle.sol";

contract roulette{

    //#################### CUSTOM TYPES ################################################################################
    struct bet {
        // instead of having to keep track of the types of bets the clients make, simply collect the winning numbers affected
        // by the type of bet received -> easier evaluation
        address payable owner;
        uint winningAmount;
        // NOTE: there is seemingly no float type only a fixed-point type which is "not fully supported"...
        uint[] winningNumbers;
    }

    //#################### ATTRIBUTES ##################################################################################
    bet[] bets;
    bool gameFinished;
    uint readyCount;
    uint clientCount;
    Oracle oracle;


    //#################### CONSTRUCTOR #################################################################################
    constructor(address _oracleAddress) public {
        oracle = Oracle(_oracleAddress);
        readyCount = 0;
        clientCount = 0;
        gameFinished = false;
    }

    //#################### METHODS #####################################################################################
    //### CLIENT-RELATED
    function join() public {
        // allows client to enter the game
        // TODO
    }
    function leave() public {
        // allows client to leave the game
        // TODO
    }
    function setReady() public {
        // allows client to mark as ready / finished betting
        // TODO
    }
    function getResult() public {
        // allows clients to get the results of a finished game
        require (gameFinished);
        // TODO
    }

    //### GAME MANAGEMENT
    function allReady() private {
        if (readyCount == clientCount) {
            playRoulette();
        }
    }
    function playRoulette() private {
        uint randomNumber = oracle.generateRandomNumber();
        // TODO
        teardown();
    }
    function evaluate(uint winningNumber) private {
        // TODO
    }
    function payout(address owner, uint winningNumber) private {
        // TODO
    }
    function teardown() private {
        // TODO
    }


    //### BETS
    // TODO: verify if these are all possible bets
    function betRed(uint amount) public {
        // TODO
    }
    function betBlack(uint amount) public {
        // TODO
    }
    function betEven(uint amount) public {
        // TODO
    }
    function betUneven(uint amount) public {
        // TODO
    }
    function betFirstDozen(uint amount) public {
        // TODO
    }
    function betSecondDozen(uint amount) public {
        // TODO
    }
    function betThirdDozen(uint amount) public {
        // TODO
    }
    function bet1to18(uint amount) public {
        // TODO
    }
    function bet19to36(uint amount) public {
        // TODO
    }
    function betCol1(uint amount) public {
        // TODO
    }
    function betCol2(uint amount) public {
        // TODO
    }
    function betCol3(uint amount) public {
        // TODO
    }
    function betNumber(uint number, uint amount) public {
        // TODO
    }
    function betComboTwo(uint number, uint number2, uint amount) public {
        // TODO
    }
    function betComboFour(uint number, uint number2, uint number3, uint number4, uint amount) public {
        // TODO
    }


}