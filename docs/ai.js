import * as main from './main.js';
import * as util from './util.js';

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
                bid.players[myIndex+1].afterme="true"
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

    aiPlayersInSeatOrderAfterMe.map(player => {
        counterBid(player);
    })
}

function counterBid(player) {
    console.log('welcome to counterBid()...');
    console.log('player:', player);
    console.log(`${player.name}'s max hand value is ${util.getMaxHandValue(player)}`)
    console.log('randomBool():', util.randomBool());

    util.stupidSelectCardsToPay(player, 20);
}