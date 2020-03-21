import * as main from './main.js';
import * as util from './util.js';
import * as turn from './turn.js';

export function firstInit() {

    document.getElementById('endTurnBtn').addEventListener('click', function (e) {
        turn.endTurnBtn();
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

}

export function calcProductionCardSelection() {
    const allProductionCardElements = [...document.querySelectorAll('.pcard--selected')];
    let selectedValueSum = 0;
    allProductionCardElements.map(pcard => {
        selectedValueSum += pcard.value * 1;
    })
    document.getElementById('cardsSelected').innerHTML = selectedValueSum.toString();
}