import * as main from './main.js';
import * as util from './util.js';
import * as ai from './ai.js';

// bid_isBiddingActive: false,
// bid_players: [],
// bid_currentBid: null,
// bid_leader: null,
// bid_round: 1,
// bid_equipment: null,

// TODO: fix equipment to work with new object model
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
    console.log('bidding seat order:', main.state.bid_players)
    considerBid(player.playerSeatedAfterMe)
}
export function endBidding(){
    main.state.bid_isBiddingActive = false;
    main.state.players.map(player => {
        player.bidStatus = null;
    })
    main.state.bid_players.splice(0, main.state.bid_players.length) // reset array
    main.state.bid_round = 1;
    main.state.bid_currentBid = null;
    main.state.bid_leader = null;
    main.state.bid_equipment = null;
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
    // console.log('welcome to isBiddingOver()...')
    let anyNonPassNoLeader = false;
    let awaitingCount = 0;
    let leaderCount = 0;
    let passedCount = 0;
    let otherCount = 0;
    main.state.players.map(player => {
        // console.log(`${player.name} has a bidStatus of ${player.bidStatus}`)
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

export function findPlayerWithWinningBid(){
    if (isBiddingOver()){
        let theWinner = null
        main.state.players.map(player => {
            if (player.bidStatus == 'leader'){
                theWinner = player
            }
        })
        return theWinner;
    }
}

export function processWinningBid(player){

    console.log('%cprocessWinningBid for ', 'background-color:deeppink;', player)

    // calc price of order
    let eq = main.state.bid_equipment;

    // apply discounts here later (todo)
    let totalCost = main.state.bid_currentBid;
    console.log('totalCost:', totalCost)

    let validPurchase = false;
    let check1 = false;
    let check2 = false;

    let purchaseErrorReasons = '';

    let selectedAmount = util.getSelectedAmountFromCards();

    if (selectedAmount >= totalCost){
        check1 = true;
    }
    else{
        purchaseErrorReasons += `purchase error: selected amount < total cost. `;
    }

    // ## add other possible rules here
    check2 = true;
    
    if (check1 && check2){
        validPurchase = true;
    }

    if (validPurchase){
        // purchase successful!  process...
        if (eq.name == "Data Library") {player.dataLibraryCount++;}
        if (eq.name == "Warehouse") {player.warehouseCount++;}
        if (eq.name == "Heavy Equipment") {player.heavyEquipmentCount++;}
        if (eq.name == "Nodule") {player.noduleCount++;}

        // TODO: remove from equipment up for bid
        var eqToRemoveIndex = main.state.eqUpForBidArray.indexOf(eq.name);
        // main.state.eqUpForBidArray.splice(eqToRemoveIndex, 1);
        console.log('main.state.eqUpForBidArray:', main.state.eqUpForBidArray)

        // TODO: update render (2 left) data
        // console.log('%ceq:', 'color:red', eq)
        // console.log('%cmain.state.eqUpForBidArray', 'color:red', main.state.eqUpForBidArray);
        let locatedEqFromUpForBidArrayIndex = null;
        main.state.eqUpForBidArray.map((eqObj, i) => {
            if (eqObj.id ==  eq.id){
                locatedEqFromUpForBidArrayIndex = i
            }
        })
        // console.log('locatedEqFromUpForBidArrayIndex:', locatedEqFromUpForBidArrayIndex)

        // clone it...
        let clonedEq = JSON.parse(JSON.stringify(main.state.eqUpForBidArray[locatedEqFromUpForBidArrayIndex]))
        console.log('clonedEq:', clonedEq)

        // remove it from the slot
        main.state.eqUpForBidArray.splice(locatedEqFromUpForBidArrayIndex, 1);

        player.ownedEquipment.push(clonedEq);
        console.log('%cmain.state.eqUpForBidArray', 'color:orange', main.state.eqUpForBidArray);
        console.log('player:', player)


        // TODO: update bid select to no longer have that option
        // update biddableSelect select
        let biddableSelectEl = document.getElementById('biddableSelect');
        let biddableSelectCode = ''
        main.state.eqUpForBidArray.map(eq => {
            biddableSelectCode += `<option value="${eq.id}">${eq.name}</option>`;
        })
        biddableSelectEl.innerHTML = biddableSelectCode;

        let selectValue = biddableSelectEl.options[biddableSelectEl.selectedIndex].value;
        // let selectedEq = util.getObjInHereWithValue(main.state.equipment, 'name', selectValue);
        //let selectedEq = util.getObjInHereWithValue(main.state.equipment, 'name', selectValue);
        // let biddableSelect = document.getElementById('biddableSelect').value;
        let selectedEq = util.getObjInHereWithValue(main.state.eqUpForBidArray, 'id', selectValue*1);

        document.getElementById('biddableInitialAmount').value = selectedEq.price;
        // TODO: update calcVP to include eq

        util.spendCards();
        endBidding();
        // update VP and render
        main.calcVp();
        main.render();
        util.logit(`${player.name} spends ${selectedAmount}c to purchase ${eq.name}.`);
    }
    else {
        // purchase failed! process...
        console.log('bid purchase failed!!');
        document.getElementById('bidError').innerHTML = purchaseErrorReasons;
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