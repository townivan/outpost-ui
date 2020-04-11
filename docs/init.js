import * as main from './main.js';
import * as util from './util.js';
import * as turn from './turn.js';

export function initialize() {
    util.logit('Game initialization.');

    // main.state.players.push(main.addPlayer('Ivan'));
    // main.state.players[0].isYou = true;
    // main.state.players[0].robotsEqCount = 1; // testing
    main.state.players.push(main.addPlayer('Jason'));
    // main.state.players[1].vp = 4; // testing
    // main.state.players[1].robotsEqCount = 1; // testing
    main.state.players.push(main.addPlayer('Calvin'));
    main.state.players.push(main.addPlayer('Ivan'));
    main.state.players[2].isYou = true;
    main.state.players.push(main.addPlayer('Gabriel'));

    // set era3 trigger based on number of players
    if (main.state.players.length == 5 || main.state.players.length == 8){
        main.state.era3Trigger = 30;
    }
    if (main.state.players.length == 3 || main.state.players.length == 6 || main.state.players.length == 9){
        main.state.era3Trigger = 35;
    }
    if (main.state.players.length == 2 || main.state.players.length == 4 || main.state.players.length == 7){
        main.state.era3Trigger = 40;
    }
    

    main.state.currentPlayerNumber = main.state.players[0].turnOrder;

    // initial draws
    main.state.players.map((player,i) => {
        initialdraw(player);
        main.state.playerIdsBySeatArray.push(player.seat); // save the inital player seat order
        // set playerSeatedAfterMe for bidding
        if (i < main.state.players.length-1){
            player.playerSeatedAfterMe = main.state.players[i+1]
        }
        else{
            // last one, next = first
            player.playerSeatedAfterMe = main.state.players[0]
        }
    })

    main.state.eqMax = main.state.players.length - 1
    // main.state.equipment.map(eq => {
    //     eq.amount = main.state.eqMax;
    // })
    main.state.equipmentSeed.map(eqObj => {
        let arr = []
        for (let x=0; x<main.state.eqMax; x++){
            let eqFromTemplateSeed = JSON.parse(JSON.stringify(eqObj))
            eqFromTemplateSeed.id = main.state.equipmentIdSeed;
            main.state.equipmentIdSeed++;
            arr.push(eqFromTemplateSeed)
        }
        main.state.equipment.push(arr);
    })
    // console.log('initial seed for equipment complete:', main.state.equipment)

       
    util.logit('Replace purchased colony upgrade cards (complete)');
    util.logit('Distribute production cards (complete)');
    util.logit('Discard excess production cards (n/a)');
    // util.logit(`Perform player actions...awaiting player(${util.getPlayerByTurnOrder(main.state.currentPlayerNumber).name})`);
    // util.logit(`Perform player actions...awaiting player(${main.state.players[0].name})`);
}


// happens during addPlayer() in main...
export function initialdraw(player) {
    privateDrawFunction(player, 'Or');
    privateDrawFunction(player, 'Or');
    privateDrawFunction(player, 'Or');
    privateDrawFunction(player, 'Or');
    privateDrawFunction(player, 'Wa');
    privateDrawFunction(player, 'Wa');

    // if (player.isYou) {
    //     console.table(player.cards)
    // }

    player.factories.push(main.addFactory(player, 'Or'));
    player.factories.push(main.addFactory(player, 'Or'));
    player.factories.push(main.addFactory(player, 'Wa'));
    // player.factories.map(factory => {
    //     factory.isManned = true;
    // })

    function privateDrawFunction(player, type){
        let newCard = null;
        newCard = main.drawCard(type, player.id); 
        player.cards.push(newCard); 
        if (player.isYou) {
            util.logit(`You draw ${newCard.cardType}:${newCard.value}`); 
        }
    }
}

