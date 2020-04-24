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
        uint8[]  winningNumbers;
    }

    //#################### ATTRIBUTES ##################################################################################
    bet[] bets;
    bool gameFinished;
    uint readyCount;
    uint clientCount;
    Oracle oracle;
    uint256 randomNumber;
    uint256 lastRoundWinningNumber;


    //#################### CONSTRUCTOR #################################################################################
    constructor(address _oracleAddress) payable public {
        oracle = Oracle(_oracleAddress);
        readyCount = 0;
        clientCount = 0;
        gameFinished = false;

    }

    //#################### METHODS #####################################################################################
    //### CLIENT-RELATED
    function join() public {
        // allows client to enter the game
        clientCount=clientCount+1;
    }

    function leave() public {
        // allows client to leave the game
        if (clientCount >= 1) {
            clientCount=clientCount-1;
        }
    }

    function startup() payable public{
        //TODO: don't touch it:)
        //startup function, such that ethers get sent to the contract after it's deployed.
    }

    function setReady() public {
        // allows client to mark as ready / finished betting
        readyCount=readyCount+1;
        allReady();
    }

    function getResult() public view returns (uint){
        // allows clients to get the results of a finished game
        return (lastRoundWinningNumber);
    }

    //### GAME MANAGEMENT
    function allReady() private {
        if (readyCount == clientCount) {
            playRoulette();
        }
    }

    function getRandomNumber()public{
        gameFinished=true;
        randomNumber=oracle.generateRandomNumber();
    }

    function playRoulette() private {
        getRandomNumber();
        evaluate();
        teardown();
    }

    function evaluate() private {
        for(uint i=0;i<bets.length;i++){
            bet memory temp=bets[i];
            for(uint j=0;j<temp.winningNumbers.length;j++){
                if(randomNumber==temp.winningNumbers[j]){
                    payout(temp.owner,temp.winningAmount);
                }
            }
        }
    }

    function payout(address payable owner, uint winningAmount) private {
        owner.transfer(winningAmount);
    }

    function teardown() private {
        clientCount=0;
        readyCount=0;
        lastRoundWinningNumber=randomNumber;
        delete randomNumber;
        delete bets;
        gameFinished=false;
    }

    function createBet(uint8[] memory winningNumbers, uint8 payoutFactor) private {
        require(!gameFinished);
        bet memory temp;
        temp.winningAmount =  msg.value*payoutFactor;
        temp.owner = msg.sender;
        temp.winningNumbers = winningNumbers;
        bets.push(temp);
    }

//    ### BETS
    //https://livecasino.com/wp-content/uploads/2018/12/How-to-bet-on-roulette-Red.png
    // TODO: verify if these are all possible bets

    function betRed() payable public {
        uint8[] memory numbers=new uint8[](18);
        numbers[0]=1;
        numbers[1]=3;
        numbers[2]=5;
        numbers[3]=7;
        numbers[4]=9;
        numbers[5]=12;
        numbers[6]=14;
        numbers[7]=16;
        numbers[8]=18;
        numbers[9]=19;
        numbers[10]=21;
        numbers[11]=23;
        numbers[12]=25;
        numbers[13]=27;
        numbers[14]=30;
        numbers[15]=32;
        numbers[16]=34;
        numbers[17]=36;
        createBet(numbers, 2);
    }

    function betBlack() payable public {
        uint8[] memory numbers=new uint8[](18);
        numbers[0]=2;
        numbers[1]=4;
        numbers[2]=6;
        numbers[3]=8;
        numbers[4]=10;
        numbers[5]=11;
        numbers[6]=13;
        numbers[7]=15;
        numbers[8]=17;
        numbers[9]=20;
        numbers[10]=22;
        numbers[11]=24;
        numbers[12]=26;
        numbers[13]=28;
        numbers[14]=29;
        numbers[15]=31;
        numbers[16]=33;
        numbers[17]=35;
        createBet(numbers, 2);
    }

    function betEven() payable public {
        uint8[] memory numbers = new uint8[](19);
        uint8 counter = 0;
        for (uint8 i = 0; i < 37; i++) {
            if (i % 2 == 0){
                numbers[counter] = i;
                counter++;
            }
        }
        createBet(numbers, 2);
    }
    function betOdd() payable public {
        uint8[] memory numbers = new uint8[](18);
        uint8 counter = 0;
        for (uint8 i = 0; i < 37; i++) {
            if (i % 2 == 1){
                numbers[counter] = i;
                counter++;
            }
        }
        createBet(numbers, 2);
    }

    function betDozen(uint8 start) private {
        uint8 end = start + 12;
        uint8[] memory numbers = new uint8[](12);
        uint8 counter = 0;
        for (uint8 i = start; i < end; i++) {
            numbers[counter] = i;
            counter++;
        }
        createBet(numbers, 3);
    }

    function betFirstDozen() payable public {
        betDozen(1);
    }

    function betSecondDozen() payable public {
        betDozen(13);
    }

    function betThirdDozen() payable public {
        betDozen(25);
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
    function betNumber(uint8 number) payable public {
        uint8[] memory numbers=new uint8[](1);
        numbers[0] = number;
        createBet(numbers, 36);
    }

    // A bet on two numbers which are adjacent on the table, made by placing the chip on the shared line of the two numbers’ squares.
    function betSplit(uint8 number1, uint8 number2) payable public {
        // TODO: add 'require' that numbers are adjacent (or solve it through graphical constraint)
        uint8[] memory numbers=new uint8[](2);
        numbers[0] = number1;
        numbers[1] = number2;
        createBet(numbers, 18);
    }

    function betComboFour(uint8 number1, uint8 number2, uint8 number3, uint8 number4) payable public {
        // TODO: add 'require' that numbers are adjacent (or solve it through graphical constraint)
        uint8[] memory numbers=new uint8[](4);
        numbers[0] = number1;
        numbers[1] = number2;
        numbers[2] = number3;
        numbers[3] = number4;
        createBet(numbers, 9);
    }


}