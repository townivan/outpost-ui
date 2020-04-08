import * as main from './main.js';
import * as util from './util.js';
import * as ai from './ai.js';

export function startBid(player, bidAmt, targetEq){
    console.log('welcome to startBid(player, bidAmt, targetEq)...')
    console.log('player:', player)
    console.log('bidAmt:', bidAmt)
    console.log('targetEq:', targetEq)
    document.getElementById('bidError').innerHTML = ''; // clear any prevous bid errors

    let selectedAmount = util.getSelectedAmountFromCards();
    // console.log('selectedAmount:', selectedAmount)

    let isValidBid = false;
    if (selectedAmount >= targetEq.price){
        isValidBid = true;
    }

    if (!isValidBid){
        document.getElementById('bidError').innerHTML = `Invalid bid. Selected card(s) < price`;
        return;
    }
    else{
        document.getElementById('bidError').innerHTML = ``;
    }
    
    main.state.bid_isBiddingActive = true;
    main.state.players.map(player => {
        player.bidStatus = "awaiting";
        main.state.bid_players.push(player);
    })
    main.state.bid_players.sort(util.compareValues('seat'));
    main.state.bid_round = 1;
    main.state.bid_currentBid = selectedAmount;
    main.state.bid_leader = player;
    main.state.bid_equipment = targetEq;
    player.bidStatus = "leader"

    util.logit(`${player.name} starts a bid for ${targetEq.name} at ${selectedAmount}.`);

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
    // console.log('welcome to considerBid(player):', player)
    if (!isBiddingOver()){
        if (player.isYou){
            console.log('display UI for considering a bid...')
            // back to me to decide if I counter bid
            
            // update UI
            let biddingPlayerListAreaCode = '';
            main.state.bid_players.map(player => {
                biddingPlayerListAreaCode += buildBidderBoxDisplay(player)
            })
            document.getElementById('biddingPlayerListArea').innerHTML = biddingPlayerListAreaCode;

            function buildBidderBoxDisplay(player){
                const code = `
                <div class="biddingPlayerBox">
                    <div class="biddingPlayerBox--statusHeader">${player.bidStatus}...</div>
                    <div class="biddingPlayerBox--nameLabel">${player.name}</div>
                    <div class="biddingPlayerBox--flag"></div>
                </div>
                `;
                return code;
            }

            document.getElementById('biddingEqUpForBidDesc--desc').innerHTML = main.state.bid_equipment.desc;
            document.getElementById('biddingEqUpForBidDesc--currentBid').innerHTML = `Current bid ${main.state.bid_currentBid}c by ${main.state.bid_leader.name}`;
            document.getElementById('newBidAmountInput').value = main.state.bid_currentBid;
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

    // console.log('%cprocessWinningBid for ', 'background-color:deeppink;', player)

    // calc price of order
    let eq = main.state.bid_equipment;

    // apply discounts here later (todo)
    let totalCost = main.state.bid_currentBid;
    // console.log('totalCost:', totalCost)

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
        // console.log('main.state.eqUpForBidArray:', main.state.eqUpForBidArray)

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
        // console.log('clonedEq:', clonedEq)

        // remove it from the slot
        main.state.eqUpForBidArray.splice(locatedEqFromUpForBidArrayIndex, 1);

        player.ownedEquipment.push(clonedEq);
        // console.log('%cmain.state.eqUpForBidArray', 'color:orange', main.state.eqUpForBidArray);
        // console.log('player:', player)


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