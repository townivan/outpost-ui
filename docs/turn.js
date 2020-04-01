import * as main from './main.js';
import * as util from './util.js';
import * as ai from './ai.js';




export function startRound() {
    // 1. determine player order
    determinePlayerOrder();

    // 2. replace purchased colony upgrade cards (equipment)
    replaceEquipment();

    // 3. distribute production cards
    if (main.state.round > 1){
        distributeProductionCards();
    }
    // 4. discard excess production cards
    // 5. perform player turns
    // 6. check for victory


    // loop through players and do AI actions if needed.  Wait for real player actions.
    for (let i = 0; i < main.state.players.length; i++) {
        if (!main.state.players[i].isYou) {
            endTurn(main.state.players[i]);
        }
        else {
            break; // stop for your turn
        }
    }
}
export function endRound() {
    console.log('this round should now end.');
    main.state.round++;
    main.state.players.map(p => p.isAwaitingTurn = true);
    main.render();
    startRound();
}
export function startTurn(player) {
    if (!player.isYou) {
        endTurn(player);
    }
}

export function endTurnBtn() {
    console.log('welcome to endTurnBtn()...');
    let me = util.getPlayerMe();
    // console.log('me:', me)
    endTurn(me)
}
export function endTurn(player) {
    // console.log('this player is ending their turn...', player);
    util.logit(`${player.name} ends their turn.`);
    player.isAwaitingTurn = false;

    if (player.turnOrder == main.state.players.length) {
        // end the round!
        // console.log('end the round!');
        endRound();
    }
    else {
        // advance to next player's turn...
        let nextPlayer = util.getPlayerByTurnOrder(player.turnOrder + 1);
        // console.log('nextPlayer:', nextPlayer)
        startTurn(nextPlayer);
    }
    main.render();
}

export function determinePlayerOrder() {
    // console.log('welcome to determinePlayerOrder()...')
    // group by vp values
    // sort by groups
    // shuffle within each group

    let groups = []; // {value, members[]}
    main.state.players.map((player, i) => {
        if (i == 0) { // the first player defines the first group
            let obj = {};
            obj.value = player.vp;
            obj.members = [player]
            groups.push(obj);
        }
        else {
            // if this player's vp exists in a group...
            let foundOne = false;
            foundOne = util.isObjInHereWithValue(groups, 'value', player.vp);
            // console.log('foundOne:', foundOne)
            if (foundOne){
                let group = util.getObjInHereWithValue(groups, 'value', player.vp);
                group.members.push(player);
                // console.log('group:', group)
            }
            else{ // make a new group with this player
                let obj = {};
                obj.value = player.vp;
                obj.members = [player]
                groups.push(obj);
            }
        }

    })

    // sort groups highest vp first
    groups.sort(util.compareValues('value', 'desc'));
    // console.log('groups:', groups)

    // shuffle each group
    groups.map(group => {
        util.shuffleArray(group.members)
    })

    // create array of playerIds in the correct order....
    let orderedPlayerIds = [];
    groups.map(group => {
        group.members.map(member => {
            orderedPlayerIds.push(member.id)
        })
    });

    // console.log('orderedPlayerIds:', orderedPlayerIds)

    // asign turnOrder to each player
    orderedPlayerIds.map((id,i) => {
        util.getPlayerById(id).turnOrder = i+1;
    })

    // sort players by turnOrder
    main.state.players.sort(util.compareValues('turnOrder'));

    // console.log('players by turnOrder:', main.state.players)
    util.logit('Determine player order (complete)');
}

export function replaceEquipment() {
    // create array of candidates from equipment array
    // must be 1) in proper era; 2) amount > 0; 3) limited to eqMax candidates 

    // filter by 1 and 2...
    var possibleEq = main.state.equipment.filter(function (eq) {
        return (eq.era <= main.state.currentEra && eq.amount > 0 && eq.isUpForBid == false);
    });

    // determine how many new ones we need...
    let countOfEqAlreadyAvailableForBidding = 0;
    main.state.equipment.map(eq => {
        if (eq.isUpForBid) {
            countOfEqAlreadyAvailableForBidding++;
        }
    })

    let amountNeeded = main.state.eqMax - countOfEqAlreadyAvailableForBidding;

    // shuffle the possible and pick the amountNeeded...
    util.shuffleArray(possibleEq);
    for (let i = 0; i < amountNeeded; i++) {
        possibleEq[i].isUpForBid = true;
    }

    console.log('main.state.equipment:', main.state.equipment)

    // empty eqUpForBidArray
    main.state.eqUpForBidArray.splice(0, main.state.eqUpForBidArray.length)

    // update our eqUpForBidArray array
    main.state.equipment.map(eq => {
        if (eq.isUpForBid) {
            main.state.eqUpForBidArray.push(eq.name);
        }
    });

    console.log('main.state.eqUpForBidArray:', main.state.eqUpForBidArray)

    // update biddableSelect select
    let biddableSelectEl = document.getElementById('biddableSelect');
    let biddableSelectCode = ''
    main.state.eqUpForBidArray.map(eq => {
        biddableSelectCode += `<option value="${eq}">${eq}</option>`;
    })
    biddableSelectEl.innerHTML = biddableSelectCode;

    let selectValue = biddableSelectEl.options[biddableSelectEl.selectedIndex].value;
    let selectedEq = util.getObjInHereWithValue(main.state.equipment, 'name', selectValue);
    document.getElementById('biddableInitialAmount').value = selectedEq.price;

}
export function distributeProductionCards(){
    console.log('welcome to distributeProductionCards()...');
    
    main.state.players.map(player => {
        // console.log('player:', player)
        player.factories.map(factory => {
            if (factory.isManned){
                let newCard = main.drawCard(factory.type);
                player.cards.push(newCard);
                if (player.isYou){
                    util.logit(`You draw ${newCard.cardType}:${newCard.value}`);
                }
            }
        })
        // check if need to discard...
        let handWeight = 0;
        player.cards.map(card =>{
            handWeight+= card.weight
        })

        if (handWeight > player.handLimit){
            // sort cards by lowest values first
            player.cards.sort(util.compareValues('value'));
            
            // discard until under the hand limit...
            let shiftCount = 0; // the number of items to remove from the start of the array.
            let afterDiscardWeight = handWeight;
            for (let i=0; i<player.cards.length; i++){
                shiftCount++;
                afterDiscardWeight = afterDiscardWeight - player.cards[i].weight;
                util.logit(`${player.name } auto-discards ${player.cards[i].cardType}:${player.cards[i].value}...`);
                if (afterDiscardWeight <= player.handLimit){
                    break;
                }
            }
            // console.log('shiftCount:', shiftCount)
            // remove shiftCount items from the start of the array
            for (let i=0; i<shiftCount; i++){
                player.cards.shift(); 
            }
            
            // console.log('cards: ', player.cards)
        }
    })
    main.render();
}
export function buyColonists(player, buyNumber){
    console.log('welcome to buyColonists()...');
    let purchaseErrorEl = document.getElementById('purchaseError');
    purchaseErrorEl.innerHTML = ''; // reset any errors
    let purchaseErrorReasons = '';

    buyNumber = buyNumber*1;
    console.log(`welcome to buyColonists(player=${player.name})`)
    // let player = null;
    // if (playerId === -1){
    //     player = util.getPlayerMe();
    // }
    // else{
    //     player = getPlayerById(playerId);
    // }

    // handle cards via the local player first.

    let selectedAmount = util.getSelectedAmountFromCards();
    console.log('selectedAmount:', selectedAmount)

    // calc price of order
    let unitPrice = 10;
    // apply discounts here later (todo)
    let totalCost = buyNumber * unitPrice;
    console.log('totalCost:', totalCost)

    let validPurchase = false;
    let check1 = false;
    let check2 = false;

    if (selectedAmount >= totalCost){
        check1 = true;
    }
    else{
        purchaseErrorReasons += `purchase error: selected amount < total cost. `;
    }

    if ((player.colonist + buyNumber) <= player.colonistMax){
        check2 = true;
    }
    else{
        purchaseErrorReasons += `purchase error: exceeds player's colonist max. `;
    }
    
    if (check1 && check2){
        validPurchase = true;
    }

    if (validPurchase){
        // purchase successful!  process...
        player.colonist += buyNumber;
        util.spendCards();
        // update VP and render
        main.calcVp();
        main.render();
        util.logit(`${player.name} spends ${selectedAmount}c to purchase ${buyNumber} colonist(s).`);
    }
    else {
        // purchase failed! process...
        console.log('purchase failed!!');
        purchaseErrorEl.innerHTML = purchaseErrorReasons;
    }



}
export function buyFactory(player, buyNumber, factoryType){
    console.log('welcome to buyFactory()...');
    console.log('player:', player);
    console.log('buyNumber:', buyNumber);
    console.log('factoryType:', factoryType);

    let purchaseErrorEl = document.getElementById('purchaseError');
    purchaseErrorEl.innerHTML = ''; // reset any errors
    let purchaseErrorReasons = '';

    buyNumber = buyNumber*1;

    let selectedAmount = util.getSelectedAmountFromCards();
    console.log('selectedAmount:', selectedAmount)

    // calc price of order
    let unitPrice = null;
    if (factoryType == 'factoryOr'){ unitPrice = 10; }
    if (factoryType == 'factoryWa'){ unitPrice = 20; }
    // apply discounts here later (todo)
    let totalCost = buyNumber * unitPrice;
    console.log('totalCost:', totalCost)

    let validPurchase = false;
    let check1 = false;
    let check2 = false;

    if (selectedAmount >= totalCost){
        check1 = true;
    }
    else{
        purchaseErrorReasons += `purchase error: selected amount < total cost. `;
    }

    // ## add rules for purchasing factories here.  (like the New Chemicals rule) TODO
    check2 = true;
    // if ((player.colonist + buyNumber) <= player.colonistMax){
    //     check2 = true;
    // }
    // else{
    //     purchaseErrorReasons += `purchase error: exceeds player's colonist max. `;
    // }
    
    if (check1 && check2){
        validPurchase = true;
    }

    if (validPurchase){
        // purchase successful!  process...
        if (factoryType == 'factoryOr'){ player.factories.push(main.addFactory(player, 'Or')); }
        if (factoryType == 'factoryWa'){ player.factories.push(main.addFactory(player, 'Wa')); }
        util.spendCards();
        // update VP and render
        main.calcVp();
        main.render();
        util.logit(`${player.name} spends ${selectedAmount}c to purchase ${buyNumber} ${factoryType} factory(s).`);
    }
    else {
        // purchase failed! process...
        console.log('purchase failed!!');
        purchaseErrorEl.innerHTML = purchaseErrorReasons;
    }

}
/*
export function startBid(){
    console.log('welcome to startBid()...')
    console.log('main.state.players:', main.state.players)// this should be in vp order already...
    // bidstate: {
    //     isActive
    //     players: [],
    //     eq: null,
    //     round: 0,
    //     currentLeaderId: null

    // this should be disabled if a bid is already active....so...
    if (!main.state.bidstate.isActive){  // if there isn't already an active bid (just to be safe)
        main.state.bidstate.isActive = true;
        bidInit();
        ai.startAiBidding();
    }
}
function bidInit(){
    let me = util.getPlayerMe();
    let bid = main.state.bidstate;
    main.state.players.map(player => {
        bid.players.push(player);
    })

    // sort groups highest vp first
    bid.players.sort(util.compareValues('seat'));
    console.log('bid:', bid)

    let biddingPlayerBoxesCode = '';
    bid.players.map(player => {
        biddingPlayerBoxesCode += getBoxCode(player);
    })
    document.getElementById('biddingPlayerListArea').innerHTML = biddingPlayerBoxesCode;

    function getBoxCode(player){
        let code = `
        <div class="biddingPlayerBox">
            <div class="biddingPlayerBox--statusHeader">${player.isYou ? '<strong>active</strong>' : 'waiting...'}</div>
            <div class="biddingPlayerBox--nameLabel">${player.name}</div>
            <div class="biddingPlayerBox--flag"></div>
        </div>`;
        return code;
    }

    // biddingEqUpForBidDesc--desc
    let biddableSelect = document.getElementById('biddableSelect').value;
    let targetEq = util.getObjInHereWithValue(main.state.equipment, 'name', biddableSelect); 
    document.getElementById('biddingEqUpForBidDesc--desc').innerHTML = targetEq.desc;

    //biddingEqUpForBidDesc--currentBid
    let biddableInitialAmount = document.getElementById('biddableInitialAmount').value;
    let message = `Current bid ${biddableInitialAmount}c by ${me.name}`;
    document.getElementById('biddingEqUpForBidDesc--currentBid').innerHTML = message;

    // update bid
    bid.currentValue = biddableInitialAmount;
    bid.currentLeaderId = me.id;

    // update upcoming bid data
    document.getElementById('newBidAmountInput').value = biddableInitialAmount*1 + 1;


    
}
*/