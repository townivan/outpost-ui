import * as main from './main.js';

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

/* Randomize array in-place using Durstenfeld shuffle algorithm */
export function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

export function logit(msg) {
    let stamp = displayTime();
    let targetEl = document.getElementById('log');
    targetEl.innerHTML = targetEl.innerHTML + `<div>${stamp} > Round ${main.state.round}: ${msg}</div>`;
}

function displayTime() {
    var str = "";

    var currentTime = new Date()
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    var seconds = currentTime.getSeconds()

    if (minutes < 10) {
        minutes = "0" + minutes
    }
    if (seconds < 10) {
        seconds = "0" + seconds
    }
    str += hours + ":" + minutes + ":" + seconds + " ";
    if (hours > 11) {
        str += "PM"
    } else {
        str += "AM"
    }
    return str;
}

export function getPlayerByTurnOrder(turnOrderNumber) {
    for (let i = 0; i < main.state.players.length; i++) {
        if (main.state.players[i].turnOrder === turnOrderNumber) {
            return main.state.players[i];
        }
    }
}
export function getPlayerById(id) {
    for (let i = 0; i < main.state.players.length; i++) {
        if (main.state.players[i].id === id) {
            return main.state.players[i];
        }
    }
}
export function getCardById(cardId) {
    for (let j = 0; j < main.state.players.length; j++) {
        for (let i = 0; i < main.state.players[j].cards.length; i++) {
            // console.log(`checking: ${main.state.players[j].name} ${main.state.players[j].cards[i].id}`)
            if (main.state.players[j].cards[i].id === cardId*1) { // convert to number with *1
                return main.state.players[j].cards[i];
            }
        }
    }
}
export function getPlayerMe() {
    for (let i = 0; i < main.state.players.length; i++) {
        if (main.state.players[i].isYou) {
            return main.state.players[i];
        }
    }
}
export function isObjInHereWithValue(arr, key, val) {
    // console.log('welcome to isObjInHereWithValue(arr, key, val)...');
    // console.log('arr', arr);
    // console.log('key', key);
    // console.log('val', val);
    let result = false;
    arr.map(obj => {
        if (obj[key] === val) {
            result = true;
        }
    })
    return result;
}
/**
 * 
 * @param {array} arr array
 * @param {string} key 
 * @param {*} val if looking for a number, make it a number when passing or it won't match
 */
export function getObjInHereWithValue(arr, key, val) {
    // console.log('welcome to getObjInHereWithValue(arr, key, val)...');
    // console.log('arr', arr);
    // console.log('key', key);
    // console.log('val', val);
    let result = null;
    arr.map(obj => {
        if (obj[key] === val) {
            result = obj;
        }
    })
    return result;
}
export function getSelectedCards(){
    let arrayOfSelectedCards = [];
    let selectedCardEls = [...document.querySelectorAll('.pcard--selected')];
    selectedCardEls.map(el => {
        let card = getCardById(el.dataset.id);
        arrayOfSelectedCards.push(card);
    })
    return arrayOfSelectedCards;
}
export function getSelectedAmountFromCards(){
    let thecards = getSelectedCards();
    let selectedAmount = 0;
    thecards.map(card => {
        selectedAmount += card.value;
    })
    return selectedAmount;
}
export function spendCards(arrayOfCards = null){
    let thecards = null;
    if (arrayOfCards){
        thecards = arrayOfCards; // for ai
    }
    else{
        thecards = getSelectedCards(); // for me
    }
    thecards.map(card => {
        // console.log('I want to spend this card: ', card)
        // find which array in which player has this card...
        for (let j = 0; j < main.state.players.length; j++) {
            for (let i = 0; i < main.state.players[j].cards.length; i++) {
                if (main.state.players[j].cards[i].id === card.id*1) { // convert to number with *1
                    main.state.players[j].cards.splice(i, 1); // remove it
                    return;
                }
            }
        }
    })
}
export function simpleArrayContains(arr, value){
    return (arr.indexOf(value) > -1);
}

// ai util stuff.
export function getMaxHandValue(player){
    let sum = 0;
    player.cards.map(card => {
        sum += card.value*1;
    })
    return sum;
}
export function randomBool(){ // https://stackoverflow.com/a/36756561
    var a = new Uint8Array(1);
    crypto.getRandomValues(a);
    return a[0] > 127;
}
export function stupidSelectCardsToPay(player, targetValue){ // sums lowest value cards until target value achieved
    console.log('welcome to stupidSelectCardsToPay()...')
    // var clonedCards = JSON.parse(JSON.stringify(player.cards))
    // clonedCards.sort(compareValues('value'));
    player.cards.sort(compareValues('value'));
    // console.log('clonedCards:', clonedCards)
    // clonedCards.sort(util.compareValues('value', 'desc'));
    let selectedCards = [];
    let selectedSum = 0;
    // for (let x=0; x<clonedCards.length; x++){
    for (let x=0; x<player.cards.length; x++){
        selectedCards.push(player.cards[x]);
        selectedSum += player.cards[x].value;
        if (selectedSum >= targetValue*1){
            break;
        }
    }
    // console.log('selectedCards:', selectedCards)
    return selectedCards;
}
export function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}
export function printEqUpForBid(){
    let str = ''
    main.state.eqUpForBidArray.map(eq => {
        str += eq.name + ', '
    })
    str = str.replace(/,\s*$/, "");
    return str;
}
export function printSeatOrder(){
    let seatOrderReminder = '';
    main.state.playerIdsBySeatArray.map(id => {
        seatOrderReminder += getPlayerById(id).name + ' '
    })
    console.log('seatOrder:', seatOrderReminder)
}