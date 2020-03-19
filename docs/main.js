import * as events from './events.js';

// or=Ore wa=Water ti=Titanium re=Research mi=Microbiotics nc=New_Chemicals om=Orbital_Medicine ro=Ring_Ore mo=Moon_Ore
export const state = {
    playerIdSeed: 0,
    players: [],
    cards: [],
    localPlayerId: 0
};

state.players.push(addPlayer('Ivan'));
state.players.push(addPlayer('Jason'));

console.table(state)


// state.cards.push(drawCard('or'));
// state.cards.push(drawCard('or'));
// state.cards.push(drawCard('or'));
// state.cards.push(drawCard('or'));
// state.cards.push(drawCard('wa'));
// state.cards.push(drawCard('wa'));
// state.cards.push(drawCard('wa'));

// state.cards.sort(compareValues('value'));


// console.log('state.cards:', state.cards);

// events.firstInit();
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
        if (card.cardType === 'or') {
            onlyCards_or.push(card);
        }
        if (card.cardType === 'wa') {
            onlyCards_wa.push(card);
        }
    })

    onlyCards_or.sort(compareValues('value'));
    onlyCards_or.map(card => {
        // const code = `<button type="button" class="pcard pcard_or" value="${card.value}">${card.value}</button>`;
        const code = `<button class="pcard pcard_or" value="${card.value}"><input type="checkbox" class="cb1" tabindex="-1" />${card.value}</button>`;
        allCardCode_or += code;
    })

    onlyCards_wa.sort(compareValues('value'));
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
        rowCode += `<div class="overviewColx">${player.name}</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;

    rowCode = `<div class="rowOverview">`;
    rowCode += `<div class="overviewCol1">Victory Points</div>`;
    state.players.map(player => {
        rowCode += `<div class="overviewColx">${player.vp}</div>`;
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
        player.cards.map(card => {
            if (card.cardType === 'or') { countOr++; }
            if (card.cardType === 'wa') { countWa++; }
        })
        rowCode += `<div class="overviewColx">
        ${countOr > 0 ? countOr + 'or' : ''} 
        ${countWa > 0 ? countWa + 'wa' : ''}
        </div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;

    rowCode = `<div class="rowOverview">`;
    rowCode += `<div class="overviewCol1">Colonist</div>`;
    state.players.map(player => {
        rowCode += `<div class="overviewColx">${player.colonist} of ${player.colonistMax}</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;

    rowCode = `<div class="rowOverview">`;
    rowCode += `<div class="overviewCol1">Robots</div>`;
    state.players.map(player => {
        rowCode += `<div class="overviewColx">${player.robots} of ${player.colonistMax}</div>`;
    });
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
    if (cardType === 'or') {
        possibleCards = [1, 2, 3, 4, 5];
    }
    if (cardType === 'wa') {
        possibleCards = [4, 5, 6, 7, 8, 9, 10];
    }
    if (cardType === 'ti') {
        possibleCards = [7, 8, 9, 10, 11, 12, 13];
    }
    if (cardType === 're') {
        possibleCards = [9, 10, 11, 12, 13, 14, 15, 16, 17];
    }
    if (cardType === 'mi') {
        possibleCards = [14, 15, 16, 17, 18, 19, 20];
    }
    if (cardType === 'nc') {
        possibleCards = [14, 16, 18, 20, 22, 24, 26];
    }
    if (cardType === 'om') {
        possibleCards = [20, 25, 30, 35, 40];
    }
    if (cardType === 'ro') {
        possibleCards = [30, 35, 40, 45, 50];
    }
    if (possibleCards.length === 0) {
        throw new Error(`drawCard(cardType) received an invalid cardType of ${cardType}`);
    }
    const randomCardValue = possibleCards[Math.floor(Math.random() * possibleCards.length)];
    const cardObj = {
        cardType: cardType,
        value: randomCardValue,
    }
    return cardObj;
}

export function compareValues(key, order = 'asc') {
    return function innerSort(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            // property doesn't exist on either object
            return 0;
        }

        const varA = (typeof a[key] === 'string')
            ? a[key].toUpperCase() : a[key];
        const varB = (typeof b[key] === 'string')
            ? b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }
        return (
            (order === 'desc') ? (comparison * -1) : comparison
        );
    };
}

function initialdraw(arr) {
    arr.push(drawCard('or'));
    arr.push(drawCard('or'));
    arr.push(drawCard('or'));
    arr.push(drawCard('or'));
    arr.push(drawCard('wa'));
    arr.push(drawCard('wa'));
}

function addPlayer(name = 'Larry') {
    let p = {};
    p.name = name;
    p.id = state.playerIdSeed;
    state.playerIdSeed++;
    p.cards = [];
    initialdraw(p.cards);
    p.vp = 3;
    p.handLimit = 10;
    p.colonist = 3;
    p.colonistMax = 5;
    p.robots = 0;
    return p;
}