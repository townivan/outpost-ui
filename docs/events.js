import * as main from './main.js';
import * as util from './util.js';
import * as turn from './turn.js';
// import * as bid from './bid.js';
import * as auction from './auction.js';

export function firstInit() {

    // document-level event handler (Factory management)
    document.addEventListener('click',function(e){

        if(e.target && e.target.classList.contains('factoryBtn')){
            //do something
            let me = util.getPlayerMe();
            let hasRobots = false;
            if (me.robotsEqCount > 0 ){ hasRobots = true; }
            let thisFactory = util.getObjInHereWithValue(me.factories, 'id', e.target.dataset.guid*1)

            // console.log('me:', me)
            // console.log('hasRobots:', hasRobots)
            // console.log('thisFactory:', thisFactory)

            //console.log('that is a factory');
            let indicator1 = e.target.querySelector('.indicator1');
            let indicator2 = e.target.querySelector('.indicator2');
            let indicator3 = e.target.querySelector('.indicator3');

            if (e.target.dataset.state === 'unmanned'){
                // increment to...
                if (me.availableColonistCount > 0 || me.availableRobotCount > 0){
                    indicator1.classList.add('hideme');
                    indicator2.classList.remove('hideme');
                    indicator3.classList.add('hideme');
                    e.target.dataset.state = "colonist";
                    thisFactory.mannedBy = 'colonist';
                    thisFactory.isManned = true;
                }
            }
            else if (e.target.dataset.state === 'colonist'){
                // increment to...
                if (hasRobots){
                    indicator1.classList.add('hideme');
                    indicator2.classList.add('hideme');
                    indicator3.classList.remove('hideme');
                    e.target.dataset.state = "robot";
                    thisFactory.mannedBy = 'robot';
                    thisFactory.isManned = true;
                }
                else{
                    indicator1.classList.remove('hideme');
                    indicator2.classList.add('hideme');
                    indicator3.classList.add('hideme');
                    e.target.dataset.state = "unmanned";
                    thisFactory.mannedBy = 'unmanned';
                    thisFactory.isManned = false;
                }
            }
            else if (e.target.dataset.state === 'robot'){
                // increment to...
                indicator1.classList.remove('hideme');
                indicator2.classList.add('hideme');
                indicator3.classList.add('hideme');
                e.target.dataset.state = "unmanned";
                thisFactory.mannedBy = 'unmanned';
                thisFactory.isManned = false;
            }

            me.updateFactoryCounts();
            main.calcVp();
            // console.log('me:', me)
            main.render();
        }
    });

    // top nav events
    document.getElementById('overviewViewBtn').addEventListener('click', function (e) {
        // console.log('overviewViewBtn was clicked')
        document.getElementById('overviewPanel').classList.remove('hideme');
        document.getElementById('turnManageFactoriesArea').classList.remove('hideme');
        document.getElementById('turnActionsArea').classList.remove('hideme');
        document.getElementById('logArea').classList.remove('hideme');

        document.getElementById('biddingArea').classList.add('hideme');
    })
    document.getElementById('auctionViewBtn').addEventListener('click', function (e) {
        // console.log('auctionViewBtn was clicked')
        document.getElementById('overviewPanel').classList.add('hideme');
        document.getElementById('turnManageFactoriesArea').classList.add('hideme');
        document.getElementById('turnActionsArea').classList.add('hideme');
        document.getElementById('logArea').classList.add('hideme');

        document.getElementById('biddingArea').classList.remove('hideme');
    })


    // turn buttons BEGIN
    document.getElementById('endTurnBtn').addEventListener('click', function (e) {
        turn.endTurnBtn();
    })
    document.getElementById('buyButton').addEventListener('click', function (e) {
        let me = util.getPlayerMe();
        let buyNumber = document.getElementById('buyNumber').value;
        let buySelect = document.getElementById('buySelect');
        if (buySelect.value === 'colonist'){
            turn.buyColonists(me, buyNumber); // (player, buyNumber)
        }
        if (buySelect.value.includes('factory')){
            turn.buyFactory(me, buyNumber, buySelect.value); // (player, buyNumber)
        }
    })
    document.getElementById('biddableSelect').addEventListener('change', function (e) {
        let selectValue = this.options[this.selectedIndex].value;
        console.log('selectValue:', selectValue)
        let selectedEq = util.getObjInHereWithValue(main.state.eqUpForBidArray, 'id', selectValue*1);
        console.log('selectedEq:', selectedEq)
        document.getElementById('biddableInitialAmount').value = selectedEq.price;
    })
    // turn buttons END

    // auction stuff BEGIN
    document.getElementById('auctionPassBtn').addEventListener('click', function (e) {
        let me = util.getPlayerMe();
        auction.passBid(me, 'pass');
    })
    document.getElementById('auctionPassAllBtn').addEventListener('click', function (e) {
        let me = util.getPlayerMe();
        auction.passBid(me, 'passall');
    })
    document.getElementById('auctionCounterBidBtn').addEventListener('click', function (e) {
        let me = util.getPlayerMe();
        let counterBidAmt = document.getElementById('newBidAmountInput').value*1;
        let selectedAmount = util.getSelectedAmountFromCards();

        let isValidBid = false;
        if (selectedAmount >= counterBidAmt){
            if (counterBidAmt > main.state.bid_currentBid){
                isValidBid = true;
            }
        }

        if (!isValidBid){
            document.getElementById('counterBidError').innerHTML = `Invalid bid. Selected card(s) < currentBid`;
            return;
        }

        auction.counterBid(me, counterBidAmt); // counterBid(player, realBidAmt)
    })

    document.getElementById('biddableStartBid').addEventListener('click', function (e) {
        // turn.startBid();
        let me = util.getPlayerMe();
        let bidAmt = document.getElementById('biddableInitialAmount').value * 1;
        let biddableSelect = document.getElementById('biddableSelect').value;
        let targetEq = util.getObjInHereWithValue(main.state.eqUpForBidArray, 'id', biddableSelect*1);
        // bid.startBid(me, bidAmt, targetEq);

        let selectedAmount = util.getSelectedAmountFromCards();

        let isValidBid = false;
        if (selectedAmount >= targetEq.price){
            isValidBid = true;
        }

        if (!isValidBid){
            document.getElementById('bidError').innerHTML = `Invalid bid. Selected card(s) < price`;
            return;
        }
        else{
            document.getElementById('bidError').innerHTML = ``;
        }
        auction.startAuction(me, selectedAmount, targetEq)
    })
    // auction stuff END



    

    // Mega selectors: None
    document.getElementById('pcardmaster_none').addEventListener('click', function (e) {
        let allpcards = [...document.querySelectorAll('.pcard')];
        allpcards.map(pcard => {
            pcard.classList.remove('pcard--selected');
            const cb = pcard.querySelector('input');
            cb.checked = false; // the inner checkbox
            const cardObj = util.getCardById(pcard.dataset.id*1);
            cardObj.isSelected = false;
        })
    })
    // Mega selectors: All
    document.getElementById('pcardmaster_all').addEventListener('click', function (e) {
        let allpcards = [...document.querySelectorAll('.pcard')];
        allpcards.map(pcard => {
            pcard.classList.add('pcard--selected');
            const cb = pcard.querySelector('input');
            cb.checked = true; // the inner checkbox
            const cardObj = util.getCardById(pcard.dataset.id*1);
            cardObj.isSelected = true;
        })
    })


    // Mass select for each type.
    let allMasterSelectButtons = [...document.querySelectorAll('.pcard-master')];
    allMasterSelectButtons.map(button => {
        // console.log('masterSelectButton:', button)

        button.addEventListener('click', function (e) {
            let massSelectDom = e.target;
            let cardTypeIndicator = massSelectDom.dataset.type;
    
            let areAllAlreadySelected = true; // assume all are selected
            let allpcardsOfThisType = [...document.querySelectorAll(`.${cardTypeIndicator}`)];
            allpcardsOfThisType.map(pcard => {
                if (!pcard.classList.contains('pcard--selected')){ // found one not selected
                    areAllAlreadySelected = false;
                }
            });
            if (areAllAlreadySelected){ // unselect them all
                allpcardsOfThisType.map(pcard => {
                    pcard.classList.remove('pcard--selected');
                    const cb = pcard.querySelector('input');
                    cb.checked = false; // the inner checkbox
                    const cardObj = util.getCardById(pcard.dataset.id*1);
                    cardObj.isSelected = false;
                });
            }
            else{ // not all are already selected...so select them all
                allpcardsOfThisType.map(pcard => {
                    pcard.classList.add('pcard--selected');
                    const cb = pcard.querySelector('input');
                    cb.checked = true; // the inner checkbox
                    const cardObj = util.getCardById(pcard.dataset.id*1);
                    cardObj.isSelected = true;
                });
            }
            calcProductionCardSelection();
        });
    })

} // end firstInit()


// Happens each render() so newly generated DOM cards have event listeners
export function initCardListeners() {
    const allProductionCardElements = [...document.querySelectorAll('#productionCardArea .pcard')];

    allProductionCardElements.map(pcard => {
        pcard.addEventListener('click', function (e) {

            let cardDom = e.target;
            let cardObj = util.getCardById(cardDom.dataset.id*1)
            // console.log('this cardDom was clicked:', cardDom)
            // console.log('this cardObj was clicked:', cardObj)

            // a normal click on a pcard should toggle it.  checked -> unchecked; unchecked -> checked
            cardDom.classList.toggle('pcard--selected');
            let cb = cardDom.querySelector('input');
            cb.checked = !cb.checked; // toggle the inner checkbox to match
            cardObj.isSelected = !cardObj.isSelected; 


            // let areAllSelected_or = true;
            // let allPCards_or = [...document.querySelectorAll('.pcard_or')]
            // allPCards_or.map(pcard => {
            //     if (!pcard.classList.contains('pcard--selected')) { // a non-selected card
            //         areAllSelected_or = false;
            //     }
            // })
            // if (areAllSelected_or) {
            //     document.getElementById('pcardmaster_or').classList.add('pcard-master--selected');
            // }
            // else {
            //     document.getElementById('pcardmaster_or').classList.remove('pcard-master--selected');
            // }

            // let areAllSelected_wa = true;
            // let allPCards_wa = [...document.querySelectorAll('.pcard_wa')]
            // allPCards_wa.map(pcard => {
            //     if (!pcard.classList.contains('pcard--selected')) { // a non-selected card
            //         areAllSelected_wa = false;
            //     }
            // })
            // if (areAllSelected_wa) {
            //     document.getElementById('pcardmaster_wa').classList.add('pcard-master--selected');
            // }
            // else {
            //     document.getElementById('pcardmaster_wa').classList.remove('pcard-master--selected');
            // }
            calcProductionCardSelection();
        });
    })
    // initFactoryListeners();
}

export function calcProductionCardSelection() {
    const allProductionCardElements = [...document.querySelectorAll('.pcard--selected')];
    let selectedValueSum = 0;
    allProductionCardElements.map(pcard => {
        selectedValueSum += pcard.value * 1;
    })
    document.getElementById('cardsSelected').innerHTML = selectedValueSum.toString();
}