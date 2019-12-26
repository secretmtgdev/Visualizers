(function() {
    const algorithms = {
        'bubblesort': BubbleSort,
        'quicksort': Quicksort,
        'mergesort': Mergesort
    }
    let size = 100;
    let arr;
    let time = 10;
    let compare = 0;
    if(document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setup);
    } else {
        setup();
    }


    async function setup() {
        form.addEventListener('submit', function(event) {
            reset();
            data = new FormData(form)
            let output = '';
            for(const entry of data) {
                let type = entry[0], val = entry[1];
                if(type === 'speed') time = val;
                else if (type === 'size') size = val;
                else algorithm = val; 
            }
            log.innerText = output;
            event.preventDefault();
            console.log(algorithm)
            generateArray(algorithms[algorithm])
        }, false);
    }

    async function generateArray(cb) {
        arr = new Array(size);
        for(let i = 0; i < size; i++) arr[i] = (i+1);
        // randomize
        for(let i = 0; i < arr.length; i++) {
            let randIdx = Math.round(Math.random() * (arr.length-1));
            swap(arr, randIdx, i);
        }

        visual.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        for(let i = 0; i < arr.length; i++) {
            let div = document.createElement('div');
            div.dataset.id = arr[i];
            div.className = 'default';
            let innerDiv = document.createElement('div');
            innerDiv.style.height = `${Math.round(100*(1 - arr[i]/size))}px`;
            div.appendChild(innerDiv);
            visual.appendChild(div);
        }
        await cb();
    }

    async function Mergesort() {
        console.log(arr);
        await mergeSortHelper(arr, 0, arr.length - 1);
        console.log(arr);
    }

    async function Quicksort() {
        await quicksortHelper(arr, 0, arr.length - 1);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// HELPERS
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function mergeSortHelper(arr, lo, hi) {
        if(lo < hi) {
            let mid = lo + Math.floor((hi - lo)/2);
            await mergeSortHelper(arr, lo, mid);
            await mergeSortHelper(arr, mid + 1, hi);
            merge(arr, lo, mid, hi);
        }
    }

    async function quicksortHelper(arr, lo, hi) {
        if(lo < hi) {
            let p = await partition(arr, lo, hi);
            await quicksortHelper(arr, lo, p - 1);
            await quicksortHelper(arr, p + 1, hi);
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// SUB HELPERS
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function merge(arr, lo, mid, hi) {
        let n1 = mid - lo + 1, n2 = hi - mid;
        let a = new Array(n1), b = new Array(n2);
        for(let i = 0; i < n1; i++) a[i] = arr[lo + i];
        for(let i = 0; i < n2; i++) b[i] = arr[mid + 1 + i];

        let i = 0, j = 0, k = lo;
        while(i < n1 && j < n2) {
            if(a[i] <= b[j]) {
                arr[k] = a[i];
                i++;
            } else {
                arr[k] = b[j]
                j++;
            }
            k++;
        }

        while(i < n1) {
            arr[k] = a[i];
            i++;
            k++;
        }

        while(j < n2) {
            arr[k] = b[j];
            j++;
            k++;
        }
    }

    async function partition(arr, lo, hi) {
        let pivot = arr[hi], i = lo - 1;
        for(let j = lo; j < hi; j++) {
            var ith = document.querySelector(`[data-id='${arr[i + 1]}']`), jth = document.querySelector(`[data-id='${arr[j]}']`);
            ith.classList.add('swap');
            jth.classList.add('swap');
            await sleep(time);
            comparisons.innerText = compare++;
            if(arr[j] < pivot) {
                i++;
                swap(arr, i, j, {animate: true});
                var ti = ith.cloneNode(true), tj = jth.cloneNode(true);
                if(i !== j) {
                    ith.parentNode.replaceChild(tj, ith);
                    jth.parentNode.replaceChild(ti, jth);
                }
            }
            await sleep(time);
            ti ? ti.classList.remove('swap') & ith.classList.remove('swap') : ith.classList.remove('swap');
            tj ? tj.classList.remove('swap') & jth.classList.remove('swap') : jth.classList.remove('swap');
        }
        swap(arr, i+1, hi);
        var ith = document.querySelector(`[data-id='${arr[i + 1]}']`), jth = document.querySelector(`[data-id='${arr[hi]}']`);
        ith.classList.add('swap');
        jth.classList.add('swap');
        await sleep(time);
        var ti = ith.cloneNode(true), tj = jth.cloneNode(true);
        if(i + 1 !== hi) {
            ith.parentNode.replaceChild(tj, ith);
            jth.parentNode.replaceChild(ti, jth);
        }
        await sleep(time);
        ti ? ti.classList.remove('swap') & ith.classList.remove('swap') : ith.classList.remove('swap');
        tj ? tj.classList.remove('swap') & jth.classList.remove('swap') : jth.classList.remove('swap');
        return i + 1;
    }

    async function BubbleSort() {
        for(let i = 0; i < arr.length - 1; i++) {
            let sorted = true;
            for(let j = 0; j < arr.length - i - 1; j++) {
                var ith = document.querySelector(`[data-id='${arr[j]}']`), jth = document.querySelector(`[data-id='${arr[j+1]}']`);
                ith.classList.add('swap');
                jth.classList.add('swap');
                await sleep(time);
                comparisons.innerText = compare++;
                if(arr[j+1] < arr[j]) {
                    sorted = false;
                    swap(arr, j, j+1, {animate: true});
                    var ti = ith.cloneNode(true), tj = jth.cloneNode(true);
                    ith.parentNode.replaceChild(tj, ith);
                    jth.parentNode.replaceChild(ti, jth);
                }
                await sleep(time);
                ti ? ti.classList.remove('swap') & ith.classList.remove('swap') : ith.classList.remove('swap');
                tj ? tj.classList.remove('swap') & jth.classList.remove('swap') : jth.classList.remove('swap');
            }
            if(sorted)break;
        }
    }

    function swap(arr, i, j, obj) {
        let tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function reset() {
        comparisons.innerHTML = '';
        visual.innerHTML = '';
        compare = 0;
    }
})();