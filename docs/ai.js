import * as main from './main.js';
import * as util from './util.js';
import * as bid from './bid.js';


export function considerBidAi(player){
    console.log('welcome to considerBidAi(player)...', player)
    // let's start by assuming they will always pass
    player.bidStatus = "passed";
    if (bid.isBiddingOver()){
        console.log('bidding is over...there is a winner')
        let winningPlayer = bid.findPlayerWithWinningBid();
        bid.processWinningBid(winningPlayer);
        console.log('winningPlayer:', winningPlayer)
        console.log('main.state', main.state)
    }
    else{
        console.log('bidding is NOT over, check next player...')
        bid.considerBid(player.playerSeatedAfterMe);
    }
}


/*
export function startAiBidding(){
    console.log('welcome to startAiBidding()...');
    let bid = main.state.bidstate;
    console.log('bid:', bid)

    // make array of only ai players (in proper seat order)
    // if: [me, a, b, c]  -> [a, b, c]
    // if: [a, c, me, b]  -> [b, a, c]  (because it starts with after me)

    let aiplayers = []; // should be in seat order...
    let aiPlayersInSeatOrderAfterMe = [];
    let myIndex = null;

    // flag the player after me in seat order 
    bid.players.map((player, i) => {
        if (player.isYou){
            myIndex = i;                          // 0 1 2
            if (myIndex+1 < bid.players.length){ // 1 2 3
                bid.players[myIndex+1].afterme="true";
            }
            else{
                bid.players[0].afterme="true"
            }
        }
        else{
            aiplayers.push(player)
        }
    })


    // add starting from the "afterme" guy...
    let foundAfterMe = false;
    aiplayers.map(player => {
        if (player.afterme){
            foundAfterMe = true;
        }
        if (foundAfterMe){
            aiPlayersInSeatOrderAfterMe.push(player);
        }
    })
    // add from the start until the "afterme" guy...
    let foundAfterMeAgain = false;
    aiplayers.map(player => {
        if (player.afterme){
            foundAfterMeAgain = true;
        }
        if (!foundAfterMeAgain){
            aiPlayersInSeatOrderAfterMe.push(player);
        }
    })

    console.log('aiplayers:', aiplayers)
    console.log('aiPlayersInSeatOrderAfterMe:', aiPlayersInSeatOrderAfterMe)

    // counterBid or pass for each ai player...
    aiPlayersInSeatOrderAfterMe.map(player => {

        // for now, have them all pass...
        passBid(player);

        if (util.getMaxHandValue(player) >= bid.currentValue){
            // randomly decide to bid or pass
            //passBid(player);
            //counterBid(player);
        }
        
    })
}

function passBid(player){
    console.log('welcome to passBid()...');

}

function counterBid(player) {
    console.log('welcome to counterBid()...');
    console.log('player:', player);
    console.log(`${player.name}'s max hand value is ${util.getMaxHandValue(player)}`)
    console.log('randomBool():', util.randomBool());

    util.stupidSelectCardsToPay(player, 20);
}
*/