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
    // let targetEl = document.getElementById('log');
    // targetEl.innerHTML = `<div>${stamp} > Round ${main.state.round}: ${msg}</div>` + targetEl.innerHTML;
    let targetEl = document.getElementById('log2');
    targetEl.value = `${stamp} > Round ${main.state.round}: ${msg}\n` + targetEl.value;
}
export function auctionlogit(msg) {
    // let stamp = displayTime();
    let targetEl = document.getElementById('auctionLog');
    targetEl.innerHTML = `<div>${main.state.bid_actionCount}: ${msg}</div>` + targetEl.innerHTML;
    main.state.bid_actionCount++;
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
export function getSeatOrder(){
    let seatOrderReminder = '';
    main.state.playerIdsBySeatArray.map(id => {
        seatOrderReminder += getPlayerById(id).name + ' '
    })
    return seatOrderReminder;
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
    // console.log('welcome to stupidSelectCardsToPay()...')
    player.cards.sort(compareValues('value'));
    let selectedCards = [];
    let selectedSum = 0;
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

export function smartSelectCardsToPay(player, targetValue){
    console.log(`%c Welcome to smartSelectCardsToPay()...`, 'background-color:tan')
    player.cards.sort(compareValues('value'));
    
    let results = selectBestCoins(player.cards, targetValue)[0]; // use the new algorithm

    // create an array from these which is connected to the real hand
    let linkedResults = [];
    results.map(card => {
        linkedResults.push(getCardById(card.id));
    })
    return linkedResults;
}

function selectBestCoins(arr, target) {
    // the final power set
    var powers = [];
    var result;
    // the total number of sets that the power set will contain
    var total = Math.pow(2, arr.length);
  
    // loop through each value from 0 to 2^n
    for (var i = 0; i < total; i++) {
      // our set that we add to the power set
      var tempSet = [];
      var tempSum = 0;
      // convert the integer to binary
      var num = i.toString(2);
  
      // pad the binary number so 1 becomes 001 for example
      while (num.length < arr.length) {
        num = "0" + num;
      }
  
      // build the set that matches the 1's in the binary number
      for (var b = 0; b < num.length; b++) {
        if (num[b] === "1") {
          tempSet.push(arr[b]);
          tempSum += arr[b].value;
        }
      }
  
      // add this set to the final power set
      if (tempSum >= target) {
        powers.push(tempSet);
      }
    }
  
    var filtered_array_value;
    filtered_array_value = getMinimumByValue(powers);
    while (true) {
      var tmp = getMinimumByValue(powers);
      if (tmp[0]!=undefined && getLastSum(filtered_array_value) == getSumValue(tmp[0],tmp[0].length)) {
        filtered_array_value.push(tmp[0]);
      } else {
        break;
      }
    }
    result = filtered_array_value;
    if (filtered_array_value.length > 1) {
      var filtered_array_wieght;
      filtered_array_wieght=getMinimumByWeight(filtered_array_value);
      while (true) {
        var tmp = getMinimumByWeight(filtered_array_value);
        if (tmp[0]!=undefined && getLastSum(filtered_array_wieght) == getSumWeight(tmp[0],tmp[0].length)) {
          filtered_array_wieght.push(tmp[0]);
        } else {
          break;
        }
      }
      result = filtered_array_wieght;
    }
    if (filtered_array_value.length > 1) {
      var filtered_array_elements;
      filtered_array_elements=getMinimumByElements(filtered_array_wieght);
      result = filtered_array_elements;
    }
    return result;
  }
  function getSumValue(arr,length) {
    var sum = 0;
    for (var i = 0; i < length; i++) {
      sum += arr[i].value;
    }
    return sum;
  }
  
  function getSumWeight(arr,length) {
      var sum = 0;
      for (var i = 0; i < length; i++) {
        sum += arr[i].weight;
      }
      return sum;
    }
  function getLastSum(arr) {
      var sum = 0;
      for (var i = 0; i < arr[arr.length-1].length; i++) {
        sum += arr[arr.length-1][i].value;
      }
      return sum;
    }
  function getMinimumByValue(arr) {
    var lowest = Number.POSITIVE_INFINITY;
    var tmp;
    var indexOfLowest;
    for (var i = 0; i < arr.length; i++) {
      var tmpSum = 0;
      for (var j = 0; j < arr[i].length; j++) {
        tmpSum += arr[i][j].value;
      }
  
      if (tmpSum < lowest) {
        lowest = tmpSum;
        indexOfLowest = i;
      }
    }
    return arr.splice(indexOfLowest, 1);
  }
  
  function getMinimumByWeight(arr) {
    var lowest = Number.POSITIVE_INFINITY;
    var indexOfLowest;
    for (var i = 0; i < arr.length; i++) {
      var tmpSum = 0;
      for (var j = 0; j < arr[i].length; j++) {
        tmpSum += arr[i][j].weight;
      }
  
      if (tmpSum < lowest) {
        lowest = tmpSum;
        indexOfLowest = i;
      }
    }
    return arr.splice(indexOfLowest, 1);
  }
  function getMinimumByElements(arr) {
    var highest = Number.NEGATIVE_INFINITY;
    var indexOfhighest;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].length > highest) {
        highest = arr[i].length;
        indexOfhighest = i;
      }
    }
    return arr.splice(indexOfhighest, 1);
  }
