import * as main from './main.js';
import * as util from './util.js';
import * as turn from './turn.js';

export function initialize() {
    main.state.players.push(main.addPlayer('Ivan'));
    main.state.players[0].isYou = true;
    main.state.players.push(main.addPlayer('Jason'));
    main.state.players[1].vp = 4; // testing
    main.state.players.push(main.addPlayer('Calvin'));
    main.state.players.push(main.addPlayer('Gabriel'));

    /*
    // establish turnOrder
    let arrayOfPlayers = [];
    main.state.players.map(player => {
        arrayOfPlayers.push(player.id);
    })
    util.shuffleArray(arrayOfPlayers);
    console.log('arrayOfPlayers:', arrayOfPlayers);

    // assign the randomized turnOrders to each player
    main.state.players.map((player, i) => {
        player.turnOrder = arrayOfPlayers[i] + 1;
    })

    // sort the players by their randomized turnOrder
    main.state.players.sort(util.compareValues('turnOrder'));

    main.state.currentPlayerNumber = main.state.players[0].turnOrder;
    */

    main.state.currentPlayerNumber = main.state.players[0].turnOrder;

    main.state.eqMax = main.state.players.length - 1
    main.state.equipment.map(eq => {
        eq.amount = main.state.eqMax;
    })

    turn.replaceEquipment();



    util.logit('Game initialization.');
    
    util.logit('Replace purchased colony upgrade cards (complete)');
    util.logit('Distribute production cards (complete)');
    util.logit('Discard excess production cards (n/a)');
    util.logit(`Perform player actions...awaiting player(${util.getPlayerByTurnOrder(main.state.currentPlayerNumber).name})`);

}


export function initialdraw(player) {
    player.cards.push(main.drawCard('Or'));
    player.cards.push(main.drawCard('Or'));
    player.cards.push(main.drawCard('Or'));
    player.cards.push(main.drawCard('Or'));
    player.cards.push(main.drawCard('Wa'));
    player.cards.push(main.drawCard('Wa'));

    player.factories.push(main.addFactory('Or'));
    player.factories.push(main.addFactory('Or'));
    player.factories.push(main.addFactory('Wa'));
    player.factories.map(factory => {
        factory.isManned = true;
    })
}

