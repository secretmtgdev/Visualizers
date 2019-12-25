(function() {
    let nums;
    let speed;
    document.querySelector('#animate').addEventListener('click', () => {
        setup();
    })

    async function setup() {
        let perm = document.querySelector('#permutation');
        perm.innerHTML = '';
        let size = parseInt(document.querySelector('#size').value);
        nums = new Array(size);
        for(let i = 1; i <= nums.length; i++) {
            nums[i-1]=i;
        }

        for(let i = 0; i < nums.length; i++) {
            let rand = Math.floor(Math.random() * nums.length);
            let tmp = nums[i];
            nums[i] = nums[rand];
            nums[rand] = tmp;
        }

        perm.style.gridTemplateColumns = `repeat(${nums.length}, 1fr)`;
        speed = parseInt(document.querySelector('#speed').value);
        for(let i = 0; i < nums.length; i++) {
            let div = document.createElement('div');
            div.classList.add('number');
            div.dataset.id = nums[i];
            div.innerText = nums[i];
            perm.appendChild(div);
        }
        await nextPermutation(nums);
    }
    
    async function nextPermutation(nums) {
        // find the first non decreasing value 
        let i = nums.length - 2;
        action.innerText = 'Finding the first non decreasing value';
        while(i >= 0 && nums[i] >= nums[i+1]) {
            await activeStepDown(nums, i);
            i--;
        }
        smallest.innerText = i;

        // check to see that we can construct a new permutation
        if(i >=0 ) {
            action.innerText = 'Finding the first value from the right that is just larger than nums[i]'
            let j = nums.length - 1;
            while(j >= 0 && nums[j] <= nums[i]) {
                await activeStepDown(nums, j)
                j--;
            }
            larger.innerText = j;
            await swap(nums, i, j);
        }
        action.innerText = 'Reversing the values from i to j to get the appropriate permutation';
        await reverse(nums, i + 1);
        action.innerText = 'Done';
    }

    async function reverse(nums, start) {
        let i = start, j = nums.length - 1;
        while(i < j) {
            await swap(nums, i, j);
            i++; j--;
        }
    }

    async function swap(nums, i, j) {
        let tmp = nums[i];
        let ith = document.querySelector(`[data-id='${nums[i]}']`);ith.classList.add('active');
        let jth = document.querySelector(`[data-id='${nums[j]}']`);jth.classList.add('active');
        nums[i] = nums[j];
        nums[j] = tmp;
        var ti = ith.cloneNode(true), tj = jth.cloneNode(true);
        await sleep(speed);
        ith.parentNode.replaceChild(tj, ith);
        jth.parentNode.replaceChild(ti, jth);
        ti ? ti.classList.remove('active') & ith.classList.remove('active') : ith.classList.remove('active');
        tj ? tj.classList.remove('active') & jth.classList.remove('active') : jth.classList.remove('active');
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function activeStepDown(nums, k) {
        document.querySelector(`[data-id='${nums[k]}']`).classList.add('active');
        await sleep(speed);
        document.querySelector(`[data-id='${nums[k]}']`).classList.remove('active');
    }

})();