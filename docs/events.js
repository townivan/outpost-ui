import * as main from './main.js';

export function firstInit() {

    // range slider calc timing
    // https://www.impressivewebs.com/onchange-vs-oninput-for-range-sliders/

    const slider = document.getElementById('myRange');
    slider.max = main.state.cards.length;
    const o = document.getElementById('rangenum');
    const s = document.getElementById('rangesum');

    slider.addEventListener('input', function () {
        o.value = slider.value;
        let sum = 0;
        main.state.cards.map((card, i) => {
            if (i <= slider.value) {
                sum += card.value;
            }
        });
        s.value = sum;
    }, false);

    // https://www.geeksforgeeks.org/print-sums-subsets-given-set/

    let testarr = [1, 3, 6];
    let n = testarr.length;
    let final = [];
    // https://www.geeksforgeeks.org/print-sums-subsets-given-set/
    // based on recursive c# example
    subsetSums(testarr, 0, n - 1, 0);
    // console.log('final.sort((a, b) => a - b):', final.sort((a, b) => a - b))
    // https://alligator.io/js/array-sort-numbers/
    //myArray.sort((a, b) => a - b);


    function subsetSums(arr, l, r, sum) {

        // Print current subset 
        if (l > r) {
            //Console.Write(sum + " "); 
            // console.log('sum ', sum)
            final.push(sum);
            return;
        }

        // Subset including arr[l] 
        subsetSums(arr, l + 1, r, sum + arr[l]);

        // Subset excluding arr[l] 
        subsetSums(arr, l + 1, r, sum);
    }

    let arrayToWork = [1, 3, 6];
    // console.log(arrayToWork)
    let x = combinations(arrayToWork).filter(a => a.length >= 2)
    function combinations(array) {
        return new Array(1 << array.length).fill().map(
            (e1, i) => array.filter((e2, j) => i & 1 << j));
    }
    // console.log('combinations(x):', x)

    let arrayOfComboObjects = []
    arrayOfComboObjects.push({ value: 0, match: [0] });
    arrayToWork.map(comboArr => {
        const arrSum = comboArr
        arrayOfComboObjects.push({ value: arrSum, match: [comboArr] });
    })

    const arrSum = comboArr => comboArr.reduce((a, b) => a + b, 0)

    x.map(comboArr => {
        let thesum = arrSum(comboArr)
        arrayOfComboObjects.push({ value: thesum, match: comboArr });
    })
    // console.log('arrayOfComboObjects:', arrayOfComboObjects)

    // let testarr2 = ArrayAddition(testarr);
    // console.log('testarr2', testarr2);
    // // https://coderbyte.com/algorithm/subset-sum-problem-revised
    // function ArrayAddition(arr) {
    //     var mp = {
    //         0: 1
    //     };

    //     arr = arr.sort(function (a, b) { return a - b });
    //     var mx = arr[arr.length - 1];

    //     for (var i = 0; i < arr.length - 1; i++) {
    //         var keys = Object.keys(mp);
    //         //console.log(keys, arr[i]);
    //         for (var j = 0; j < keys.length; j++) {
    //             var next = parseInt(keys[j]) + arr[i];
    //             if (next == mx) {
    //                 return true;
    //             } else if (next < mx && next > (0 - (arr.length - i - 1) * mx)) {
    //                 mp[next] = 1;
    //             }

    //         }
    //     }

    //     return false;
    // }

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
            }
            else {
                pcard.classList.remove('pcard--selected')
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
            }
            else {
                pcard.classList.remove('pcard--selected')
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