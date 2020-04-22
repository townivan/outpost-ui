import * as events from './events.js';
import * as util from './util.js';
import * as init from './init.js';
import * as turn from './turn.js';

if (localStorage.getItem("outpostPlayerName")){
    document.getElementById("playerName").value = localStorage.getItem("outpostPlayerName");
}


// or=Ore wa=Water ti=Titanium re=Research mi=Microbiotics nc=New_Chemicals om=Orbital_Medicine ro=Ring_Ore mo=Moon_Ore
export const state = {
    playerIdSeed: 0,
    players: [],
    seatSeed: 0,
    cardIdSeed: 0,
    factoryIdSeed: 0,
    localPlayerId: 0,
    era2Trigger: 10,
    era3Trigger: 35,
    round: 1,
    currentPlayerNumber: null,
    currentEra: 1,
    eqMax: null,
    equipment: [],
    equipmentIdSeed: 0,
    equipmentSeed: [
        { id: null, name: "Data Library", price: 15, era: 1, vp: 1, amount: 0, isUpForBid: false, desc: `<div>Data Library [c15] (1vp) era1</div><ul><li>c10 discount on <strong>Scientist</strong> cards.</li><li>c10 discount on <strong>Laboratory</strong> cards.</li></ul>`, },
        { id: null, name: "Warehouse", price: 25, era: 1, vp: 1, amount: 0, isUpForBid: false, desc: `<div>Warehouse [c25] (1vp) era1</div><ul><li>+5 Hand Limit.</li></ul>`, },
        { id: null, name: "Heavy Equipment", price: 30, era: 1, vp: 1, amount: 0, isUpForBid: false, desc: `<div>Heavy Equipment [c30] (1vp) era1</div><ul><li>Required to purchase Titanium Factories</li><li>c5 discount on <strong>Nodule</strong> cards.</li><li>c5 discount on <strong>Warehouse</strong> cards.</li><li>c15 discount on <strong>Outpost</strong> cards.</li></ul>`, },
        { id: null, name: "Nodule", price: 25, era: 1, vp: 2, amount: 0, isUpForBid: false, desc: `<div>Nodule [c25] (2vp) era1</div><ul><li>+3 Colony Support Limit.</li></ul>`, },
        { id: null, name: "Scientists", price: 40, era: 2, vp: 2, amount: 0, isUpForBid: false, desc: `<div>Scientists [c40] (2vp) era2</div><ul><li>After purchasing, replace this card with the <strong>Scientist</strong> Special Factory counter.</li><li>This special factory produces one Research Production card per turn (no operator required)</li></ul>`},
        { id: null, name: "Orbital Lab", price: 50, era: 2, vp: 3, amount: 0, isUpForBid: false, desc: `<div>Orbital Lab [c50] (3vp) era2</div><ul><li>After purchasing, replace this card with the <strong>Orbital Lab</strong> Special Factory counter.</li><li>This special factory produces one <strong>Microbiotics</strong> Production card per turn (no operator required)</li></ul>`},
        { id: null, name: "Robots", price: 50, era: 2, vp: 3, amount: 0, isUpForBid: false, desc: `<div>Robots [c50] (3vp) era2</div><ul>
        <li>Required to purchase <strong>Robot</strong> counters.</li>
        <li>Provides <strong>one</strong> free <strong>Robot</strong> counter.</li>
    </ul>`},
        { id: null, name: "Laboratory", price: 80, era: 2, vp: 5, amount: 0, isUpForBid: false, desc: `<div>Laboratory [c80] (5vp) era2</div><ul>
        <li>Required to purchase <strong>Research</strong> Factories.</li>
        <li>Provides <strong>one</strong> free <strong>Research</strong> Factory counter (not operated initally).</li>
    </ul>`},
        { id: null, name: "Ecoplants", price: 30, era: 2, vp: 5, amount: 0, isUpForBid: false, desc: `<div>Ecoplants [c30] (5vp) era2</div><ul>
        <li><strong>Colonists</strong> now cost <strong>5c</strong> to purchase [not cumulative with multiple Ecoplants].</li>
        <li><strong>10c</strong> discount on <strong>Outpost</strong> cards.</li>
    </ul>`},
        { id: null, name: "Outpost", price: 100, era: 2, vp: 5, amount: 0, isUpForBid: false, desc: `<div>Outpost [c100] (5vp) era2</div><ul>
        <li><strong>+5</strong> Colony Support Limit.</li>
        <li><strong>+5</strong> Hand Limit.</li>
        <li>Provides <strong>one</strong> free <strong>Titanium</strong> Factory counter (not operated initally).</li>
    </ul>`},
        { id: null, name: "Space Station", price: 120, era: 3, vp: 10, amount: 0, isUpForBid: false, desc: `<div>Space Station [c120] (10vp) era3</div><ul>
        <li>After purchasing, replace this card with the <strong>Orbital Medicine</strong> Special Factory counter.</li>
        <li>This special factory produces one <strong>Orbital Medicine</strong> Production card per turn, <strong>if operated.</strong></li>
        <li>+1 Colony Support Limit, <strong>if operated.</strong></li>
    </ul>`},
        { id: null, name: "Planetary Cruiser", price: 160, era: 3, vp: 15, amount: 0, isUpForBid: false, desc: `<div>Planetary Cruiser [c160] (15vp) era3</div><ul>
        <li>After purchasing, replace this card with the <strong>Ring Ore</strong> Special Factory counter.</li>
        <li>This special factory produces one <strong>Ring Ore</strong> Production card per turn, <strong>if operated.</strong></li>
        <li>+1 Colony Support Limit, <strong>if operated.</strong></li>
    </ul>`},
        { id: null, name: "Moonbase", price: 200, era: 3, vp: 20, amount: 0, isUpForBid: false, desc: `<div>Moonbase [c200] (20vp) era3</div><ul>
        <li>After purchasing, replace this card with the <strong>Moon Ore</strong> Special Factory counter.</li>
        <li>This special factory produces one <strong>Moon Ore</strong> Production card per turn, <strong>if operated.</strong></li>
        <li>+1 Colony Support Limit, <strong>if operated.</strong></li>
    </ul>`},
    ], // seed this during init  {name:"Data Library", price:15, era:1, vp:1, available:3, id=0}, {}
    eqUpForBidArray: [],
    playerIdsBySeatArray: [],
    bid_currentBid: null,
    bid_leader: null,
    bid_equipment: null,
    bid_actionCount: 1,
    bid_playerWhoStartedIt: null,
    ai_setting: null,
};





init.gameInit();
events.listenerInit();
console.log('state:', state)
turn.startRound();
render();

// tippy('[data-tippy-content]');
// tippy('div.overviewCol1', {
//     content(reference) {
//     console.log('heya');
//     console.log('reference:', reference)
//     const id = reference.getAttribute('data-template');
//     console.log('id:', id)
//     const template = document.getElementById(id);
//     console.log('template:', template)
//     return template.innerHTML;
//     },
//     allowHTML: true,
// });


export function addPlayer(name = 'Larry') {
    let p = {};
    p.isYou = false;
    p.name = name;
    p.id = state.playerIdSeed;
    state.playerIdSeed++;
    p.seat = state.seatSeed;
    state.seatSeed++;
    p.cards = [];
    p.vp = 3;
    p.handLimit = 10;
    p.colonist = 3;
    p.colonistMax = 5;
    p.robots = 0;
    p.availableColonistCount = 0;
    p.availableRobotCount = 0;
    p.factories = [];
    p.turnOrder = 0;
    p.isAwaitingTurn = true;
    p.discountOnNodule = 0;
    p.discountOnWarehouse = 0;
    p.discountOnScientist = 0;
    p.discountOnLaboratory = 0;
    p.discountOnOutpost = 0;
    p.discountOnColonists = 0;

    p.updateFactoryCounts = function () {
        let OrCount = 0;
        let OrManned = 0;

        let WaCount = 0;
        let WaManned = 0;

        let TiCount = 0;
        let TiManned = 0;

        let ReCount = 0;
        let ReManned = 0;

        let MiCount = 0;
        let MiManned = 0;

        let NcCount = 0;
        let NcManned = 0;

        let ScientistsFactoryCount = 0;
        let ScientistsFactoryManned = 0;

        let OrbitalLabFactoryCount = 0;
        let OrbitalLabFactoryManned = 0;

        let OmCount = 0;
        let OmManned = 0;

        let RoCount = 0;
        let RoManned = 0;

        let MoCount = 0;
        let MoManned = 0;

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
            if (factory.type === "Re") {
                ReCount++;
                if (factory.isManned) { ReManned++; }
            }
            if (factory.type === "Mi") {
                MiCount++;
                if (factory.isManned) { MiManned++; }
            }
            if (factory.type === "Nc") {
                NcCount++;
                if (factory.isManned) { NcManned++; }
            }
            if (factory.type === "ScientistsFactory") {
                ScientistsFactoryCount++;
                ScientistsFactoryManned++;
            }
            if (factory.type === "OrbitalLabFactory") {
                OrbitalLabFactoryCount++;
                OrbitalLabFactoryManned++;
            }
            if (factory.type === "Om") {
                OmCount++;
                if (factory.isManned) { OmManned++; }
            }
            if (factory.type === "Ro") {
                RoCount++;
                if (factory.isManned) { RoManned++; }
            }
            if (factory.type === "Mo") {
                MoCount++;
                if (factory.isManned) { MoManned++; }
            }
        })
        this.OrCount = OrCount;
        this.OrManned = OrManned;

        this.WaCount = WaCount;
        this.WaManned = WaManned;

        this.TiCount = TiCount;
        this.TiManned = TiManned;

        this.ReCount = ReCount;
        this.ReManned = ReManned;

        this.MiCount = MiCount;
        this.MiManned = MiManned;

        this.NcCount = NcCount;
        this.NcManned = NcManned;

        this.ScientistsFactoryCount = ScientistsFactoryCount;
        this.ScientistsFactoryManned = ScientistsFactoryManned;

        this.OrbitalLabFactoryCount = OrbitalLabFactoryCount;
        this.OrbitalLabFactoryManned = OrbitalLabFactoryManned;

        this.OmCount = OmCount;
        this.OmManned = OmManned;

        this.RoCount = RoCount;
        this.RoManned = RoManned;

        this.MoCount = MoCount;
        this.MoManned = MoManned;
    }
    p.dataLibraryCount = 0;
    p.warehouseCount = 0;
    p.heavyEquipmentCount = 0;
    p.noduleCount = 0;
    p.ownedEquipment = [];

    p.robotsEqCount = 0;
    p.playerSeatedAfterMe = null;
    p.bidStatus = null;

    p.isUnlocked_Ti = false;
    p.isUnlocked_Re = false;
    p.isUnlocked_Mi = false;
    p.isUnlocked_Nc = false;

    return p;
}

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

export function render() {
    let cardsMax = 0;
    let onlyCards_or = [];
    let onlyCards_wa = [];
    let onlyCards_ti = [];
    let onlyCards_re = [];
    let onlyCards_mi = [];
    let onlyCards_nc = [];
    let onlyCards_om = [];
    let onlyCards_ro = [];
    let onlyCards_mo = [];
    let allCardCode_or = '';
    let allCardCode_wa = '';
    let allCardCode_ti = '';
    let allCardCode_re = '';
    let allCardCode_mi = '';
    let allCardCode_nc = '';
    let allCardCode_om = '';
    let allCardCode_ro = '';
    let allCardCode_mo = '';
    let me = util.getPlayerMe();
    me.cards.map(card => {
        cardsMax += card.value;
        // render cards...
        if (card.cardType === 'Or') {
            onlyCards_or.push(card);
        }
        if (card.cardType === 'Wa') {
            onlyCards_wa.push(card);
        }
        if (card.cardType === 'Ti') {
            onlyCards_ti.push(card);
        }
        if (card.cardType === 'Re') {
            onlyCards_re.push(card);
        }
        if (card.cardType === 'Mi') {
            onlyCards_mi.push(card);
        }
        if (card.cardType === 'Nc') {
            onlyCards_nc.push(card);
        }
        if (card.cardType === 'Om') {
            onlyCards_om.push(card);
        }
        if (card.cardType === 'Ro') {
            onlyCards_ro.push(card);
        }
        if (card.cardType === 'Mo') {
            onlyCards_mo.push(card);
        }
    })

    // console.log('prepare to render, onlyCards_or:', onlyCards_or)
    
    // the next two are a simple version for hiding these if you have no cards...hide or not is more complex for other types...
    if (onlyCards_or.length === 0) { document.querySelector('.pcardRow_Or').classList.add('hideme') }
    else{                            document.querySelector('.pcardRow_Or').classList.remove('hideme') }
    onlyCards_or.sort(util.compareValues('value'));
    onlyCards_or.map(card => {
        const code = `<button type="button" class="pcard pcard_or ${card.isSelected ? 'pcard--selected' : ''}" value="${card.value}" data-id="${card.id}"><input type="checkbox" class="cb1" tabindex="-1" ${card.isSelected ? 'checked="checked"' : ''} />${card.value}</button>`;
        allCardCode_or += code;
    })

    // the next two are a simple version for hiding these if you have no cards...hide or not is more complex for other types...
    if (onlyCards_wa.length === 0) { document.querySelector('.pcardRow_Wa').classList.add('hideme') }
    else{                            document.querySelector('.pcardRow_Wa').classList.remove('hideme') }
    onlyCards_wa.sort(util.compareValues('value'));
    onlyCards_wa.map(card => {
        const code = `<button type="button" class="pcard pcard_wa ${card.isSelected ? 'pcard--selected' : ''}" value="${card.value}" data-id="${card.id}"><input type="checkbox" class="cb1" tabindex="-1" ${card.isSelected ? 'checked="checked"' : ''} />${card.value}</button>`;
        allCardCode_wa += code;
    })

    // the next two are a simple version for hiding these if you have no cards...hide or not is more complex for other types...
    if (onlyCards_ti.length === 0) { document.querySelector('.pcardRow_Ti').classList.add('hideme') }
    else{                            document.querySelector('.pcardRow_Ti').classList.remove('hideme') }
    onlyCards_ti.sort(util.compareValues('value'));
    onlyCards_ti.map(card => {
        const code = `<button type="button" class="pcard pcard_ti ${card.isSelected ? 'pcard--selected' : ''}" value="${card.value}" data-id="${card.id}"><input type="checkbox" class="cb1" tabindex="-1" ${card.isSelected ? 'checked="checked"' : ''} />${card.value}</button>`;
        allCardCode_ti += code;
    })

    // the next two are a simple version for hiding these if you have no cards...hide or not is more complex for other types...
    if (onlyCards_re.length === 0) { document.querySelector('.pcardRow_Re').classList.add('hideme') }
    else{                            document.querySelector('.pcardRow_Re').classList.remove('hideme') }
    onlyCards_re.sort(util.compareValues('value'));
    onlyCards_re.map(card => {
        const code = `<button type="button" class="pcard pcard_re ${card.isSelected ? 'pcard--selected' : ''}" value="${card.value}" data-id="${card.id}"><input type="checkbox" class="cb1" tabindex="-1" ${card.isSelected ? 'checked="checked"' : ''} />${card.value}</button>`;
        allCardCode_re += code;
    })

    // the next two are a simple version for hiding these if you have no cards...hide or not is more complex for other types...
    if (onlyCards_mi.length === 0) { document.querySelector('.pcardRow_Mi').classList.add('hideme') }
    else{                            document.querySelector('.pcardRow_Mi').classList.remove('hideme') }
    onlyCards_mi.sort(util.compareValues('value'));
    onlyCards_mi.map(card => {
        const code = `<button type="button" class="pcard pcard_mi ${card.isSelected ? 'pcard--selected' : ''}" value="${card.value}" data-id="${card.id}"><input type="checkbox" class="cb1" tabindex="-1" ${card.isSelected ? 'checked="checked"' : ''} />${card.value}</button>`;
        allCardCode_mi += code;
    })

    // the next two are a simple version for hiding these if you have no cards...hide or not is more complex for other types...
    if (onlyCards_nc.length === 0) { document.querySelector('.pcardRow_Nc').classList.add('hideme') }
    else{                            document.querySelector('.pcardRow_Nc').classList.remove('hideme') }
    onlyCards_nc.sort(util.compareValues('value'));
    onlyCards_nc.map(card => {
        const code = `<button type="button" class="pcard pcard_nc ${card.isSelected ? 'pcard--selected' : ''}" value="${card.value}" data-id="${card.id}"><input type="checkbox" class="cb1" tabindex="-1" ${card.isSelected ? 'checked="checked"' : ''} />${card.value}</button>`;
        allCardCode_nc += code;
    })

    // the next two are a simple version for hiding these if you have no cards...hide or not is more complex for other types...
    if (onlyCards_om.length === 0) { document.querySelector('.pcardRow_Om').classList.add('hideme') }
    else{                            document.querySelector('.pcardRow_Om').classList.remove('hideme') }
    onlyCards_om.sort(util.compareValues('value'));
    onlyCards_om.map(card => {
        const code = `<button type="button" class="pcard pcard_om ${card.isSelected ? 'pcard--selected' : ''}" value="${card.value}" data-id="${card.id}"><input type="checkbox" class="cb1" tabindex="-1" ${card.isSelected ? 'checked="checked"' : ''} />${card.value}</button>`;
        allCardCode_om += code;
    })

    // the next two are a simple version for hiding these if you have no cards...hide or not is more complex for other types...
    if (onlyCards_ro.length === 0) { document.querySelector('.pcardRow_Ro').classList.add('hideme') }
    else{                            document.querySelector('.pcardRow_Ro').classList.remove('hideme') }
    onlyCards_ro.sort(util.compareValues('value'));
    onlyCards_ro.map(card => {
        const code = `<button type="button" class="pcard pcard_ro ${card.isSelected ? 'pcard--selected' : ''}" value="${card.value}" data-id="${card.id}"><input type="checkbox" class="cb1" tabindex="-1" ${card.isSelected ? 'checked="checked"' : ''} />${card.value}</button>`;
        allCardCode_ro += code;
    })

    // the next two are a simple version for hiding these if you have no cards...hide or not is more complex for other types...
    if (onlyCards_mo.length === 0) { document.querySelector('.pcardRow_Mo').classList.add('hideme') }
    else{                            document.querySelector('.pcardRow_Mo').classList.remove('hideme') }
    onlyCards_mo.sort(util.compareValues('value'));
    onlyCards_mo.map(card => {
        const code = `<button type="button" class="pcard pcard_mo ${card.isSelected ? 'pcard--selected' : ''}" value="${card.value}" data-id="${card.id}"><input type="checkbox" class="cb1" tabindex="-1" ${card.isSelected ? 'checked="checked"' : ''} />${card.value}</button>`;
        allCardCode_mo += code;
    })

    document.getElementById('pCardRenderInsertionPoint_or').innerHTML = allCardCode_or;
    document.getElementById('pCardRenderInsertionPoint_wa').innerHTML = allCardCode_wa;
    document.getElementById('pCardRenderInsertionPoint_ti').innerHTML = allCardCode_ti;
    document.getElementById('pCardRenderInsertionPoint_re').innerHTML = allCardCode_re;
    document.getElementById('pCardRenderInsertionPoint_mi').innerHTML = allCardCode_mi;
    document.getElementById('pCardRenderInsertionPoint_nc').innerHTML = allCardCode_nc;
    document.getElementById('pCardRenderInsertionPoint_om').innerHTML = allCardCode_om;
    document.getElementById('pCardRenderInsertionPoint_ro').innerHTML = allCardCode_ro;
    document.getElementById('pCardRenderInsertionPoint_mo').innerHTML = allCardCode_mo;

    document.getElementById('cardsMax').innerHTML = cardsMax.toString();

    events.initCardListeners();
    events.calcProductionCardSelection();

    // render overviewPanel
    // let allOverViewCode = `<div id="availableEq">Eq up for bid: ${util.printEqUpForBid()}</div>`;
    // document.getElementById('availableEq').innerHTML = util.printEqUpForBid();

    let allOverViewCode = '';
    let rowCode = ``;

    rowCode = `<div class="rowOverview">`;
    rowCode += `<div class="overviewCol1">Player(TurnOrder)</div>`;
    state.players.map(player => {
        player.updateFactoryCounts();
        rowCode += `<div class="overviewColx ${player.isYou ? 'highlightme2' : ''}">${player.name}<sup>${player.isAwaitingTurn ? player.turnOrder : '<span class="turnOver">X</span>'}</sup></div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;

    rowCode = `<div class="rowOverview">`;
    rowCode += `<div class="overviewCol1">Victory Points</div>`;
    state.players.map((player,i) => {
        rowCode += `<div class="overviewColx ${i==0 ? 'vpLeader' : ''}">${player.vp}vp</div>`;
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
        let countRe = 0;
        let countMi = 0;
        let countNc = 0;
        let countOm = 0;
        let countRo = 0;
        let countMo = 0;
        player.cards.map(card => {
            if (card.cardType === 'Or') { countOr++; }
            if (card.cardType === 'Wa') { countWa++; }
            if (card.cardType === 'Ti') { countTi++; }
            if (card.cardType === 'Re') { countRe++; }
            if (card.cardType === 'Mi') { countMi++; }
            if (card.cardType === 'Nc') { countNc++; }
            if (card.cardType === 'Om') { countOm++; }
            if (card.cardType === 'Ro') { countRo++; }
            if (card.cardType === 'Mo') { countMo++; }
        })
        rowCode += `<div class="overviewColx">
        ${countOr > 0 ? `<span class="bgOrBorder">${countOr}</span>` + '<span class="bgOr bgOrBorder">Or</span>' : ''} 
        ${countWa > 0 ? `<span class="bgWaBorder">${countWa}</span>` + '<span class="bgWa bgWaBorder">Wa</span>' : ''}
        ${countTi > 0 ? `<span class="bgTiBorder">${countTi}</span>` + '<span class="bgTi bgTiBorder">Ti</span>' : ''}
        ${countRe > 0 ? `<span class="bgReBorder">${countRe}</span>` + '<span class="bgRe bgReBorder">Re</span>' : ''}
        ${countMi > 0 ? `<span class="bgMiBorder">${countMi}</span>` + '<span class="bgMi bgMiBorder">Mi</span>' : ''}
        ${countNc > 0 ? `<span class="bgNcBorder">${countNc}</span>` + '<span class="bgNc bgNcBorder">Nc</span>' : ''}
        ${countOm > 0 ? `<span class="bgOmBorder">${countOm}</span>` + '<span class="bgOm bgOmBorder">Om</span>' : ''}
        ${countRo > 0 ? `<span class="bgRoBorder">${countRo}</span>` + '<span class="bgRo bgRoBorder">Ro</span>' : ''}
        ${countMo > 0 ? `<span class="bgMoBorder">${countMo}</span>` + '<span class="bgMo bgMoBorder">Mo</span>' : ''}
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



    let doesAnyoneHaveRobots = false;
    state.players.map(player => {
        player.ownedEquipment.map(eq =>{
            if (eq.name === 'Robots'){ doesAnyoneHaveRobots=true; }
        })
    })
    rowCode = `<div class="rowOverview ${doesAnyoneHaveRobots ? '' : 'hideme'}">`;
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


    rowCode = `<div id="overview_Ti" class="rowOverview ${util.getPlayerMe().isUnlocked_Ti ? '' :'hideme'}">`;
    rowCode += `<div class="overviewCol1">Factories - <span class="bgTiBorder">Ti</span></div>`;
    state.players.map(player => {
        rowCode += `<div class="overviewColx bgTiBorder">${player.TiManned} of ${player.TiCount}</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;
    
    rowCode = `<div class="rowOverview ${util.getPlayerMe().isUnlocked_Re ? '' :'hideme'}">`;
    rowCode += `<div class="overviewCol1">Factories - <span class="bgReBorder">Re</span></div>`;
    state.players.map(player => {
        rowCode += `<div class="overviewColx bgReBorder">${player.ReManned} of ${player.ReCount}</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;
    
    rowCode = `<div class="rowOverview ${util.getPlayerMe().isUnlocked_Mi ? '' :'hideme'}">`;
    rowCode += `<div class="overviewCol1">Factories - <span class="bgMiBorder">Mi</span></div>`;
    state.players.map(player => {
        rowCode += `<div class="overviewColx bgMiBorder">${player.MiManned} of ${player.MiCount}</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;
    
    rowCode = `<div class="rowOverview ${util.getPlayerMe().isUnlocked_Nc ? '' :'hideme'}">`;
    rowCode += `<div class="overviewCol1">Factories - <span class="bgNcBorder">Nc</span></div>`;
    state.players.map(player => {
        rowCode += `<div class="overviewColx bgNcBorder">${player.NcManned} of ${player.NcCount}</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;
    
    rowCode = `<div class="rowOverview ${util.getPlayerMe().isUnlocked_Om ? '' :'hideme'}">`;
    rowCode += `<div class="overviewCol1">Factories - <span class="bgOmBorder">Om</span></div>`;
    state.players.map(player => {
        rowCode += `<div class="overviewColx bgOmBorder">${player.OmManned} of ${player.OmCount}</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;
    
    rowCode = `<div class="rowOverview ${util.getPlayerMe().isUnlocked_Ro ? '' :'hideme'}">`;
    rowCode += `<div class="overviewCol1">Factories - <span class="bgRoBorder">Ro</span></div>`;
    state.players.map(player => {
        rowCode += `<div class="overviewColx bgRoBorder">${player.RoManned} of ${player.RoCount}</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;
    
    rowCode = `<div class="rowOverview ${util.getPlayerMe().isUnlocked_Mo ? '' :'hideme'}">`;
    rowCode += `<div class="overviewCol1">Factories - <span class="bgMoBorder">Mo</span></div>`;
    state.players.map(player => {
        rowCode += `<div class="overviewColx bgMoBorder">${player.MoManned} of ${player.MoCount}</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;


    // now for equipment...

    //state.eqUpForBidArray
    let gotEq = false;

    let dataLibraryCount = 0;
    let warehouseCount = 0;
    let heavyequipmentCount = 0;
    let noduleCount = 0;
    let scientistsCount = 0;
    let orbitalLabCount = 0;
    let robotsCount = 0;
    let laboratoryCount = 0;
    let ecoplantsCount = 0;
    let outpostCount = 0;
    let spaceStationCount = 0;
    let planetaryCruiserCount = 0;
    let moonbaseCount = 0;

    // console.log('%cstate.equipment:', 'background-color:orange', state.equipment)
    // console.log('%cstate.eqUpForBidArray:', 'background-color:lightgreen', state.eqUpForBidArray)

    state.equipment.map(eqSlotArray => {
        eqSlotArray.map(eq => {
            // console.log('%crender...eq(state.equipment):', 'background-color:pink;', eq)
            if (eq.name == "Data Library"){
                dataLibraryCount++;
            }
            if (eq.name == "Warehouse"){
                warehouseCount++;
            }
            if (eq.name == "Heavy Equipment"){
                heavyequipmentCount++;
            }
            if (eq.name == "Nodule"){
                noduleCount++;
            }
            if (eq.name == "Scientists"){
                scientistsCount++;
            }
            if (eq.name == "Orbital Lab"){
                orbitalLabCount++;
            }
            if (eq.name == "Robots"){
                robotsCount++;
            }
            if (eq.name == "Laboratory"){
                laboratoryCount++;
            }
            if (eq.name == "Ecoplants"){
                ecoplantsCount++;
            }
            if (eq.name == "Outpost"){
                outpostCount++;
            }
            if (eq.name == "Space Station"){
                spaceStationCount++;
            }
            if (eq.name == "Planetary Cruiser"){
                planetaryCruiserCount++;
            }
            if (eq.name == "Moonbase"){
                moonbaseCount++;
            }
        })
    })
    state.eqUpForBidArray.map(eq => {
        // console.log('render...eq(state.eqUpForBidArray):', eq)
        if (eq.name == "Data Library"){
            dataLibraryCount++;
        }
        if (eq.name == "Warehouse"){
            warehouseCount++;
        }
        if (eq.name == "Heavy Equipment"){
            heavyequipmentCount++;
        }
        if (eq.name == "Nodule"){
            noduleCount++;
        }
        if (eq.name == "Scientists"){
            scientistsCount++;
        }
        if (eq.name == "Orbital Lab"){
            orbitalLabCount++;
        }
        if (eq.name == "Robots"){
            robotsCount++;
        }
        if (eq.name == "Laboratory"){
            laboratoryCount++;
        }
        if (eq.name == "Ecoplants"){
            ecoplantsCount++;
        }
        if (eq.name == "Outpost"){
            outpostCount++;
        }
        if (eq.name == "Space Station"){
            spaceStationCount++;
        }
        if (eq.name == "Planetary Cruiser"){
            planetaryCruiserCount++;
        }
        if (eq.name == "Moonbase"){
            moonbaseCount++;
        }
    })

    
    gotEq = util.isObjInHereWithValue(state.eqUpForBidArray, 'name', 'Data Library');
    rowCode = `<div class="rowOverview">`;
    rowCode += `<div class="overviewCol1 ${gotEq ? 'highlightme' : ''}" id="tippySource1">Data Library (${dataLibraryCount}&nbsp;left)</div>`;
    state.players.map(player => {
        let playerEqCount = 0;
        player.ownedEquipment.map(eq => {
            if (eq.name == "Data Library"){
                playerEqCount++;
            }
        })
        rowCode += `<div class="overviewColx ${gotEq ? 'highlightme' : ''} ${player.isYou ? 'highlightme2' : ''}" title="Data Library">${playerEqCount}</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;


    gotEq = util.isObjInHereWithValue(state.eqUpForBidArray, 'name', 'Warehouse');
    rowCode = `<div class="rowOverview">`;
    rowCode += `<div class="overviewCol1 ${gotEq ? 'highlightme' : ''}" id="tippySource2">Warehouse (${warehouseCount}&nbsp;left)</div>`;
    state.players.map(player => {
        let playerEqCount = 0;
        player.ownedEquipment.map(eq => {
            if (eq.name == "Warehouse"){
                playerEqCount++;
            }
        })
        rowCode += `<div class="overviewColx ${gotEq ? 'highlightme' : ''} ${player.isYou ? 'highlightme2' : ''}" title="Warehouse">${playerEqCount}</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;


    gotEq = util.isObjInHereWithValue(state.eqUpForBidArray, 'name', 'Heavy Equipment');
    rowCode = `<div class="rowOverview">`;
    rowCode += `<div class="overviewCol1 ${gotEq ? 'highlightme' : ''}" id="tippySource3">Heavy Equipment (${heavyequipmentCount}&nbsp;left)</div>`;
    state.players.map(player => {
        let playerEqCount = 0;
        player.ownedEquipment.map(eq => {
            if (eq.name == "Heavy Equipment"){
                playerEqCount++;
            }
        })
        rowCode += `<div class="overviewColx ${gotEq ? 'highlightme' : ''} ${player.isYou ? 'highlightme2' : ''}" title="Heavy Equipment">${playerEqCount}</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;


    gotEq = util.isObjInHereWithValue(state.eqUpForBidArray, 'name', 'Nodule');
    rowCode = `<div class="rowOverview">`;
    rowCode += `<div class="overviewCol1 ${gotEq ? 'highlightme' : ''}" id="tippySource4">Nodule (${noduleCount}&nbsp;left)</div>`;
    state.players.map(player => {
        let playerEqCount = 0;
        player.ownedEquipment.map(eq => {
            if (eq.name == "Nodule"){
                playerEqCount++;
            }
        })
        rowCode += `<div class="overviewColx ${gotEq ? 'highlightme' : ''} ${player.isYou ? 'highlightme2' : ''}" title="Nodule">${playerEqCount}</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;

    
    gotEq = util.isObjInHereWithValue(state.eqUpForBidArray, 'name', 'Scientists');
    rowCode = `<div class="rowOverview ${state.currentEra > 1 ? '' :'hideme'}">`;
    rowCode += `<div class="overviewCol1 ${gotEq ? 'highlightme' : ''}" id="tippySource5">Scientists (${scientistsCount}&nbsp;left)</div>`;
    state.players.map(player => {
        let playerEqCount = 0;
        player.ownedEquipment.map(eq => {
            if (eq.name == "Scientists"){
                playerEqCount++;
            }
        })
        rowCode += `<div class="overviewColx ${gotEq ? 'highlightme' : ''} ${player.isYou ? 'highlightme2' : ''}" title="Scientists">${playerEqCount}</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;


    gotEq = util.isObjInHereWithValue(state.eqUpForBidArray, 'name', 'Orbital Lab');
    rowCode = `<div class="rowOverview ${state.currentEra > 1 ? '' :'hideme'}">`;
    rowCode += `<div class="overviewCol1 ${gotEq ? 'highlightme' : ''}" id="tippySource6">Orbital Lab (${orbitalLabCount}&nbsp;left)</div>`;
    state.players.map(player => {
        let playerEqCount = 0;
        player.ownedEquipment.map(eq => {
            if (eq.name == "Orbital Lab"){
                playerEqCount++;
            }
        })
        rowCode += `<div class="overviewColx ${gotEq ? 'highlightme' : ''} ${player.isYou ? 'highlightme2' : ''}" title="Orbital Lab">${playerEqCount}</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;


    gotEq = util.isObjInHereWithValue(state.eqUpForBidArray, 'name', 'Robots');
    rowCode = `<div class="rowOverview ${state.currentEra > 1 ? '' :'hideme'}">`;
    rowCode += `<div class="overviewCol1 ${gotEq ? 'highlightme' : ''}" id="tippySource7">Robots (${robotsCount}&nbsp;left)</div>`;
    state.players.map(player => {
        let playerEqCount = 0;
        player.ownedEquipment.map(eq => {
            if (eq.name == "Robots"){
                playerEqCount++;
            }
        })
        rowCode += `<div class="overviewColx ${gotEq ? 'highlightme' : ''} ${player.isYou ? 'highlightme2' : ''}" title="Robots">${playerEqCount}</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;


    gotEq = util.isObjInHereWithValue(state.eqUpForBidArray, 'name', 'Laboratory');
    rowCode = `<div class="rowOverview ${state.currentEra > 1 ? '' :'hideme'}">`;
    rowCode += `<div class="overviewCol1 ${gotEq ? 'highlightme' : ''}" id="tippySource8">Laboratory (${laboratoryCount}&nbsp;left)</div>`;
    state.players.map(player => {
        let playerEqCount = 0;
        player.ownedEquipment.map(eq => {
            if (eq.name == "Laboratory"){
                playerEqCount++;
            }
        })
        rowCode += `<div class="overviewColx ${gotEq ? 'highlightme' : ''} ${player.isYou ? 'highlightme2' : ''}" title="Laboratory">${playerEqCount}</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;


    gotEq = util.isObjInHereWithValue(state.eqUpForBidArray, 'name', 'Ecoplants');
    rowCode = `<div class="rowOverview ${state.currentEra > 1 ? '' :'hideme'}">`;
    rowCode += `<div class="overviewCol1 ${gotEq ? 'highlightme' : ''}" id="tippySource9">Ecoplants (${ecoplantsCount}&nbsp;left)</div>`;
    state.players.map(player => {
        let playerEqCount = 0;
        player.ownedEquipment.map(eq => {
            if (eq.name == "Ecoplants"){
                playerEqCount++;
            }
        })
        rowCode += `<div class="overviewColx ${gotEq ? 'highlightme' : ''} ${player.isYou ? 'highlightme2' : ''}" title="Ecoplants">${playerEqCount}</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;



    gotEq = util.isObjInHereWithValue(state.eqUpForBidArray, 'name', 'Outpost');
    rowCode = `<div class="rowOverview ${state.currentEra > 1 ? '' :'hideme'}">`;
    rowCode += `<div class="overviewCol1 ${gotEq ? 'highlightme' : ''}" id="tippySource10">Outpost (${outpostCount}&nbsp;left)</div>`;
    state.players.map(player => {
        let playerEqCount = 0;
        player.ownedEquipment.map(eq => {
            if (eq.name == "Outpost"){
                playerEqCount++;
            }
        })
        rowCode += `<div class="overviewColx ${gotEq ? 'highlightme' : ''} ${player.isYou ? 'highlightme2' : ''}" title="Outpost">${playerEqCount}</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;



    gotEq = util.isObjInHereWithValue(state.eqUpForBidArray, 'name', 'Space Station');
    rowCode = `<div class="rowOverview ${state.currentEra > 2 ? '' :'hideme'}">`;
    rowCode += `<div class="overviewCol1 ${gotEq ? 'highlightme' : ''}" id="tippySource11">Space Station (${spaceStationCount}&nbsp;left)</div>`;
    state.players.map(player => {
        let playerEqCount = 0;
        player.ownedEquipment.map(eq => {
            if (eq.name == "Space Station"){
                playerEqCount++;
            }
        })
        rowCode += `<div class="overviewColx ${gotEq ? 'highlightme' : ''} ${player.isYou ? 'highlightme2' : ''}" title="Space Station">${playerEqCount}</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;



    gotEq = util.isObjInHereWithValue(state.eqUpForBidArray, 'name', 'Planetary Cruiser');
    rowCode = `<div class="rowOverview ${state.currentEra > 2 ? '' :'hideme'}">`;
    rowCode += `<div class="overviewCol1 ${gotEq ? 'highlightme' : ''}" id="tippySource12">Planetary Cruiser (${planetaryCruiserCount}&nbsp;left)</div>`;
    state.players.map(player => {
        let playerEqCount = 0;
        player.ownedEquipment.map(eq => {
            if (eq.name == "Planetary Cruiser"){
                playerEqCount++;
            }
        })
        rowCode += `<div class="overviewColx ${gotEq ? 'highlightme' : ''} ${player.isYou ? 'highlightme2' : ''}" title="Planetary Cruiser">${playerEqCount}</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;



    gotEq = util.isObjInHereWithValue(state.eqUpForBidArray, 'name', 'Moonbase');
    rowCode = `<div class="rowOverview ${state.currentEra > 2 ? '' :'hideme'}">`;
    rowCode += `<div class="overviewCol1 ${gotEq ? 'highlightme' : ''}" id="tippySource13">Moonbase (${moonbaseCount}&nbsp;left)</div>`;
    state.players.map(player => {
        let playerEqCount = 0;
        player.ownedEquipment.map(eq => {
            if (eq.name == "Moonbase"){
                playerEqCount++;
            }
        })
        rowCode += `<div class="overviewColx ${gotEq ? 'highlightme' : ''} ${player.isYou ? 'highlightme2' : ''}" title="Moonbase">${playerEqCount}</div>`;
    });
    rowCode += `</div>`
    allOverViewCode += rowCode;





    // now for general stats...

    // rowCode = `<div class="rowOverview">`;
    // rowCode += `<div class="overviewCol1">Era 2 Trigger</div>`;
    // rowCode += `<div class="overviewColx">${state.era2Trigger}vp</div>`;
    // rowCode += `</div>`
    // allOverViewCode += rowCode;

    // rowCode = `<div class="rowOverview">`;
    // rowCode += `<div class="overviewCol1">Era 3 Trigger</div>`;
    // rowCode += `<div class="overviewColx">${state.era3Trigger}vp</div>`;
    // rowCode += `</div>`
    // allOverViewCode += rowCode;

    // rowCode = `<div class="rowOverview">`;
    // rowCode += `<div class="overviewCol1">Round</div>`;
    // rowCode += `<div class="overviewColx">${state.round}</div>`;
    // rowCode += `</div>`
    // allOverViewCode += rowCode;


    // render player factories
    let availableColonistCount = me.colonist*1;
    let availableRobotCount = me.robots*1;

    me.factories.map(factory => {
        if (factory.isManned){
            if (factory.mannedBy == 'colonist'){
                availableColonistCount--;
            }
            if (factory.mannedBy == 'robot'){
                availableRobotCount--;
            }
        }
    })

    document.getElementById('factoriesMyAvailableColonists').innerHTML = availableColonistCount;
    document.getElementById('factoriesMyAvailableRobots').innerHTML = availableRobotCount;
    me.availableColonistCount = availableColonistCount;
    me.availableRobotCount = availableRobotCount;


    let allFactoryCode = '';

    me.factories.map(factory => {
        // console.log('factory:', factory)
        allFactoryCode += renderFactory(me, factory)
    });

    document.getElementById('turnManageFactoriesInsert').innerHTML = allFactoryCode;

    function renderFactory(player, factory){

        if (factory.type === 'ScientistsFactory'){
            factory.mannedBy = 'na';
        }
        if (factory.type === 'OrbitalLabFactory'){
            factory.mannedBy = 'na';
        }
        let factoryTemplate = `
        <button type="button" class="factoryBtn factoryBtn_${factory.type}" data-state="${factory.mannedBy}" data-ownerId="${player.id}" data-guid="${factory.id}">
            <i class="fas fa-industry"></i>
            <i class="fas fa-ban indicator1 ${factory.mannedBy=='unmanned' ? '' : 'hideme'}"></i>
            <i class="fas fa-user indicator2 ${factory.mannedBy=='colonist' ? '' : 'hideme'}"></i>
            <i class="fas fa-robot indicator3 ${factory.mannedBy=='robot' ? '' : 'hideme'}"></i>
            <i class="far fa-times-circle indicator4 ${factory.mannedBy=='na' ? '' : 'hideme'}"></i>
        </button>`;
        return factoryTemplate;
    }

    // turnManageFactoriesArea
    // console.log('state:', state)


    let overviewPanel = document.getElementById('overviewPanel');
    overviewPanel.innerHTML = allOverViewCode;

    
    tippy('#tippySource1', {
        content: `<p>
            Data Library [c15] (1vp) era1
            <ul>
                <li>c10 discount on <strong>Scientist</strong> cards.</li>
                <li>c10 discount on <strong>Laboratory</strong> cards.</li>
            </ul>
        </p>`,
        allowHTML: true,
    });

    tippy('#tippySource2', {
        content: `<p>
        Warehouse [c25] (1vp) era1
        <ul>
            <li><strong>+5</strong> Hand Limit.</li>
        </ul>
  </p>`,
        allowHTML: true,
    });

    tippy('#tippySource3', {
        content: `<p>
        Heavy Equipment [c30] (1vp) era1
        <ul>
            <li>Required to purchase Titanium Factories.</li>
            <li>c5 discount on <strong>Nodule</strong> cards.</li>
            <li>c5 discount on <strong>Warehouse</strong> cards.</li>
            <li>c15 discount on <strong>Outpost</strong> cards.</li>
        </ul>
    </p>`,
        allowHTML: true,
    });

    tippy('#tippySource4', {
        content: `<p>
        Nodule [c25] (2vp) era1
            <ul>
                <li><strong>+3</strong> Colony Support Limit.</li>
            </ul>
    </p>`,
        allowHTML: true,
    });

    tippy('#tippySource5', {
        content: `<p>
        Scientists [c40] (2vp) era2
            <ul>
                <li>After purchasing, replace this card with the <strong>Scientist</strong> Special Factory counter.</li>
                <li>This special factory produces one <strong>Research</strong> Production card per turn (no operator required)</li>
            </ul>
    </p>`,
        allowHTML: true,
    });

    tippy('#tippySource6', {
        content: `<p>
        Orbital Lab [c50] (3vp) era2
            <ul>
                <li>After purchasing, replace this card with the <strong>Orbital Lab</strong> Special Factory counter.</li>
                <li>This special factory produces one <strong>Microbiotics</strong> Production card per turn (no operator required)</li>
            </ul>
    </p>`,
        allowHTML: true,
    });

    tippy('#tippySource7', {
        content: `<p>
        Robots [c50] (3vp) era2
            <ul>
                <li>Required to purchase <strong>Robot</strong> counters.</li>
                <li>Provides <strong>one</strong> free <strong>Robot</strong> counter.</li>
            </ul>
    </p>`,
        allowHTML: true,
    });

    tippy('#tippySource8', {
        content: `<p>
        Laboratory [c80] (5vp) era2
            <ul>
                <li>Required to purchase <strong>Research</strong> Factories.</li>
                <li>Provides <strong>one</strong> free <strong>Research</strong> Factory counter (not operated initally).</li>
            </ul>
    </p>`,
        allowHTML: true,
    });

    tippy('#tippySource9', {
        content: `<p>
        Ecoplants [c30] (5vp) era2
            <ul>
                <li><strong>Colonists</strong> now cost <strong>5c</strong> to purchase [not cumulative with multiple Ecoplants].</li>
                <li><strong>10c</strong> discount on <strong>Outpost</strong> cards.</li>
            </ul>
    </p>`,
        allowHTML: true,
    });

    tippy('#tippySource10', {
        content: `<p>
        Outpost [c100] (5vp) era2
            <ul>
                <li><strong>+5</strong> Colony Support Limit.</li>
                <li><strong>+5</strong> Hand Limit.</li>
                <li>Provides <strong>one</strong> free <strong>Titanium</strong> Factory counter (not operated initally).</li>
            </ul>
    </p>`,
        allowHTML: true,
    });

    tippy('#tippySource11', {
        content: `<p>
        Space Station [c120] (10vp) era3
            <ul>
                <li>After purchasing, replace this card with the <strong>Orbital Medicine</strong> Special Factory counter.</li>
                <li>This special factory produces one <strong>Orbital Medicine</strong> Production card per turn, <strong>if operated.</strong></li>
                <li>+1 Colony Support Limit, <strong>if operated.</strong></li>
            </ul>
    </p>`,
        allowHTML: true,
    });

    tippy('#tippySource12', {
        content: `<p>
        Planetary Cruiser [c160] (15vp) era3
            <ul>
                <li>After purchasing, replace this card with the <strong>Ring Ore</strong> Special Factory counter.</li>
                <li>This special factory produces one <strong>Ring Ore</strong> Production card per turn, <strong>if operated.</strong></li>
                <li>+1 Colony Support Limit, <strong>if operated.</strong></li>
            </ul>
    </p>`,
        allowHTML: true,
    });

    tippy('#tippySource13', {
        content: `<p>
        Moonbase [c200] (20vp) era3
            <ul>
                <li>After purchasing, replace this card with the <strong>Moon Ore</strong> Special Factory counter.</li>
                <li>This special factory produces one <strong>Moon Ore</strong> Production card per turn, <strong>if operated.</strong></li>
                <li>+1 Colony Support Limit, <strong>if operated.</strong></li>
            </ul>
    </p>`,
        allowHTML: true,
    });

    
}

/**
 * 
 * @param {string} cardType or wa ti re mi nc om ro mo
 * @returns {obj} cardObj
 */
export function drawCard(cardType, playerId) {
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
    if (cardType === 'Re' || cardType === 'ScientistsFactory') {
        cardType = 'Re'; // override incoming cardType ScientistsFactory
        possibleCards = [9, 10, 11, 12, 13, 14, 15, 16, 17];
    }
    if (cardType === 'Mi' || cardType === 'OrbitalLabFactory') {
        cardType = 'Mi'; // override incoming cardType OrbitalLabFactory
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
        ownerId: playerId,
        isSelected: false,
    }
    state.cardIdSeed++;
    return cardObj;
}






export function addFactory(player, reqType = 'Or') {
    // console.log('welcome to addFactory()...');
    // console.log('colonist.colonist:', player.colonist)
    // console.log('player:', player)
    let f = {};
    if (reqType === 'Or') { f.type = reqType; f.ownerId = player.id; }
    if (reqType === 'Wa') { f.type = reqType; f.ownerId = player.id; }
    if (reqType === 'Ti') { f.type = reqType; f.ownerId = player.id; }
    if (reqType === 'Re') { f.type = reqType; f.ownerId = player.id; }
    if (reqType === 'Mi') { f.type = reqType; f.ownerId = player.id; }
    if (reqType === 'Nc') { f.type = reqType; f.ownerId = player.id; }
    if (reqType === 'ScientistsFactory') { f.type = reqType; f.ownerId = player.id; }
    if (reqType === 'OrbitalLabFactory') { f.type = reqType; f.ownerId = player.id; }
    if (reqType === 'Om') { f.type = reqType; f.ownerId = player.id; }
    if (reqType === 'Ro') { f.type = reqType; f.ownerId = player.id; }
    if (reqType === 'Mo') { f.type = reqType; f.ownerId = player.id; }
    f.isManned = false;
    // auto-man logic attempt
    f.mannedBy = 'unmanned';

    let availableOperators = 0;
    let operatorsCurrentlyManningSomething = 0;

    let colonistActivelyManningCount = 0;
    let robotActivelyManningCount = 0;
    let availableColonistCount = player.colonist*1;
    let availableRobotCount = player.robots*1;

    player.factories.map(factory => {
        if (factory.isManned){
            operatorsCurrentlyManningSomething++;
            if (factory.mannedBy == 'colonist'){
                colonistActivelyManningCount++;
                availableColonistCount--;
            }
            if (factory.mannedBy == 'robot'){
                robotActivelyManningCount++;
                availableRobotCount--;
            }
        }
    })

    player.availableColonistCount = availableColonistCount;
    player.availableRobotCount = availableRobotCount;
    document.getElementById('factoriesMyAvailableColonists').innerHTML = availableColonistCount;
    document.getElementById('factoriesMyAvailableRobots').innerHTML = availableRobotCount;
    player.availableColonistCount = availableColonistCount;
    player.availableRobotCount = availableRobotCount;
    

    if (player.robotsEqCount == 0){
        availableOperators = player.colonist*1 - operatorsCurrentlyManningSomething;
    }
    else{ // has robots equipment
        availableOperators = (player.colonist*1)*2 - operatorsCurrentlyManningSomething;
    }
    
    if (availableOperators > 0){
        f.isManned = true;
        if (f.mannedBy !== 'na'){ // don't auto-man for special factory types that don't get manned
            if (availableColonistCount > 0 ){
                f.mannedBy = 'colonist'
            }
            else{
                f.mannedBy = 'robot'
            }
        }
    }
    // console.log(`${player.name} has ${player.colonist} colonists.`);
    // console.log(`${player.name} has ${operatorsCurrentlyManningSomething} operatorsCurrentlyManningSomething.`);
    // console.log(`${player.name} has ${availableOperators} available operators.`);
    f.id = state.factoryIdSeed;
    state.factoryIdSeed++;
    return f;
}

export function calcVp(){
    // console.log('welcome to calcVp()...')

    state.players.map(player => {
        let playerTotalVp = 0;
        // calc vp from factories
        player.factories.map(factory => {
            // console.log('factory:', factory)
            if (factory.type === "Or") {
                if (factory.isManned) { playerTotalVp++; }
            }
            if (factory.type === "Wa") {
                if (factory.isManned) { playerTotalVp++; }
            }
            if (factory.type === "Ti") {
                if (factory.isManned) { playerTotalVp = playerTotalVp + 2; }
            }
            if (factory.type === "Re") {
                if (factory.isManned) { playerTotalVp = playerTotalVp + 2; }
            }
            if (factory.type === "Mi") {
                if (factory.isManned) { playerTotalVp = playerTotalVp + 3; }
            }
            if (factory.type === "Nc") {
                if (factory.isManned) { playerTotalVp = playerTotalVp + 3; }
            }
        })
        // console.log('playerTotalVp (before eq):', playerTotalVp)
        player.ownedEquipment.map(eq => {
            // console.log('eq.vp:', eq.vp)
            playerTotalVp = playerTotalVp + eq.vp
        })
        player.vp = playerTotalVp;

        // trigger era change if needed
        if (playerTotalVp >= 10 && state.currentEra == 1){
            state.currentEra = 2;
        }
        if (playerTotalVp >= state.era3Trigger && state.currentEra == 2){
            state.currentEra = 3;
        }
        // era2Trigger
        // era3Trigger
        // currentEra
        // players
    })
}