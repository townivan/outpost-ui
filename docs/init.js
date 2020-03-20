import * as main from './main.js';
import * as util from './util.js';

export function initialize() {
    main.state.players.push(addPlayer('Ivan'));
    main.state.players.push(addPlayer('Jason'));
    main.state.players.push(addPlayer('Calvin'));
    main.state.players.push(addPlayer('Gabriel'));

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
}

export function addPlayer(name = 'Larry') {
    let p = {};
    p.name = name;
    p.id = main.state.playerIdSeed;
    main.state.playerIdSeed++;
    p.cards = [];
    p.vp = 3;
    p.handLimit = 10;
    p.colonist = 3;
    p.colonistMax = 5;
    p.robots = 0;
    p.factories = [];
    p.turnOrder = 0;

    p.updateFactoryCounts = function () {
        let OrCount = 0;
        let OrManned = 0;

        let WaCount = 0;
        let WaManned = 0;

        let TiCount = 0;
        let TiManned = 0;

        this.factories.map(factory => {
            if (factory.type === "Or") {
                OrCount++;
                if (factory.isManned) { OrManned++; }
            }
            if (factory.type === "Wa") {
                WaCount++;
                if (factory.isManned) { WaManned++; }
            }
            if (factory.type === "Ti") {
                TiCount++;
                if (factory.isManned) { TiManned++; }
            }
        })
        this.OrCount = OrCount;
        this.OrManned = OrManned;

        this.WaCount = WaCount;
        this.WaManned = WaManned;

        this.TiCount = TiCount;
        this.TiManned = TiManned;
    }
    p.dataLibraryCount = 0;
    p.warehouseCount = 0;
    p.heavyEquipmentCount = 0;
    p.noduleCount = 0;

    initialdraw(p);
    return p;
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

