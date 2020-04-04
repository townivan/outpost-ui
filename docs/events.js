import * as main from './main.js';
import * as util from './util.js';
import * as turn from './turn.js';
import * as bid from './bid.js';

export function firstInit() {

    // document-level event handler
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
            // console.log('me:', me)
            main.render();
        }
    });


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

    document.getElementById('biddableStartBid').addEventListener('click', function (e) {
        // turn.startBid();
        let me = util.getPlayerMe();
        let bidAmt = document.getElementById('biddableInitialAmount').value * 1;
        let biddableSelect = document.getElementById('biddableSelect').value;
        let targetEq = util.getObjInHereWithValue(main.state.eqUpForBidArray, 'id', biddableSelect*1);
        bid.startBid(me, bidAmt, targetEq);
    })
    


    document.getElementById('pcardmaster_none').addEventListener('click', function (e) {
        let allPCardMasters = [...document.querySelectorAll('.pcard-master')];
        allPCardMasters.map(master => {
            master.classList.add('pcard-master--selected');
            master.click();
        })
    })

    document.getElementById('pcardmaster_all').addEventListener('click', function (e) {
        let allPCardMasters = [...document.querySelectorAll('.pcard-master')];
        allPCardMasters.map(master => {
            master.classList.remove('pcard-master--selected');
            master.click();
        })
    })

    // toggle select all/none of the Or cards in your hand...
    document.getElementById('pcardmaster_or').addEventListener('click', function (e) {
        if (this.classList.contains('pcard-master--selected')) {
            this.classList.remove('pcard-master--selected');
        }
        else {
            this.classList.add('pcard-master--selected');
        }

        let allpcards_or = [...document.querySelectorAll(".pcard_or")];
        allpcards_or.map(pcard => { // arrow function preserves 'this' binding to orig
            if (this.classList.contains('pcard-master--selected')) {
                pcard.classList.add('pcard--selected')
                let innerCB = pcard.querySelector('input');
                innerCB.checked = true;
            }
            else {
                pcard.classList.remove('pcard--selected')
                let innerCB = pcard.querySelector('input');
                innerCB.checked = false;
            }
        })
        calcProductionCardSelection();
    })


    document.getElementById('pcardmaster_wa').addEventListener('click', function (e) {
        if (this.classList.contains('pcard-master--selected')) {
            this.classList.remove('pcard-master--selected');
        }
        else {
            this.classList.add('pcard-master--selected');
        }

        let allpcards_wa = [...document.querySelectorAll(".pcard_wa")];
        allpcards_wa.map(pcard => { // arrow function preserves 'this' binding to orig
            if (this.classList.contains('pcard-master--selected')) {
                pcard.classList.add('pcard--selected')
                let innerCB = pcard.querySelector('input');
                innerCB.checked = true;
            }
            else {
                pcard.classList.remove('pcard--selected')
                let innerCB = pcard.querySelector('input');
                innerCB.checked = false;
            }
        })
        calcProductionCardSelection();
    })
}

export function initCardListeners() {
    const allProductionCardElements = [...document.querySelectorAll('#productionCardArea .pcard')];

    allProductionCardElements.map(pcard => {
        pcard.addEventListener('click', function (e) {


            e.target.classList.toggle('pcard--selected');
            let cb = e.target.querySelector('input');
            // console.log('cb:', cb)
            cb.checked = !cb.checked;


            // e.target.classList.toggle('pcard--selected');

            let areAllSelected_or = true;
            let allPCards_or = [...document.querySelectorAll('.pcard_or')]
            allPCards_or.map(pcard => {
                if (!pcard.classList.contains('pcard--selected')) { // a non-selected card
                    areAllSelected_or = false;
                }
            })
            if (areAllSelected_or) {
                document.getElementById('pcardmaster_or').classList.add('pcard-master--selected');
            }
            else {
                document.getElementById('pcardmaster_or').classList.remove('pcard-master--selected');
            }

            let areAllSelected_wa = true;
            let allPCards_wa = [...document.querySelectorAll('.pcard_wa')]
            allPCards_wa.map(pcard => {
                if (!pcard.classList.contains('pcard--selected')) { // a non-selected card
                    areAllSelected_wa = false;
                }
            })
            if (areAllSelected_wa) {
                document.getElementById('pcardmaster_wa').classList.add('pcard-master--selected');
            }
            else {
                document.getElementById('pcardmaster_wa').classList.remove('pcard-master--selected');
            }
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

/*
export function initFactoryListeners() {
    // console.log('welcome to initFactoryListeners()...')
    const allFactoryButtons = [...document.querySelectorAll('#turnManageFactoriesArea .factoryBtn')];
    console.log('allFactoryButtons:', allFactoryButtons)
    

    allFactoryButtons.map(factory => {
        
        if (factory.getAttribute('listener') !== 'true') {
            factory.addEventListener('click', function (e) {

                console.log('this factory was clicked: ', e.target);

                let cbColonist = e.target.querySelector('.factoryOperatedByColonistCB');
                let cbRobot = e.target.querySelector('.factoryOperatedByRobotCB');
                // console.log('cbColonist:', cbColonist)
                // console.log('cbRobot:', cbRobot)

                console.log('e.target.dataset.state:', e.target.dataset.state)
                if (e.target.dataset.state === 'manned'){
                    // increment to...
                    e.target.dataset.state = "colonist";
                    cbColonist.checked = true;
                }

                const elementClicked = e.target;
                elementClicked.setAttribute('listener', 'true');
                //console.log('event has been attached');
            });
        }


    })

}*/