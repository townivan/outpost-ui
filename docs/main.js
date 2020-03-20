import * as events from './events.js';
import * as util from './util.js';
import * as init from './init.js';

// or=Ore wa=Water ti=Titanium re=Research mi=Microbiotics nc=New_Chemicals om=Orbital_Medicine ro=Ring_Ore mo=Moon_Ore
export const state = {
    playerIdSeed: 0,
    players: [],
    cardIdSeed: 0,
    localPlayerId: 0,
    era2Trigger: 10,
    era3Trigger: 35,
    round: 1,
};

init.initialize();
events.firstInit();
console.log(state)
render();

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
    let allOverViewCode = ``;
    let rowCode = ``;

    rowCode = `<div class="rowOverview">`;
    rowCode += `<div class="overviewCol1">Player(TurnOrder)</div>`;
    state.players.map(player => {
        player.updateFactoryCounts();
        rowCode += `<div class="overviewColx">${player.name} (${player.turnOrder})</div>`;
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