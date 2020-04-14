import * as main from './main.js';
import * as util from './util.js';
import * as turn from './turn.js';
import * as auction from './auction.js';

export function startAiTurn(player){
    console.log('welcome to startAiTurn(player) :', player)
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

    if (isAffordable && isRandomTrueFalse){
        console.log(`${player.name} can afford it and decides to buy a colonist on their turn.`)
        turn.buyColonists(player, 1);
        turn.endTurn(player); // just 1 is good enough for now.:)
    }
    else{
        turn.endTurn(player); // don't buy.  might be for either reason
    }
}


export function makeAuctionDecision(player){
    console.log('welcome to makeAuctionDecision()')
    let playerMaxAvailable = util.getMaxHandValue(player);
    console.log(`At best, ${player.name} could bid ${playerMaxAvailable}.`)
    // console.log(`The current bid is ${main.state.bid_currentBid}.`)
    // console.log('player.ai_setting:', player.ai_setting)

    // do they even have enough to counterBid?
    if(playerMaxAvailable > main.state.bid_currentBid){

        // never start their own bid...for now...
        // auction.passBid(player, 'pass');

        if (player.ai_setting === 'easy'){
            // always tries to win the bid
            let selectedCards = util.stupidSelectCardsToPay(player, main.state.bid_currentBid+1);
            // since the logic to select cards is not optimized, see how much is really in the selected cards..(it's likely higher)
            let realBidAmt = 0;
            selectedCards.map(card => {
                realBidAmt += card.value;
            })
            auction.counterBid(player, realBidAmt) // if possible, will always counter-bid
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

    // let selectedCardsCloned = util.stupidSelectCardsToPay(player, main.state.bid_currentBid+1);
    let selectedCards = util.stupidSelectCardsToPay(player, main.state.bid_currentBid+1);
    console.log('selectedCards:', selectedCards);

    // since the logic to select cards is not optimized, see how much is really in the selected cards..(it's likely higher)
    let realBidAmt = 0;
    selectedCards.map(card => {
        realBidAmt += card.value;
    })

    console.log('realBidAmt:', realBidAmt)

    main.state.bid_players.map(player =>{
        player.bidStatus = "awaiting";
    })
    player.bidStatus = "leader";

    main.state.bid_round++;
    main.state.bid_leader = player;
    main.state.bid_currentBid = realBidAmt;
    util.logit(`${player.name} counterbids ${realBidAmt} for ${main.state.bid_equipment.name}.`);
    bid.considerBid(player.playerSeatedAfterMe)
}