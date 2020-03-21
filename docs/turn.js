import * as main from './main.js';
import * as util from './util.js';



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
    console.log('this player is ending their turn...', player);
    util.logit(`${player.name} ends their turn.`);
    player.isAwaitingTurn = false;

    if (player.turnOrder == main.state.players.length) {
        // end the round!
        console.log('end the round!');
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
    console.log('welcome to determinePlayerOrder()...')
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
        util.shuffleArray(group)
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

}
export function distributeProductionCards(){
    console.log('welcome to distributeProductionCards()...');
    
    main.state.players.map(player => {
        console.log('player:', player)
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
        //console.log(`the handweight for ${player.name} is ${handWeight}`);
        //console.log(main.state)
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
            console.log('shiftCount:', shiftCount)
            // remove shiftCount items from the start of the array
            for (let i=0; i<shiftCount; i++){
                player.cards.shift(); 
            }
            
            console.log('cards: ', player.cards)

        }
    })
    main.render();
}

