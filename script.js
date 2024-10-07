let array = [];
let sortingSpeed = 50;  // Speed control (default 50ms)
let barCount = 30;  // Default number of bars
let isSorting = false;  // Track if sorting is in progress

// Generate a random array based on user-selected number of bars
function generateArray() {
    if (isSorting) return;  // Prevent generation during sorting
    array = [];
    const arrayContainer = document.getElementById('array-container');
    arrayContainer.innerHTML = '';
    for (let i = 0; i < barCount; i++) {
        const value = Math.floor(Math.random() * 100) + 1;
        array.push(value);
        const bar = document.createElement('div');
        bar.className = 'array-bar';
        bar.style.height = `${value * 3}px`;
        arrayContainer.appendChild(bar);
    }
}

// Swap the heights of two bars during sorting
function swap(bars, i, j) {
    [array[i], array[j]] = [array[j], array[i]];
    bars[i].style.height = `${array[i] * 3}px`;
    bars[j].style.height = `${array[j] * 3}px`;
}

// Change color of the bars during sorting
function activateBar(bars, index, color) {
    bars[index].style.backgroundColor = color;
}

// Delay function to control the speed of sorting animations
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

// Sorting algorithms implementation

async function bubbleSort() {
    if (isSorting) return;
    isSorting = true;

    const bars = document.getElementsByClassName('array-bar');
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            activateBar(bars, j, '#FFA07A');  // Color during comparison
            activateBar(bars, j + 1, '#FFA07A');

            if (array[j] > array[j + 1]) {
                swap(bars, j, j + 1);
            }
            await delay(sortingSpeed);
            activateBar(bars, j, '#537895');  // Revert color
            activateBar(bars, j + 1, '#537895');
        }
        activateBar(bars, array.length - i - 1, '#2ECC71');  // Mark as sorted
    }
    isSorting = false;
}

async function quickSort(start = 0, end = array.length - 1) {
    if (start < end) {
        let pivotIndex = await partition(start, end);
        await quickSort(start, pivotIndex - 1);
        await quickSort(pivotIndex + 1, end);
    } else if (start >= 0 && end >= 0 && start < array.length && end < array.length) {
        document.getElementsByClassName('array-bar')[start].style.backgroundColor = '#2ECC71';
        document.getElementsByClassName('array-bar')[end].style.backgroundColor = '#2ECC71';
    }
}

async function partition(start, end) {
    const bars = document.getElementsByClassName('array-bar');
    let pivotValue = array[end];
    let pivotIndex = start;
    bars[end].style.backgroundColor = '#FFA07A';  // Pivot

    for (let i = start; i < end; i++) {
        bars[i].style.backgroundColor = '#FFA07A';
        if (array[i] < pivotValue) {
            swap(bars, i, pivotIndex);
            pivotIndex++;
        }
        await delay(sortingSpeed);
        bars[i].style.backgroundColor = '#537895';
    }

    swap(bars, pivotIndex, end);
    await delay(sortingSpeed);
    bars[end].style.backgroundColor = '#537895';
    return pivotIndex;
}

async function mergeSort(start = 0, end = array.length - 1) {
    if (start >= end) return;
    const mid = Math.floor((start + end) / 2);
    await mergeSort(start, mid);
    await mergeSort(mid + 1, end);
    await merge(start, mid, end);
}

async function merge(start, mid, end) {
    const bars = document.getElementsByClassName('array-bar');
    const left = array.slice(start, mid + 1);
    const right = array.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            array[k] = left[i];
            i++;
        } else {
            array[k] = right[j];
            j++;
        }
        bars[k].style.height = `${array[k] * 3}px`;
        bars[k].style.backgroundColor = '#FFA07A';
        await delay(sortingSpeed);
        bars[k].style.backgroundColor = '#537895';
        k++;
    }

    while (i < left.length) {
        array[k] = left[i];
        bars[k].style.height = `${array[k] * 3}px`;
        bars[k].style.backgroundColor = '#FFA07A';
        await delay(sortingSpeed);
        bars[k].style.backgroundColor = '#537895';
        i++;
        k++;
    }

    while (j < right.length) {
        array[k] = right[j];
        bars[k].style.height = `${array[k] * 3}px`;
        bars[k].style.backgroundColor = '#FFA07A';
        await delay(sortingSpeed);
        bars[k].style.backgroundColor = '#537895';
        j++;
        k++;
    }

    for (let i = start; i <= end; i++) {
        bars[i].style.backgroundColor = '#2ECC71';
    }
}

// Toggle between light and dark themes
function toggleTheme() {
    const body = document.body;
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
    }
}

// Reset sorting and regenerate a new array
function reset() {
    if (isSorting) return;  // Prevent resetting during sorting
    document.getElementById('array-container').innerHTML = '';
    generateArray();  // Generate a fresh array
}

// Function to start sorting based on user choice
function startSorting() {
    const selectedSort = document.getElementById('sort-dropdown').value;
    if (selectedSort === 'bubble') bubbleSort();
    else if (selectedSort === 'quick') quickSort();
    else if (selectedSort === 'merge') mergeSort();
    }

// Adjust sorting speed
function updateSpeed(speed) {
    sortingSpeed = 110 - speed;  // Adjust speed based on slider value
    document.getElementById('speedDisplay').innerText = `${sortingSpeed}ms`;
}

// Update the number of bars based on user input
function updateBarCount(count) {
    barCount = count;
    generateArray();
}

// Generate the initial array on page load
generateArray();
