pragma solidity ^0.5.11;
import "./oracle.sol";

contract Roulette{
    // contains the game-logic

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
    address payable oracleAddress;
    address payable firstClient;
    bool started=false;

    //#################### EVENTS ##################################################################################
    event LogSpinningWheel(string desc, address client);
    event RouletteDone(address client, uint rng);
    event EventFirstReadyClient(address client);
    event NotFirstClient(address client);
    event ClientJoined(uint clientCount);
    event ClientLeft(uint clientCount);
    event ClientReady(address client, uint readyCount);

    //#################### CONSTRUCTOR #################################################################################
    constructor(address payable orAddress) payable public {
        oracle = Oracle(orAddress);
        readyCount = 0;
        clientCount = 0;
        gameFinished = false;
        oracleAddress = orAddress;
    }

    //#################### METHODS #####################################################################################
    //### CLIENT-RELATED
    function join() public {
        // allows client to enter the game
        clientCount=clientCount+1;
        emit ClientJoined(clientCount);
    }

    function leave(address leaver) public {
        // allows client to leave the game
        if (clientCount >= 1) {
            clientCount=clientCount-1;
            emit ClientLeft(clientCount);
            // in case the firstClient leaves
            if(clientCount==0){
                delete firstClient;
            }
            if(leaver == firstClient){
                for(uint i=0;i<bets.length;i++){
                    bet memory temp=bets[i];
                    if(temp.owner != leaver){
                        firstClient=temp.owner;
                        break;
                    }
                }
            }
        }
    }

    function setReady() public {
        // allows client to mark as ready / finished betting
        readyCount=readyCount+1;
        emit ClientReady(msg.sender, readyCount);
        if (readyCount == 1)
        {
            // set firstClient, used to avoid race-condition in playRoulette()
            firstClient = msg.sender;
            emit EventFirstReadyClient(firstClient);
        }
        allReady();
    }

    //### GAME MANAGEMENT
    function allReady() private {
        // if all clients ready, trigger oracle
        if (readyCount == clientCount) {
            createRandomNumber();
        }
    }

    function createRandomNumber() private{
        // gameFinished to indicate that no more bets can be placed
        gameFinished=true;
        oracle.generateRandomNumber();
    }

    function getRandomNumber() private{
        // allows roulette.sol to get the generated number from the oracle
        randomNumber=oracle.getRandomNumber();
    }

    function playRoulette() public {
        // triggered upon all clients being ready
        require(clientCount==readyCount);

        // only the request of the firstClient is respected to avoid race-condition
        if(msg.sender == firstClient){
            started=true;
            emit LogSpinningWheel("started playing roulette", msg.sender);
            getRandomNumber();
            evaluate();
            teardown();
        } else {
            emit NotFirstClient(msg.sender);
        }
    }

    function evaluate() private {
        // evaluates bets and performs the according payouts
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
        // at the end of the round, reset the game-state
        clientCount=0;
        readyCount=0;
        lastRoundWinningNumber=randomNumber;
        delete randomNumber;
        delete bets;
        gameFinished=false;
        started=false;
        delete firstClient;
        emit RouletteDone(msg.sender, lastRoundWinningNumber);
    }

    function createBet(uint8[] memory winningNumbers, uint8 payoutFactor) private {
        // creates the internal representation of the bet
        require(!gameFinished);
        bet memory temp;
        temp.winningAmount =  msg.value*payoutFactor;
        temp.owner = msg.sender;
        temp.winningNumbers = winningNumbers;
        bets.push(temp);
    }

    //### BETS
    // different bet types and their respective helpers
    //https://livecasino.com/wp-content/uploads/2018/12/How-to-bet-on-roulette-Red.png

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

    function betRange(uint8 start, uint8 number_count, uint8 payoutFactor) private {
        uint8 end = start + number_count;
        uint8[] memory numbers = new uint8[](number_count);
        uint8 counter = 0;
        for (uint8 i = start; i < end; i++) {
            numbers[counter] = i;
            counter++;
        }
        createBet(numbers, payoutFactor);
    }

    function betFirstDozen() payable public {
        betRange(1, 12, 3);
    }

    function betSecondDozen() payable public {
        betRange(13, 12, 3);
    }

    function betThirdDozen() payable public {
        betRange(25, 12, 3);
    }

    function bet1to18() payable public {
        betRange(1, 18, 2);
    }
    function bet19to36() payable public {
        betRange(19, 18, 2);
    }

    function betModulo(uint8 remainder, uint8 divisor) private {
        uint8[] memory numbers = new uint8[](36/divisor);
        uint8 counter = 0;
        for (uint8 i = 1; i < 37; i++) {
            if (i % divisor == remainder){
                numbers[counter] = i;
                counter++;
            }
        }
        createBet(numbers, divisor);
    }

    function betEven() payable public {
        betModulo(0, 2);
    }
    function betOdd() payable public {
        betModulo(1, 2);
    }


    function betCol1() payable public {
        betModulo(1, 3);
    }
    function betCol2() payable public {
        betModulo(2, 3);
    }
    function betCol3() payable public {
        betModulo(0, 3);
    }

    function betNumber(uint8 number) payable public {
        uint8[] memory numbers=new uint8[](1);
        numbers[0] = number;
        createBet(numbers, 36);
    }

    // A bet on two numbers which are adjacent on the table, made by placing the chip on the shared line of the two numbers’ squares.
    function betSplit(uint8 number1, uint8 number2) payable public {
        uint8[] memory numbers=new uint8[](2);
        numbers[0] = number1;
        numbers[1] = number2;
        createBet(numbers, 18);
    }

    function betComboFour(uint8 number1, uint8 number2, uint8 number3, uint8 number4) payable public {
        uint8[] memory numbers=new uint8[](4);
        numbers[0] = number1;
        numbers[1] = number2;
        numbers[2] = number3;
        numbers[3] = number4;
        createBet(numbers, 9);
    }

}