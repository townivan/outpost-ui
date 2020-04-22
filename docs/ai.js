import * as main from './main.js';
import * as util from './util.js';
import * as turn from './turn.js';
import * as auction from './auction.js';

export function startAiTurn(player){
    console.log('welcome to startAiTurn(player) :', player)

    // a turn could take actions that come back after a delay, like bidding.
    // so handle multiple turn actions before ending turn.

    // bids come first

    // decide if willing to start a bid
    console.log('the following eq is up for bid:', main.state.eqUpForBidArray)
    let turnActionDecision = makeTurnActionDecision(player); // decision = { isBidTime:true, eqToBidOn:{}, isBuyTime:false, isSaveTime:false }
    console.log('turnActionDecision:', turnActionDecision)

    if (turnActionDecision.isBidTime){
        initAuctionFromAi(player, turnActionDecision.eqToBidOn)
    }

    if (turnActionDecision.isBuyTime){
        console.log('TODO: handle buyTime...for now just endTurn...')
        turn.endTurn(player);
    }

    if (turnActionDecision.isSaveTime){
        turn.endTurn(player);
    }

    /*
    // buy a colonist if possible otherwise pass
    let playerMaxAvailable = util.getMaxHandValue(player);
    let unitPrice = 10; // default colonist cost
    if (player.discountOnColonists > 0) { unitPrice = 5; }

    let isUnderColonistMax = false;
    if (player.colonist < player.colonistMax){
        isUnderColonistMax = true;
    }

    let isAffordable = false;
    if (playerMaxAvailable >= unitPrice){
        isAffordable = true;
    }

    // randomly decide to buy a colonist or not
    // util.randomIntFromInterval(min, max) or util.randomBool()
    let isRandomTrueFalse = util.randomBool();
    
    if (!isAffordable){
        console.log(`${player.name} can't afford to buy a colonist this turn.`)
    }
    if (isAffordable && !isRandomTrueFalse){
        console.log(`${player.name} can afford it but decides not to buy a colonist this turn.`)
    }

    if (isUnderColonistMax && isAffordable && isRandomTrueFalse){
        console.log(`${player.name} can afford it and decides to buy a colonist on their turn.`)
        turn.buyColonists(player, 1);
        turn.endTurn(player); // just 1 is good enough for now.:)
    }
    else{
        turn.endTurn(player); // don't buy.  might be for any of the above reasons
    }
    */
}

export function makeTurnActionDecision(player){
    console.log(`welcome to makeTurnActionDecision(player=${player.name})`)
    const decision = { isBidTime:false, eqToBidOn:null, isBuyTime:false, isSaveTime:false };
    let isAnyEqAvail = false;
    let isAnyEqAffordable = false;
    const affordableEq = [];
    let playerMaxAvailable = util.getMaxHandValue(player);
    console.log('playerMaxAvailable:', playerMaxAvailable)

    if (main.state.eqUpForBidArray.length > 0){
        isAnyEqAvail = true;
        console.log('there appears to be eq available...')
    }
    main.state.eqUpForBidArray.map(eq => {
        let discount = getDiscount(player, eq);
        if (playerMaxAvailable >= (eq.price - discount)){
            isAnyEqAffordable = true;
            affordableEq.push(eq)
        }
    })
    console.log('affordableEq:', affordableEq)

    const randomChoice = util.randomIntFromInterval(1, 3); // 1-3; 1=bidTime, 2=buyTime, 3=saveTime
    console.log('randomChoice:', randomChoice);
    let doIWantToBid = false;
    let doIWantToBuy = false;
    let doIWantToSave = false;
    if (randomChoice == 1){ console.log(`it's bidTime!`); doIWantToBid = true; }
    if (randomChoice == 2){ console.log(`it's buyTime!`); doIWantToBuy = true; }
    if (randomChoice == 3){ console.log(`it's saveTime!`); doIWantToSave = true; }

    if (doIWantToBid){
        if (isAnyEqAffordable){
            let randomIndex = util.randomIntFromInterval(0, affordableEq.length-1);
            decision.isBidTime = true;
            decision.eqToBidOn = affordableEq[randomIndex];
        }
        else{
            decision.isSaveTime = true; // I want to bid but no cash
        }
    }
    if (doIWantToBuy){
        decision.isBuyTime = true;
    }
    if (doIWantToSave){
        decision.isSaveTime = true;
    }
    return decision;

}

function initAuctionFromAi(player, eq){
    console.log(`%c Welcome to initAuctionFromAi(player=${player.name}, eq=${eq.name})`, 'background-color:yellow;')
    document.getElementById('auctionViewBtn').click();
    main.state.bid_leader = player;
    main.state.bid_currentBid = eq.price;
    main.state.bid_equipment = eq;
    main.state.players.map(player => player.bidStatus = "waiting")
    player.bidStatus = "leading";
    main.state.bid_actionCount = 1;
    main.state.bid_playerWhoStartedIt = player;
    document.getElementById('auctionLog').innerHTML = '';
    let auctionInputs = [...document.querySelectorAll('.auctionInputToggle')]
    auctionInputs.map(el => el.disabled = false);
    util.auctionlogit(`${player.name} starts an auction for ${main.state.bid_equipment.name} with a bid of ${eq.price}.`);
    util.logit(`${player.name} starts an auction for ${main.state.bid_equipment.name} with a bid of ${eq.price}.`);
    auction.considerBid(player.playerSeatedAfterMe);
}


export function makeAuctionDecision(player){
    console.log('welcome to makeAuctionDecision()')
    let playerMaxAvailable = util.getMaxHandValue(player);
    console.log(`At best, ${player.name} could bid ${playerMaxAvailable}.`)
    // console.log(`The current bid is ${main.state.bid_currentBid}.`)
    // console.log('player.ai_setting:', player.ai_setting)

    // do they even have enough to counterBid?
    let eq = main.state.bid_equipment;
    let discount = getDiscount(player, eq); // not used to change the bid, just to check if bid is valid
    console.log(`${player.name}'s discount for ${eq.name} is ${discount}`);
    let minForACounterBid = main.state.bid_currentBid + 1;

    if(playerMaxAvailable >= (minForACounterBid - discount)){

        // never start their own bid...for now...
        // auction.passBid(player, 'pass');

        if (player.ai_setting === 'easy'){
            // always tries to win the bid
            console.log('player.cards:', player.cards)
            console.log(`${player.name} plans to select ${minForACounterBid} from their cards...`)
            auction.counterBid(player, minForACounterBid) // if possible, will always counter-bid
        }
        else if (player.ai_setting === 'medium'){
            auction.passBid(player, 'pass');
        }
        else if (player.ai_setting === 'hard'){
            auction.passBid(player, 'pass');
        }
        else if (player.ai_setting === 'random'){
            auction.passBid(player, 'pass');
        }
        else if (player.ai_setting === 'alwayspass'){
            auction.passBid(player, 'pass');
        }
        else{
            console.log('%c something is wrong in ai.makeAuctionDecision()...player.ai_setting got past if statements!', 'background-color:red; color:white;')
            console.log('player:', player);
        
        }

    }
    else{ 
        console.log(`${player.name} decides not to bid...because of insufficient funds.`)
        // util.logit(`${player.name} decides not to counter bid...because of insufficient funds.`);
        auction.passBid(player, 'pass');
    }
    
}

export function getDiscount(player, eq){
    let discount = 0;
    if (eq.name === 'Nodule'){
        discount = player.discountOnNodule*1;
    }
    if (eq.name === 'Warehouse'){
        discount = player.discountOnWarehouse*1;
    }
    if (eq.name === 'Scientists'){
        discount = player.discountOnScientist*1;
    }
    if (eq.name === 'Laboratory'){
        discount = player.discountOnLaboratory*1;
    }
    if (eq.name === 'Outpost'){
        discount = player.discountOnOutpost*1;
    }
    return discount;
}






export function considerBidAi(player){
    console.log('%cwelcome to considerBidAi(player)...', 'color:green', player)

    let playerMaxAvailable = util.getMaxHandValue(player);
    console.log(`At best, ${player.name} could bid ${playerMaxAvailable}.`)
    console.log(`The current bid is ${main.state.bid_currentBid}.`)
    
    // randomly decide to bid or not (if able)
    if(playerMaxAvailable > main.state.bid_currentBid){

        if (player.ai_setting === 'easy'){
            console.log(`${player.name} really wants to bid. (easy)`)
            aiMakeCounterBid(player, main.state.bid_currentBid+1)
        }
        if (player.ai_setting === 'medium'){
            console.log(`${player.name} wants to pass. (medium)`)
        }
        if (player.ai_setting === 'hard'){
            console.log(`${player.name} wants to pass. (hard)`)
        }
        if (player.ai_setting === 'random'){
            console.log(`${player.name} wants to pass. (random)`)
        }
        if (player.ai_setting === 'passall'){
            console.log(`${player.name} wants to pass. (passall)`)
        }

        // if (util.randomBool()){
        // if (1==1){ // temp make all counter bid
        //     console.log(`${player.name} randomly wants to bid.`)
        //     aiMakeCounterBid(player, main.state.bid_currentBid+1)
        // }
        // else{
        //     console.log(`${player.name} randomly wants to pass.`)
        // }
    }
    else{
        console.log(`${player.name} decides not to bid...because of insufficient funds.`)
        // util.logit(`${player.name} decides not to counter bid...because of insufficient funds.`);
        player.bidStatus = "passed";
    }

    // let's start by assuming they will always pass
    

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

// TODO: aiStardBid() ... deciding to start a bid for eq that he wants

export function aiMakeCounterBid(player, bidAmt){
    console.log('welcome to aiMakeCounterBid(player, bidAmt)...')
    console.log('player:', player)
    console.log('bidAmt:', bidAmt)

    // let selectedCards = util.smartSelectCardsToPay(player, main.state.bid_currentBid+1);
    // console.log('selectedCards:', selectedCards);

    // // since the logic to select cards is not optimized, see how much is really in the selected cards..(it's likely higher)
    // let realBidAmt = 0;
    // selectedCards.map(card => {
    //     realBidAmt += card.value;
    // })

    // console.log('realBidAmt:', realBidAmt)

    main.state.bid_players.map(player =>{
        player.bidStatus = "awaiting";
    })
    player.bidStatus = "leader";

    main.state.bid_round++;
    main.state.bid_leader = player;
    main.state.bid_currentBid = bidAmt;
    util.logit(`${player.name} counterbids ${bidAmt} for ${main.state.bid_equipment.name}.`);
    bid.considerBid(player.playerSeatedAfterMe)
}