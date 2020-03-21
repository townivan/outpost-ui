import * as events from './events.js';
import * as util from './util.js';
import * as init from './init.js';
import * as turn from './turn.js';

// or=Ore wa=Water ti=Titanium re=Research mi=Microbiotics nc=New_Chemicals om=Orbital_Medicine ro=Ring_Ore mo=Moon_Ore
export const state = {
    playerIdSeed: 0,
    players: [],
    cardIdSeed: 0,
    localPlayerId: 0,
    era2Trigger: 10,
    era3Trigger: 35,
    round: 1,
    currentPlayerNumber: null,
    currentEra: 1,
    eqMax: null,
    equipment: [
        { id: 0, name: "Data Library", price: 15, era: 1, vp: 1, amount: 0, isUpForBid: false, },
        { id: 1, name: "Warehouse", price: 25, era: 1, vp: 1, amount: 0, isUpForBid: false, },
        { id: 3, name: "Heavy Equipment", price: 30, era: 1, vp: 1, amount: 0, isUpForBid: false, },
        { id: 4, name: "Nodule", price: 25, era: 1, vp: 2, amount: 0, isUpForBid: false, },
        { id: 5, name: "Scientists", price: 40, era: 2, vp: 2, amount: 0, isUpForBid: false, },
        { id: 6, name: "Orbital Lab", price: 50, era: 2, vp: 3, amount: 0, isUpForBid: false, },
        { id: 7, name: "Robots", price: 50, era: 2, vp: 3, amount: 0, isUpForBid: false, },
        { id: 8, name: "Laboratory", price: 80, era: 2, vp: 5, amount: 0, isUpForBid: false, },
        { id: 9, name: "Ecoplants", price: 30, era: 2, vp: 5, amount: 0, isUpForBid: false, },
        { id: 10, name: "Outpost", price: 100, era: 2, vp: 5, amount: 0, isUpForBid: false, },
        { id: 11, name: "Space Station", price: 120, era: 3, vp: 10, amount: 0, isUpForBid: false, },
        { id: 12, name: "Planetary Cruiser", price: 160, era: 3, vp: 15, amount: 0, isUpForBid: false, },
        { id: 13, name: "Moonbase", price: 200, era: 3, vp: 20, amount: 0, isUpForBid: false, },
    ], // seed this during init  {name:"Data Library", price:15, era:1, vp:1, available:3, id=0}, {}
    eqUpForBidArray: [],
};

init.initialize();
events.firstInit();
console.log(state)
render();

turn.startRound();

// Sequence of play each round:
// 1. determine player order
// 2. replace purchased colony upgrade cards (equipment)
// 3. distribute production cards
// 4. discard excess production cards
// 5. perform player turns
// 6. check for victory

// Player turn actions:
// 1. bid on colony upgrade cards (optional)
// 2. purchase factories (optional)
// 3. purchase and assign colonists and/or robots (optional)
// 4. end turn

export function addPlayer(name = 'Larry') {
    let p = {};
    p.isYou = false;
    p.name = name;
    p.id = state.playerIdSeed;
    state.playerIdSeed++;
    p.cards = [];
    p.vp = 3;
    p.handLimit = 10;
    p.colonist = 3;
    p.colonistMax = 5;
    p.robots = 0;
    p.factories = [];
    p.turnOrder = 0;
    p.isAwaitingTurn = true;

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

    init.initialdraw(p);
    return p;
}

export function render() {
    let cardsMax = 0;
    let onlyCards_or = [];
    let onlyCards_wa = [];
    let allCardCode_or = '';
    let allCardCode_wa = '';
    state.players[0].cards.map(card => {
        cardsMax += card.value;
        // render cards...
        if (card.cardType === 'Or') {
            onlyCards_or.push(card);
        }
        if (card.cardType === 'Wa') {
            onlyCards_wa.push(card);
        }
    })

    onlyCards_or.sort(util.compareValues('value'));
    onlyCards_or.map(card => {
        // const code = `<button type="button" class="pcard pcard_or" value="${card.value}">${card.value}</button>`;
        const code = `<button class="pcard pcard_or" value="${card.value}" data-id="${card.id}"><input type="checkbox" class="cb1" tabindex="-1" />${card.value}</button>`;
        allCardCode_or += code;
    })

    onlyCards_wa.sort(util.compareValues('value'));
    onlyCards_wa.map(card => {
        // const code = `<button type="button" class="pcard pcard_wa" value="${card.value}">${card.value}</button>`;
        const code = `<button class="pcard pcard_wa" value="${card.value}"><input type="checkbox" class="cb1" tabindex="-1" />${card.value}</button>`;
        allCardCode_wa += code;
    })

    document.getElementById('pCardRenderInsertionPoint_or').innerHTML = allCardCode_or;
    document.getElementById('pCardRenderInsertionPoint_wa').innerHTML = allCardCode_wa;

    document.getElementById('cardsMax').innerHTML = cardsMax.toString();

    events.initCardListeners();
    events.calcProductionCardSelection();

    // render overviewPanel
    let allOverViewCode = `<div id="availableEq">Eq up for bid: ${state.eqUpForBidArray.toString()}</div>`;
    let rowCode = ``;

    rowCode = `<div class="rowOverview">`;
    rowCode += `<div class="overviewCol1">Player(TurnOrder)</div>`;
    state.players.map(player => {
        player.updateFactoryCounts();
        rowCode += `<div class="overviewColx">${player.name} (${player.isAwaitingTurn ? player.turnOrder : 'X'})</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;

    rowCode = `<div class="rowOverview">`;
    rowCode += `<div class="overviewCol1">Victory Points</div>`;
    state.players.map(player => {
        rowCode += `<div class="overviewColx">${player.vp}vp</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;

    rowCode = `<div class="rowOverview">`;
    rowCode += `<div class="overviewCol1">Cards</div>`;
    state.players.map(player => {
        rowCode += `<div class="overviewColx">${player.cards.length} of ${player.handLimit}</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;

    rowCode = `<div class="rowOverview">`;
    rowCode += `<div class="overviewCol1">Cards by type</div>`;
    state.players.map(player => {
        let countOr = 0;
        let countWa = 0;
        let countTi = 0;
        player.cards.map(card => {
            if (card.cardType === 'Or') { countOr++; }
            if (card.cardType === 'Wa') { countWa++; }
            if (card.cardType === 'Ti') { countTi++; }
        })
        rowCode += `<div class="overviewColx">
        ${countOr > 0 ? `<span class="bgOrBorder">${countOr}</span>` + '<span class="bgOr bgOrBorder">Or</span>' : ''} 
        ${countWa > 0 ? `<span class="bgWaBorder">${countWa}</span>` + '<span class="bgWa bgWaBorder">Wa</span>' : ''}
        ${countWa > 0 ? `<span class="bgTiBorder">${countTi}</span>` + '<span class="bgTi bgTiBorder">Ti</span>' : ''}
        </div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;

    rowCode = `<div class="rowOverview">`;
    rowCode += `<div class="overviewCol1">Colonist</div>`;
    state.players.map(player => {
        rowCode += `<div class="overviewColx">${player.colonist} of ${player.colonistMax} <i class="fas fa-users"></i></div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;

    rowCode = `<div class="rowOverview">`;
    rowCode += `<div class="overviewCol1">Robots</div>`;
    state.players.map(player => {
        rowCode += `<div class="overviewColx">${player.robots} of ${player.colonistMax} <i class="fas fa-robot"></i></div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;


    rowCode = `<div class="rowOverview">`;
    rowCode += `<div class="overviewCol1">Factories - <span class="bgOrBorder">Or</span></div>`;
    state.players.map(player => {
        rowCode += `<div class="overviewColx bgOrBorder">${player.OrManned} of ${player.OrCount}</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;


    rowCode = `<div class="rowOverview">`;
    rowCode += `<div class="overviewCol1">Factories - <span class="bgWaBorder">Wa</span></div>`;
    state.players.map(player => {
        rowCode += `<div class="overviewColx bgWaBorder">${player.WaManned} of ${player.WaCount}</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;


    rowCode = `<div class="rowOverview">`;
    rowCode += `<div class="overviewCol1">Factories - <span class="bgTiBorder">Ti</span></div>`;
    state.players.map(player => {
        rowCode += `<div class="overviewColx bgTiBorder">${player.TiManned} of ${player.TiCount}</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;


    // now for equipment...

    rowCode = `<div class="rowOverview">`;
    rowCode += `<div class="overviewCol1">Data Library (2 left)</div>`;
    state.players.map(player => {
        rowCode += `<div class="overviewColx">${player.dataLibraryCount}</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;


    rowCode = `<div class="rowOverview">`;
    rowCode += `<div class="overviewCol1">Warehouse (2 left)</div>`;
    state.players.map(player => {
        rowCode += `<div class="overviewColx">${player.warehouseCount}</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;


    rowCode = `<div class="rowOverview">`;
    rowCode += `<div class="overviewCol1">Heavy Equipment (2 left)</div>`;
    state.players.map(player => {
        rowCode += `<div class="overviewColx">${player.heavyEquipmentCount}</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;


    rowCode = `<div class="rowOverview">`;
    rowCode += `<div class="overviewCol1">Nodule (2 left)</div>`;
    state.players.map(player => {
        rowCode += `<div class="overviewColx">${player.noduleCount}</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;


    // now for general stats...

    rowCode = `<div class="rowOverview">`;
    rowCode += `<div class="overviewCol1">Era 2 Trigger</div>`;
    rowCode += `<div class="overviewColx">${state.era2Trigger}vp</div>`;
    rowCode += `</div>`
    allOverViewCode += rowCode;

    rowCode = `<div class="rowOverview">`;
    rowCode += `<div class="overviewCol1">Era 3 Trigger</div>`;
    rowCode += `<div class="overviewColx">${state.era3Trigger}vp</div>`;
    rowCode += `</div>`
    allOverViewCode += rowCode;

    rowCode = `<div class="rowOverview">`;
    rowCode += `<div class="overviewCol1">Round</div>`;
    rowCode += `<div class="overviewColx">${state.round}</div>`;
    rowCode += `</div>`
    allOverViewCode += rowCode;



    let overviewPanel = document.getElementById('overviewPanel');
    overviewPanel.innerHTML = allOverViewCode;
}

/**
 * 
 * @param {string} cardType or wa ti re mi nc om ro mo
 * @returns {obj} cardObj
 */
export function drawCard(cardType) {
    let possibleCards = [];
    if (cardType === 'Or') {
        possibleCards = [1, 2, 3, 4, 5];
    }
    if (cardType === 'Wa') {
        possibleCards = [4, 5, 6, 7, 8, 9, 10];
    }
    if (cardType === 'Ti') {
        possibleCards = [7, 8, 9, 10, 11, 12, 13];
    }
    if (cardType === 'Re') {
        possibleCards = [9, 10, 11, 12, 13, 14, 15, 16, 17];
    }
    if (cardType === 'Mi') {
        possibleCards = [14, 15, 16, 17, 18, 19, 20];
    }
    if (cardType === 'Nc') {
        possibleCards = [14, 16, 18, 20, 22, 24, 26];
    }
    if (cardType === 'Om') {
        possibleCards = [20, 25, 30, 35, 40];
    }
    if (cardType === 'Ro') {
        possibleCards = [30, 35, 40, 45, 50];
    }
    if (cardType === 'Mo') {
        possibleCards = [40, 45, 50, 55, 60];
    }
    if (possibleCards.length === 0) {
        throw new Error(`drawCard(cardType) received an invalid cardType of ${cardType}`);
    }
    let cardWeight = 1; // add mega weights later...
    const randomCardValue = possibleCards[Math.floor(Math.random() * possibleCards.length)];
    const cardObj = {
        cardType: cardType,
        value: randomCardValue,
        weight: cardWeight,
        id: state.cardIdSeed,
    }
    state.cardIdSeed++;
    return cardObj;
}






export function addFactory(reqType = 'Or') {
    let f = {};
    if (reqType === 'Or') { f.type = reqType; }
    if (reqType === 'Wa') { f.type = reqType; }
    if (reqType === 'Ti') { f.type = reqType; }
    f.isManned = false;
    return f;
}