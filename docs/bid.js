import * as main from './main.js';
import * as util from './util.js';
import * as ai from './ai.js';

// bid_isBiddingActive: false,
// bid_players: [],
// bid_currentBid: null,
// bid_leader: null,
// bid_round: 1,
// bid_equipment: null,


export function startBid(player, bidAmt, targetEq){
    console.log('welcome to startBid(player, bidAmt, targetEq)...')
    console.log('player:', player)
    console.log('bidAmt:', bidAmt)
    console.log('targetEq:', targetEq)
    document.getElementById('bidError').innerHTML = ''; // clear any prevous bid errors

    let selectedAmount = util.getSelectedAmountFromCards();
    console.log('selectedAmount:', selectedAmount)

    let isValidBid = false;
    if (selectedAmount >= targetEq.price){
        isValidBid = true;
    }

    if (!isValidBid){
        document.getElementById('bidError').innerHTML = `Invalid bid. Selected card(s) < price`;
        return;
    }
    

    
    main.state.bid_isBiddingActive = true;
    main.state.players.map(player => {
        player.bidStatus = "awaiting";
        main.state.bid_players.push(player);
    })
    main.state.bid_players.sort(util.compareValues('seat'));
    main.state.bid_round = 1;
    main.state.bid_currentBid = bidAmt;
    main.state.bid_leader = player;
    main.state.bid_equipment = targetEq;
    player.bidStatus = "leader"

    // bidStatus: null, awaiting, leader, passed
    console.log('main.state:', main.state)
    considerBid(player.playerSeatedAfterMe)
}
export function considerBid(player){
    console.log('welcome to considerBid(player):', player)
    if (!isBiddingOver()){
        if (player.isYou){
            console.log('display UI for considering a bid...')
        }
        else{
            // let ai decide if he should bid or not
            ai.considerBidAi(player);
        }
    }
}

export function isBiddingOver(){
    let anyNonPassNoLeader = false;
    let awaitingCount = 0;
    let leaderCount = 0;
    let passedCount = 0;
    let otherCount = 0;
    main.state.players.map(player => {
        if (player.bidStatus == 'awaiting'){
            awaitingCount++;
        }
        else if (player.bidStatus == 'leader'){
            leaderCount++;
        }
        else if (player.bidStatus == 'passed'){
            passedCount++; 
        }
        else {
            otherCount++;
        }
    })
    if (awaitingCount > 0){
        return false;
    }
    if (otherCount > 0){
        return false;
    }
    if (leaderCount == 1 && passedCount == main.state.players.length-1){
        return true
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