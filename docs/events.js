import * as main from './main.js';
import * as util from './util.js';
import * as turn from './turn.js';
import * as init from './init.js';
import * as auction from './auction.js';

export function pageInit(){}

export function listenerInit() {

    // document-level event handler (Factory management)
    document.addEventListener('click',function(e){

        if(e.target && e.target.classList.contains('factoryBtn')){
            //do something
            let me = util.getPlayerMe();
            let hasRobots = false;
            me.ownedEquipment.map(eq =>{
                if (eq.name === 'Robots'){ hasRobots=true; }
            })
            let thisFactory = util.getObjInHereWithValue(me.factories, 'id', e.target.dataset.guid*1)

            // console.log('me:', me)
            // console.log('hasRobots:', hasRobots)
            console.log('thisFactory:', thisFactory)

            //console.log('that is a factory');
            let indicator1 = e.target.querySelector('.indicator1'); // x unmanned
            let indicator2 = e.target.querySelector('.indicator2'); // colonist 
            let indicator3 = e.target.querySelector('.indicator3'); // robot
            let indicator4 = e.target.querySelector('.indicator4'); // unmanned special factories

            // if (!e.target.classList.contains('indicator4')){

                if (e.target.dataset.state === 'unmanned'){
                    // increment to...
                    if (me.availableColonistCount > 0){ // available colonist
                        indicator1.classList.add('hideme'); // x unmanned
                        indicator2.classList.remove('hideme'); // colonist
                        indicator3.classList.add('hideme'); // robot
                        e.target.dataset.state = "colonist";
                        thisFactory.mannedBy = 'colonist';
                        thisFactory.isManned = true;
                        if (thisFactory.type === 'Om' || 
                            thisFactory.type === 'Ro' || 
                            thisFactory.type == 'Mo'){
                                me.colonistMax++;
                        }
                    }
                    if (me.availableColonistCount < 1 && me.availableRobotCount > 0 
                        && thisFactory.type !== 'Om'  
                        && thisFactory.type !== 'Ro' 
                        && thisFactory.type !== 'Mo'){ // no colonist but an available robot
                        indicator1.classList.add('hideme'); // x unmanned
                        indicator2.classList.add('hideme'); // colonist
                        indicator3.classList.remove('hideme'); // robot
                        e.target.dataset.state = "robot";
                        thisFactory.mannedBy = 'robot';
                        thisFactory.isManned = true;
                    }
                }
                else if (e.target.dataset.state === 'colonist'){
                    // increment to...
                    if (hasRobots && me.availableRobotCount > 0 
                        && thisFactory.type !== 'Om' 
                        && thisFactory.type !== 'Ro' 
                        && thisFactory.type !== 'Mo'){
                        indicator1.classList.add('hideme'); // x unmanned
                        indicator2.classList.add('hideme'); // colonist
                        indicator3.classList.remove('hideme'); // robot
                        e.target.dataset.state = "robot";
                        thisFactory.mannedBy = 'robot';
                        thisFactory.isManned = true;
                    }
                    else{
                        indicator1.classList.remove('hideme'); // x unmanned
                        indicator2.classList.add('hideme'); // colonist
                        indicator3.classList.add('hideme'); // robot
                        e.target.dataset.state = "unmanned";
                        thisFactory.mannedBy = 'unmanned';
                        thisFactory.isManned = false;
                        if (thisFactory.type === 'Om' || 
                            thisFactory.type === 'Ro' || 
                            thisFactory.type == 'Mo'){
                                me.colonistMax--;
                        }
                    }
                }
                else if (e.target.dataset.state === 'robot'){
                    indicator1.classList.remove('hideme'); // x unmanned
                    indicator2.classList.add('hideme'); // colonist
                    indicator3.classList.add('hideme'); // robot
                    e.target.dataset.state = "unmanned";
                    thisFactory.mannedBy = 'unmanned';
                    thisFactory.isManned = false;
                }

                me.updateFactoryCounts();
                main.calcVp();
                // console.log('me:', me)
                main.render();
            // }
        }
    });

    // top nav events
    document.getElementById('overviewViewBtn').addEventListener('click', function (e) {
        let allTabs = [...document.querySelectorAll('.navtab')];
        allTabs.map(tab => tab.classList.remove('navtab--active'));
        e.target.classList.add('navtab--active');

        let allViews = [...document.querySelectorAll('.viewIn')];
        allViews.map(view => {
            if(view.classList.contains('viewInOverview')){
                view.classList.remove('hideme');
            }
            else{
                view.classList.add('hideme');
            }
        })
    })
    document.getElementById('auctionViewBtn').addEventListener('click', function (e) {
        let allTabs = [...document.querySelectorAll('.navtab')];
        allTabs.map(tab => tab.classList.remove('navtab--active'));
        e.target.classList.add('navtab--active');

        let allViews = [...document.querySelectorAll('.viewIn')];
        allViews.map(view => {
            if(view.classList.contains('viewInAuction')){
                view.classList.remove('hideme');
            }
            else{
                view.classList.add('hideme');
            }
        })
    })
    document.getElementById('referenceViewBtn').addEventListener('click', function (e) {
        let allTabs = [...document.querySelectorAll('.navtab')];
        allTabs.map(tab => tab.classList.remove('navtab--active'));
        e.target.classList.add('navtab--active');

        let allViews = [...document.querySelectorAll('.viewIn')];
        allViews.map(view => {
            if(view.classList.contains('viewInReference')){
                view.classList.remove('hideme');
            }
            else{
                view.classList.add('hideme');
            }
        })
    })
    document.getElementById('settingsViewBtn').addEventListener('click', function (e) {
        let allTabs = [...document.querySelectorAll('.navtab')];
        allTabs.map(tab => tab.classList.remove('navtab--active'));
        e.target.classList.add('navtab--active');

        let allViews = [...document.querySelectorAll('.viewIn')];
        allViews.map(view => {
            if(view.classList.contains('viewInSettings')){
                view.classList.remove('hideme');
            }
            else{
                view.classList.add('hideme');
            }
        })
    })

    // settings events
    document.getElementById('settingsSaveBtn').addEventListener('click', function (e) {
        let playerName = document.getElementById('playerName').value;
        localStorage.setItem("outpostPlayerName", playerName);

        init.gameInit();
        console.log('main.state:', main.state)
        turn.startRound();
        main.render();
        document.getElementById('overviewViewBtn').click();
    })

    const allRadioInputsForPlayerAmount = [...document.getElementsByName("aiPlayerAmountRadio")];
    allRadioInputsForPlayerAmount.map(radioEl => {
        radioEl.addEventListener('click', function (e) {
            const thisManyAiOpponents = e.target.dataset.number*1;
            
            const allCPUGroups = [...document.querySelectorAll('.cpuGroup')];
            allCPUGroups.map(groupEl => {
                if (groupEl.dataset.number*1 <= thisManyAiOpponents){
                    groupEl.classList.remove('hideme');
                }
                else{
                    groupEl.classList.add('hideme');
                }
            });
        })
    })
    


    // turn buttons BEGIN
    document.getElementById('endTurnBtn').addEventListener('click', function (e) {
        turn.endTurnBtn();
    })
    document.getElementById('firstTurnHandForWaterBtn').addEventListener('click', function (e) {
        let me = util.getPlayerMe();
        // select all cards
        let allpcards = [...document.querySelectorAll('.pcard')];
        allpcards.map(pcard => {
            pcard.classList.add('pcard--selected');
            const cb = pcard.querySelector('input');
            cb.checked = true; // the inner checkbox
            const cardObj = util.getCardById(pcard.dataset.id*1);
            cardObj.isSelected = true;
        })
        util.spendCards();
        me.factories.push(main.addFactory(me, 'Wa'));
        document.getElementById('firstTurnHandForWaterBtn').classList.add('hideme');
        main.calcVp();
        main.render();
        util.logit(`${me.name} turns in their initial hand for a water factory.`);

    })
    document.getElementById('buyButton').addEventListener('click', function (e) {
        let me = util.getPlayerMe();
        let buyNumber = document.getElementById('buyNumber').value;
        let buySelect = document.getElementById('buySelect');
        if (buySelect.value === 'colonist'){
            turn.buyColonists(me, buyNumber); // (player, buyNumber)
        }
        if (buySelect.value === 'robot'){
            turn.buyRobots(me, buyNumber); // (player, buyNumber)
        }
        if (buySelect.value.includes('factory')){
            turn.buyFactory(me, buyNumber, buySelect.value); // (player, buyNumber)
        }
        document.getElementById('buyNumber').value = 1; // reset to most common value after purchase
    })
    document.getElementById('biddableSelect').addEventListener('change', function (e) {
        let selectValue = this.options[this.selectedIndex].value;
        console.log('selectValue:', selectValue)
        let selectedEq = util.getObjInHereWithValue(main.state.eqUpForBidArray, 'id', selectValue*1);
        console.log('selectedEq:', selectedEq)
        document.getElementById('biddableInitialAmount').value = selectedEq.price;
    })
    document.getElementById('biddableStartBid').addEventListener('click', function (e) {
        // turn.startBid();
        let me = util.getPlayerMe();
        let bidAmt = document.getElementById('biddableInitialAmount').value * 1;
        let biddableSelect = document.getElementById('biddableSelect').value;
        let targetEq = util.getObjInHereWithValue(main.state.eqUpForBidArray, 'id', biddableSelect*1);

        let selectEl = document.getElementById("biddableSelect");
        let selectedOptionDiscountedPrice = selectEl.options[selectEl.selectedIndex].dataset.discountedprice*1;
        // let discountedPrice = document.getElementById('biddableSelect').dataset.discountedprice*1;
        // bid.startBid(me, bidAmt, targetEq);

        let selectedAmount = util.getSelectedAmountFromCards();

        let isValidBid = false;
        // if (selectedAmount >= targetEq.price){
        if (selectedAmount >= selectedOptionDiscountedPrice){
            isValidBid = true;
        }

        if (!isValidBid){
            document.getElementById('bidError').innerHTML = `Invalid bid. Selected card(s) < price`;
            return;
        }
        else{
            document.getElementById('bidError').innerHTML = ``;
            document.getElementById('purchaseError').innerHTML = '';
        }
        auction.startAuction(me, selectedAmount, targetEq)
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

        if (isValidBid){
            document.getElementById('counterBidError').innerHTML = ``;
        }
        else{
            document.getElementById('counterBidError').innerHTML = `Invalid bid. Selected card(s) < currentBid`;
            return;
        }

        auction.counterBid(me, counterBidAmt); // counterBid(player, realBidAmt)
    })
    
    // auction stuff END



    

    // Mega selector: All (toggles between allSelected and noneSelected )
    document.getElementById('pcardmaster_all').addEventListener('click', function (e) {
        let allpcards = [...document.querySelectorAll('.pcard')];
        let areAllSelectedAlready = true; // assume they are all already selected
        allpcards.map(pcard => {
            if (!pcard.classList.contains('pcard--selected')){
                areAllSelectedAlready = false;
            }
        });

        if (areAllSelectedAlready){ // unselect all
            allpcards.map(pcard => {
                pcard.classList.remove('pcard--selected');
                const cb = pcard.querySelector('input');
                cb.checked = false; // the inner checkbox
                const cardObj = util.getCardById(pcard.dataset.id*1);
                cardObj.isSelected = false;
            })
        }
        else{ // select all
            allpcards.map(pcard => {
                pcard.classList.add('pcard--selected');
                const cb = pcard.querySelector('input');
                cb.checked = true; // the inner checkbox
                const cardObj = util.getCardById(pcard.dataset.id*1);
                cardObj.isSelected = true;
            })
        }
        calcProductionCardSelection();
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

            // console.log('this cardDom was clicked:', cardDom)
            // console.log('this cardObj was clicked:', cardObj)

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