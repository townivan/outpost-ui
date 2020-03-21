import * as main from './main.js';
import * as util from './util.js';
import * as turn from './turn.js';

export function initialize() {
    util.logit('Game initialization.');

    main.state.players.push(main.addPlayer('Ivan'));
    main.state.players[0].isYou = true;
    main.state.players.push(main.addPlayer('Jason'));
    main.state.players[1].vp = 4; // testing
    main.state.players.push(main.addPlayer('Calvin'));
    main.state.players.push(main.addPlayer('Gabriel'));

    main.state.currentPlayerNumber = main.state.players[0].turnOrder;

    // initial draws
    main.state.players.map(player => {
        initialdraw(player);
    })

    main.state.eqMax = main.state.players.length - 1
    main.state.equipment.map(eq => {
        eq.amount = main.state.eqMax;
    })

    // turn.replaceEquipment();

       
    util.logit('Replace purchased colony upgrade cards (complete)');
    util.logit('Distribute production cards (complete)');
    util.logit('Discard excess production cards (n/a)');
    util.logit(`Perform player actions...awaiting player(${util.getPlayerByTurnOrder(main.state.currentPlayerNumber).name})`);

}


// happens during addPlayer() in main...
export function initialdraw(player) {
    let newCard = null;

    // newCard = main.drawCard('Or'); player.cards.push(newCard); if (player.isYou) {util.logit(`You draw ${newCard.cardType}:${newCard.value}`); }
    privateDrawFunction(player, 'Or');
    privateDrawFunction(player, 'Or');
    privateDrawFunction(player, 'Or');
    privateDrawFunction(player, 'Or');
    privateDrawFunction(player, 'Wa');
    privateDrawFunction(player, 'Wa');

    // player.cards.push(main.drawCard('Or'));
    // player.cards.push(main.drawCard('Or'));
    // player.cards.push(main.drawCard('Or'));
    // player.cards.push(main.drawCard('Or'));
    // player.cards.push(main.drawCard('Wa'));
    // player.cards.push(main.drawCard('Wa'));

    player.factories.push(main.addFactory('Or'));
    player.factories.push(main.addFactory('Or'));
    player.factories.push(main.addFactory('Wa'));
    player.factories.map(factory => {
        factory.isManned = true;
    })

    function privateDrawFunction(player, type){
        // console.log('privateDrawFunction...')
        // console.log('player:', player)
        let newCard = null;
        newCard = main.drawCard(type); 
        player.cards.push(newCard); 
        if (player.isYou) {
            util.logit(`You draw ${newCard.cardType}:${newCard.value}`); 
        }
    }
}

