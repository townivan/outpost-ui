import * as main from './main.js';
import * as util from './util.js';
import * as ai from './ai.js';

export function startAuction(player, realBidAmt, targetEq){
    console.log(`welcome to startAuction(${player.name}, ${realBidAmt}, ${targetEq.name})...`)
    // document.getElementById('turnActionsArea').classList.toggle('hideme');
    // document.getElementById('biddingArea').classList.toggle('hideme');
    // document.getElementById('biddingClosedArea').classList.toggle('hideme');
    // document.getElementById('turnManageFactoriesArea').classList.toggle('hideme');
    document.getElementById('auctionViewBtn').click();

    main.state.bid_leader = player;
    main.state.bid_currentBid = realBidAmt;
    main.state.bid_equipment = targetEq;
    main.state.players.map(player => player.bidStatus = "waiting")
    player.bidStatus = "leading";
    main.state.bid_actionCount = 1;
    document.getElementById('auctionLog').innerHTML = '';
    let auctionInputs = [...document.querySelectorAll('.auctionInputToggle')]
    auctionInputs.map(el => el.disabled = false);

    // display discounts if needed...
    if (targetEq.name === 'Nodule'){
        if (player.discountOnNodule > 0){
            document.getElementById('discountDisplay').innerHTML = `You have a ${player.discountOnNodule}c discount from Heavy Equipment.`;
        }
    }
    if (targetEq.name === 'Warehouse'){
        if (player.discountOnWarehouse > 0){
            document.getElementById('discountDisplay').innerHTML = `You have a ${player.discountOnWarehouse}c discount from Heavy Equipment.`;
        }
    }
    if (targetEq.name === 'Scientists'){
        if (player.discountOnScientist > 0){
            document.getElementById('discountDisplay').innerHTML = `You have a ${player.discountOnScientist}c discount from Data Library.`;
        }
    }
    if (targetEq.name === 'Laboratory'){
        if (player.discountOnLaboratory > 0){
            document.getElementById('discountDisplay').innerHTML = `You have a ${player.discountOnLaboratory}c discount from Data Library.`;
        }
    }
    if (targetEq.name === 'Ecoplants'){
        if (player.discountOnOutpost > 0){
            document.getElementById('discountDisplay').innerHTML = `You have a ${player.discountOnOutpost}c discount from Ecoplants.`;
        }
    }

    // util.printSeatOrder();
    util.auctionlogit(`${player.name} starts an auction for ${main.state.bid_equipment.name} with a bid of ${realBidAmt}.`);
    // util.auctionlogit(`Seat order: ${util.getSeatOrder()}`);
    util.logit(`${player.name} starts an auction for ${main.state.bid_equipment.name} with a bid of ${realBidAmt}.`);
    considerBid(player.playerSeatedAfterMe);
}

function considerBid(player){ // decide to counterBid or pass
    console.log(`welcome to considerBid(${player.name})...`)
    // console.log('player.bidStatus:', player.bidStatus)
    // util.printSeatOrder();
    // results in: 1.counterBid 2.Pass 3.PassAll
    if (player.bidStatus === 'passall'){
        passBid(player, 'passall');
    }
    else{

        if (player.isYou){
            updateUI();
            console.log('%cshow and await bid UI for you', 'color:green;')
            util.auctionlogit(`Waiting for ${player.name} to act...`);
        }
        else { // ai player
            ai.makeAuctionDecision(player);
        }

    }
}

export function counterBid(player, realBidAmt){
    console.log(`welcome to counterBid(${player.name})...`)
    main.state.bid_leader = player;
    main.state.bid_currentBid = realBidAmt;
    // main.state.bid_equipment = targetEq;
    main.state.players.map(player =>  {  // reset everyone else and make this guy the new leader
        if (player.bidStatus !== "passall"){
            player.bidStatus = "waiting"}
        }
    )
    player.bidStatus = "leading";
    // console.log(`${player.name} counterbids ${realBidAmt}.`)
    // util.logit(`${player.name} counterbids ${realBidAmt} on ${main.state.bid_equipment.name}.`);
    util.auctionlogit(`${player.name} counterbids ${realBidAmt} on ${main.state.bid_equipment.name}.`);
    
    considerBid(player.playerSeatedAfterMe);
}

export function passBid(player, passType="pass"){
    // console.log(`welcome to passBid(${player.name})...`)
    // console.log('passType:', passType)
    if (passType === 'passall'){ 
        player.bidStatus = "passall";
        // util.logit(`${player.name} decides to pass on all bidding for this auction.`);
        util.auctionlogit(`${player.name} is passing on all bidding for this auction.`);
    }
    else { 
        player.bidStatus = "pass"; 
        // util.logit(`${player.name} decides to pass on bidding for ${main.state.bid_equipment.name} this time.`);
        util.auctionlogit(`${player.name} decides to pass on bidding for ${main.state.bid_equipment.name} this time.`);
    }
    
    if (isAuctionDone()){
        processAuctionWinner();
    }
    else{
        considerBid(player.playerSeatedAfterMe);
    }
}

function isAuctionDone(){
    console.log('welcome to isAuctionDone()...')
    let passedCount = 0;
    main.state.players.map(player => {
        if (player.bidStatus == 'pass')         { passedCount++; }
        else if (player.bidStatus == 'passall') { passedCount++; }
    })

    let oneLess = main.state.players.length*1 - 1;  
    if (passedCount == oneLess) { return true; }
    else                        { return false }
}

function processAuctionWinner(){
    console.log('welcome to processAuctionWinner()...')
    // document.getElementById('turnActionsArea').classList.toggle('hideme');
    // document.getElementById('biddingArea').classList.toggle('hideme');
    // document.getElementById('biddingClosedArea').classList.toggle('hideme');
    // document.getElementById('turnManageFactoriesArea').classList.toggle('hideme');
    // document.getElementById('overviewViewBtn').click();

    // update states for display:
    let auctionInputs = [...document.querySelectorAll('.auctionInputToggle')]
    auctionInputs.map(el => el.disabled = true);
    main.state.players.map(player => player.bidStatus = "pass");
    main.state.bid_leader.bidStatus = 'Winner!';
    updateUI();

    


    // document.getElementById('lastBidSummary').innerHTML = `${main.state.bid_leader.name} wins the auction for ${main.state.bid_equipment.name} at a cost of ${main.state.bid_currentBid}c.`;
    util.logit(`${main.state.bid_leader.name} wins the auction for ${main.state.bid_equipment.name} at a cost of ${main.state.bid_currentBid}c`);
    util.auctionlogit(`${main.state.bid_leader.name} wins the auction for ${main.state.bid_equipment.name} at a cost of ${main.state.bid_currentBid}c`);
    // console.log(`${main.state.bid_leader.name} wins the auction for ${main.state.bid_equipment.name} at a cost of ${main.state.bid_currentBid}c`)

    let player = main.state.bid_leader; // the winner
    let eq = main.state.bid_equipment;


    // process payment
    let discount = ai.getDiscount(player, eq);
    if (player.isYou){
        util.spendCards();// ?? only applies to me
    }
    else{
        let selectedCards = util.smartSelectCardsToPay(player, main.state.bid_currentBid - discount);
        console.log('selectedCards:', selectedCards)
        util.spendCards(selectedCards);
    }
    util.logit(`${player.name} spends ${main.state.bid_currentBid}c ${discount > 0 ? `(using discount of ${discount}c)`:''} to purchase ${eq.name}.`);
    document.getElementById('biddingEqUpForBidDesc--currentBid').innerHTML = `<span class="greenspan">${main.state.bid_leader.name} wins the auction for ${main.state.bid_equipment.name} at a cost of ${main.state.bid_currentBid}c! ${discount > 0 ? `(using discount of ${discount}c)`:''}</span>`;



    // process factoryUnlocks for player
    if (eq.name == 'Heavy Equipment'){
        player.isUnlocked_Ti = true;
        document.getElementById('pcardRow_Ti').classList.remove('hideme');
    }
    if (eq.name == 'Laboratory' || eq.name == 'Scientists'){
        player.isUnlocked_Re = true;
        document.getElementById('pcardRow_Re').classList.remove('hideme');
        player.isUnlocked_Nc = true;
        document.getElementById('pcardRow_Nc').classList.remove('hideme');
    }
    if (eq.name == 'Orbital Lab'){
        player.isUnlocked_Mi = true;
        document.getElementById('pcardRow_Mi').classList.remove('hideme');
    }

    // process benefits of purchased eq
    if (eq.name == 'Warehouse'){
        player.handLimit += 5;
    }
    if (eq.name == 'Nodule'){
        player.colonistMax += 3;
    }
    if (eq.name == 'Heavy Equipment'){
        player.discountOnNodule += 5;
        player.discountOnWarehouse += 5;
    }
    if (eq.name == 'Data Library'){
        player.discountOnScientist += 5;
        player.discountOnLaboratory += 5;
    }
    if (eq.name == 'Ecoplants'){
        player.discountOnColonists += 5;
    }
    if (eq.name == 'Ecoplants'){
        if (player.discountOnColonists < 5){
            player.discountOnColonists += 5;
        }
        player.discountOnOutpost += 10;
    }
    if (eq.name == 'Scientists'){
        player.factories.push(main.addFactory(player, 'ScientistsFactory'));
    }
    if (eq.name == 'Orbital Lab'){
        player.factories.push(main.addFactory(player, 'OrbitalLabFactory'));
    }
    if (eq.name == 'Robots'){
        player.robots++;
    }
    if (eq.name == 'Laboratory'){
        player.factories.push(main.addFactory(player, 'Re'));
    }
    if (eq.name == 'Outpost'){
        player.colonistMax += 5;
        player.handLimit += 5;
        player.factories.push(main.addFactory(player, 'Ti'));
    }
    if (eq.name == 'Space Station'){
        // player.factories.push(main.addFactory(player, 'OrbitalMedicineFactory'));
        player.factories.push(main.addFactory(player, 'Om'));
    }
    if (eq.name == 'Planetary Cruiser'){
        // player.factories.push(main.addFactory(player, 'RingOreFactory'));
        player.factories.push(main.addFactory(player, 'Ro'));
    }
    if (eq.name == 'Moonbase'){
        // player.factories.push(main.addFactory(player, 'MoonOreFactory'));
        player.factories.push(main.addFactory(player, 'Mo'));
    }


    // rebuild buySelect
    let me = util.getPlayerMe();

    let buySelect = document.getElementById('buySelect')
    let buySelectCode = `<select id="buySelect">
    <option value="colonist">colonist(10${me.discountOnColonists > 0 ? '->5': ''})</option>
    <option value="robot">robot (10)</option>
    <option value="factoryOr">factoryOr (10)</option>
    <option value="factoryWa">factoryWa (20)</option>`
    if (player.isYou && player.isUnlocked_Ti){
        buySelectCode += `<option value="factoryTi">factoryTi (30)</option>`
    }
    if (player.isYou && player.isUnlocked_Re){
        buySelectCode += `<option value="factoryRe">factoryRe (30)</option>`
    }
    // if (player.isYou && player.isUnlocked_Mi){
    //     buySelectCode += `<option value="factoryMi">factoryMi</option>`
    // }
    if (player.isYou && player.isUnlocked_Nc){
        buySelectCode += `<option value="factoryNc">factoryNc (60)</option>`
    }
    buySelectCode += `</select>`
    buySelect.innerHTML = buySelectCode;

    // var eqToRemoveIndex = main.state.eqUpForBidArray.indexOf(eq.name);
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
        let discountedPrice = null;
        if (eq.name === 'Nodule'){
            if (me.discountOnNodule > 0){
                discountedPrice = eq.price*1 - me.discountOnNodule*1;
            }
        }
        if (eq.name === 'Warehouse'){
            if (me.discountOnWarehouse > 0){
                discountedPrice = eq.price*1 - me.discountOnWarehouse*1;
            }
        }
        if (eq.name === 'Scientists'){
            if (me.discountOnScientist > 0){
                discountedPrice = eq.price*1 - me.discountOnScientist*1;
            }
        }
        if (eq.name === 'Laboratory'){
            if (me.discountOnLaboratory > 0){
                discountedPrice = eq.price*1 - me.discountOnLaboratory*1;
            }
        }
        if (eq.name === 'Outpost'){
            if (me.discountOnOutpost > 0){
                discountedPrice = eq.price*1 - me.discountOnOutpost*1;
            }
        }
        biddableSelectCode += `<option value="${eq.id}" data-discountedprice="${discountedPrice ? `${discountedPrice}` : `${eq.price}`}">${eq.name} (${eq.price}${discountedPrice ? `->${discountedPrice}` : ''})</option>`;
    })
    biddableSelectEl.innerHTML = biddableSelectCode;

    // let selectValue = biddableSelectEl.options[biddableSelectEl.selectedIndex].value;
    if (main.state.eqUpForBidArray.length > 0){
        let selectValue = biddableSelectEl.options[0].value;
        let selectedEq = util.getObjInHereWithValue(main.state.eqUpForBidArray, 'id', selectValue*1);
        document.getElementById('biddableInitialAmount').value = selectedEq.price;
    }


    

    // endBidding();
    // update VP and render
    main.calcVp();
    main.render();

    console.log('player:', player)

    main.state.bid_leader = null;
    main.state.bid_currentBid = null;
    main.state.bid_equipment = null;

    // for faster testing only (remove later TODO:)
    // document.getElementById('overviewViewBtn').click();
}

function updateUI(){
    let biddingPlayerListAreaCode = '';
    main.state.playerIdsBySeatArray.map(id => {
        let player = util.getPlayerById(id);
        biddingPlayerListAreaCode += buildBidderBoxDisplay(player)
    })
    document.getElementById('biddingPlayerListArea').innerHTML = biddingPlayerListAreaCode;

    function buildBidderBoxDisplay(player){
        const code = `
        <div class="biddingPlayerBox">
            <div class="biddingPlayerBox--nameLabel">${player.name}<sup>${player.seat+1}</sup></div>
            <div class="biddingPlayerBox--statusHeader">${player.bidStatus}${player.bidStatus == 'leading' ? ' <i class="far fa-flag"></i>' : ''}...</div>
            <div class="biddingPlayerBox--flag">
                ${(player.isYou && !isAuctionDone()) ? '<strong>decide now!</strong>' : ''}
                ${player.bidStatus == 'leading' ? main.state.bid_currentBid+'c' : ''}
            </div>
        </div>
        `;
        return code;
    }

    document.getElementById('biddingEqUpForBidDesc--desc').innerHTML = main.state.bid_equipment.desc;
    document.getElementById('biddingEqUpForBidDesc--currentBid').innerHTML = `Current bid ${main.state.bid_currentBid}c by ${main.state.bid_leader.name}`;
    document.getElementById('newBidAmountInput').value = main.state.bid_currentBid*1+1;
}