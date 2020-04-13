import * as main from './main.js';
import * as util from './util.js';
import * as turn from './turn.js';

export function initialize() {
    util.logit('Game initialization.');

    // reset anything from a previous game (due to restart from settings)
    let numberOfAiPlayers = document.querySelector('input[name="aiPlayerAmountRadio"]:checked').dataset.number*1;
    console.log('numberOfAiPlayers:', numberOfAiPlayers)
    let calcEra3Trigger = null;
    if (numberOfAiPlayers === 5 || numberOfAiPlayers === 8){
        calcEra3Trigger = 30;
    }
    if (numberOfAiPlayers === 3 || numberOfAiPlayers === 6 || numberOfAiPlayers === 9){
        calcEra3Trigger = 35;
    }
    if (numberOfAiPlayers === 2 || numberOfAiPlayers === 4 || numberOfAiPlayers === 7){
        calcEra3Trigger = 40;
    }

    main.state.playerIdSeed = 0;
    main.state.players.length = 0;
    main.state.seatSeed = 0;
    main.state.cardIdSeed = 0;
    main.state.factoryIdSeed = 0;
    main.state.localPlayerId = 0;
    main.state.era2Trigger = 10;
    main.state.era3Trigger = calcEra3Trigger;
    main.state.round = 1;
    main.state.currentPlayerNumber = null;
    main.state.currentEra = 1;
    main.state.eqMax = null;
    main.state.equipment.length = 0;
    main.state.equipmentIdSeed = 0;
    main.state.eqUpForBidArray.length = 0;
    main.state.playerIdsBySeatArray.length = 0;
    main.state.bid_currentBid = null;
    main.state.bid_leader = null;
    main.state.bid_equipment = null;
    main.state.bid_actionCount = 1;


    // load initial players
    main.state.players.push(main.addPlayer(document.getElementById("playerName").value));
    main.state.players[0].isYou = true;

    if (numberOfAiPlayers >= 1){ main.state.players.push(main.addPlayer(document.getElementById('aiDisplayName1').innerHTML)); }
    if (numberOfAiPlayers >= 2){ main.state.players.push(main.addPlayer(document.getElementById('aiDisplayName2').innerHTML)); }
    if (numberOfAiPlayers >= 3){ main.state.players.push(main.addPlayer(document.getElementById('aiDisplayName3').innerHTML)); }
    if (numberOfAiPlayers >= 4){ main.state.players.push(main.addPlayer(document.getElementById('aiDisplayName4').innerHTML)); }
    if (numberOfAiPlayers >= 5){ main.state.players.push(main.addPlayer(document.getElementById('aiDisplayName5').innerHTML)); }
    if (numberOfAiPlayers >= 6){ main.state.players.push(main.addPlayer(document.getElementById('aiDisplayName6').innerHTML)); }
    if (numberOfAiPlayers >= 7){ main.state.players.push(main.addPlayer(document.getElementById('aiDisplayName7').innerHTML)); }
    if (numberOfAiPlayers >= 8){ main.state.players.push(main.addPlayer(document.getElementById('aiDisplayName8').innerHTML)); }
   
    // main.state.players.push(main.addPlayer(document.getElementById('aiDisplayName2').innerHTML));
    // main.state.players.push(main.addPlayer(document.getElementById('aiDisplayName3').innerHTML));

    // after players are setup...
    let me = util.getPlayerMe();

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
    document.getElementById('era3TriggerDisplay').innerHTML = main.state.era3Trigger;

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

    // firstTurnHandForWaterBtn
    let myMaxFirstHand = util.getMaxHandValue(me)
    if (myMaxFirstHand < 20){
        document.getElementById('firstTurnHandForWaterBtn').classList.remove('hideme');
    }

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

