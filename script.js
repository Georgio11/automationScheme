let wrapper = document.querySelector('.wrapper');
let popup = document.querySelector('.popup');
let optionsPopup = document.querySelector('.options_popup');
let btn = document.querySelector('.btn');
let closeBtn = document.querySelector('.close span');
let optionsBtn = document.querySelector('.options_btn');
let closeBtn2 = document.querySelector('.options_popup .close span');
let startBtn = document.querySelector('.start_btn');
let stopBtn = document.querySelector('.stop_btn');
let sensor = document.querySelectorAll('.sensor span');

function adaptationElements() {
    const aspectRatio = window.innerWidth / window.innerHeight;
    const aspectClass = aspectRatio >= 2
        ? 'modificate1'
        : aspectRatio >= 1.5
            ? 'modificate2'
            : aspectRatio > 1
                ? 'modificate3'
                : 'modificate4';

    wrapper.className = `wrapper ${aspectClass}`;
}

adaptationElements();
window.addEventListener('resize', adaptationElements);

btn.addEventListener('click', ()=> {
    popup.classList.add('active');
});

closeBtn.addEventListener('click', ()=> {
    popup.classList.remove('active');
});

optionsBtn.addEventListener('click', ()=> {
    optionsPopup.classList.add('active');
});

closeBtn2.addEventListener('click', ()=> {
    optionsPopup.classList.remove('active');
});

let form = document.querySelector('form');
let input1 = document.querySelector('.level');
let input2 = document.querySelector('.gas_consumption_out');
let input3 = document.querySelector('.water_temperature_in');
let input4 = document.querySelector('.gas_temperature_in');

let intervalId;

let numbers = [0, 0, 0, 0];


let lights = document.querySelectorAll('.light');
let lights1 = document.querySelectorAll('.light1');


form.addEventListener('submit', function(event) {
    
    event.preventDefault();
    optionsPopup.classList.remove('active');
    startBtn.classList.add('active');
    stopBtn.classList.remove('active');
    
    if (intervalId) {
        clearInterval(intervalId);
    }
    
    numbers = [
        parseFloat(input1.value) || 0,
        parseFloat(input2.value) || 0,
        parseFloat(input3.value) || 0,
        parseFloat(input4.value) || 0
    ];
});

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const canvas2 = document.getElementById('canvas1');
const context2 = canvas2.getContext('2d');

const canvas3 = document.getElementById('canvas2');
const context3 = canvas3.getContext('2d');

const canvas4 = document.getElementById('canvas3');
const context4 = canvas4.getContext('2d');

const canvas5 = document.getElementById('canvas4');
const context5 = canvas5.getContext('2d');

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const data1 = [];
const data2 = [];
const data3 = [];
const data4 = [];

const maxDataPoints = canvasWidth;

function drawGraphs() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context2.clearRect(0, 0, canvas2.width, canvas2.height);
    context3.clearRect(0, 0, canvas3.width, canvas3.height);
    context4.clearRect(0, 0, canvas4.width, canvas4.height);
    context5.clearRect(0, 0, canvas5.width, canvas5.height);

    const step = canvasWidth / Math.min(data1.length, maxDataPoints - 1);

    const scale1 = 1000;
    const scale2 = 2000;  
    const scale3 = 1;  
    const scale4 = 500;
    const scale5 = 500;

    drawGraph(context, data1, 'blue', step, scale1);
    drawGraph(context, data2, 'red', step, scale1);
    drawGraph(context, data3, 'green', step, scale1);
    drawGraph(context, data4, 'orange', step, scale1);

    drawGraph(context2, data1, 'blue', step, scale2);
    drawGraph(context3, data2, 'red', step, scale3);
    drawGraph(context4, data3, 'green', step, scale4);
    drawGraph(context5, data4, 'orange', step, scale5);
}

function drawGraph(context, data, color, step, scale) {
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = 2;
    
    for (let i = 0; i < Math.min(data.length, maxDataPoints); i++) {
        // numbers = [input1.value, input2.value, input3.value, input4.value];
        // const maxN = Math.max(...numbers);
        const x = i * step;
        const y = canvasHeight - (data[i] / scale) * canvasHeight;
        if (i === 0) {
            context.moveTo(x, y);
        } else {
            context.lineTo(x, y);
        }
    }

    context.stroke();

}

function updateGraphs(newNumbers) {
    data1.push(newNumbers[0]);
    data2.push(newNumbers[1]);
    data3.push(newNumbers[2]);
    data4.push(newNumbers[3]);

    if (data1.length > maxDataPoints) {
        data1.shift();
        data2.shift();
        data3.shift();
        data4.shift();
    }

    context.clearRect(0, 0, canvasWidth, canvasHeight);
    drawGraphs();
}


startBtn.addEventListener('click', ()=> {
        let seconds = 0;

    const timerElement = document.querySelector('.timer span');
    timerElement.textContent = formatTime(seconds);


    const timerInterval = setInterval(function () {
        seconds++;
        timerElement.textContent = formatTime(seconds);
    }, 1000);

    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
    
        return `${hours}:${minutes}:${remainingSeconds}`;
    }

    startBtn.classList.remove('active');
    stopBtn.classList.add('active');
    
    function getRandomVariation() {
        return (Math.random() * 10 - 5) / 100; 
    }
   
    intervalId = setInterval(() => {

        const newNumbers = [];
        numbers.forEach((number, index) => {
            let variation = getRandomVariation();
            let newNumber = number * (1 + variation);

            newNumber = Math.min(Math.max(newNumber, number * 0.95), number * 1.05);
            newNumbers.push(newNumber);
            let result = document.querySelectorAll(`.sensor${index + 1}`);
            result.forEach((r)=> {
                r.textContent = newNumber.toFixed(2);
            });

            let light = lights[index];
            let light1 = lights1[index];
            let trueArr = [900, 0.5, 288, 338];

            if (newNumber >= trueArr[index] * 0.95 && newNumber <= trueArr[index] * 1.05) {
                light.classList.remove('red');
                light.classList.add('green');
                light1.classList.remove('red');
                light1.classList.add('green');
            } else {
                light.classList.remove('green');
                light.classList.add('red');
                light1.classList.remove('green');
                light1.classList.add('red');
            }
        });

        updateGraphs(newNumbers);

    }, 1000);

    function clearGraph() {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context2.clearRect(0, 0, canvasWidth, canvasHeight);
        context3.clearRect(0, 0, canvasWidth, canvasHeight);
        context4.clearRect(0, 0, canvasWidth, canvasHeight);
        context5.clearRect(0, 0, canvasWidth, canvasHeight);
        data1.length = 0;
        data2.length = 0;
        data3.length = 0;
        data4.length = 0;
    }

    stopBtn.addEventListener('click', ()=> {
        clearInterval(timerInterval);
        timerElement.textContent = '0:0:0'
        clearGraph();
        stopBtn.classList.remove('active');
        lights.forEach(light => {
            light.classList.remove('green');
            light.classList.remove('red');
        });
        clearInterval(intervalId);
        input1.value = '';
        input2.value = '';
        input3.value = '';
        input4.value = '';
        sensor.forEach((s)=> {
            s.innerHTML = '0.00';
        });
    });
    
});

let levelBtn = document.querySelector('.line1 .settings');
let levelPopup = document.querySelector('.level_popup');
let closeBtn3 = document.querySelector('.level_popup .close span');

levelBtn.addEventListener('click', ()=> {
    levelPopup.classList.add('active');
});

closeBtn3.addEventListener('click', ()=> {
    levelPopup.classList.remove('active');
});

let consumptionBtn = document.querySelector('.line2 .settings');
let consumptionPopup = document.querySelector('.consumption_popup');
let closeBtn4 = document.querySelector('.consumption_popup .close span');

consumptionBtn.addEventListener('click', ()=> {
    consumptionPopup.classList.add('active');
});

closeBtn4.addEventListener('click', ()=> {
    consumptionPopup.classList.remove('active');
});

let temperature1Btn = document.querySelector('.line3 .settings');
let temperature1Popup = document.querySelector('.temperature1_popup');
let closeBtn5 = document.querySelector('.temperature1_popup .close span');

temperature1Btn.addEventListener('click', ()=> {
    temperature1Popup.classList.add('active');
});

closeBtn5.addEventListener('click', ()=> {
    temperature1Popup.classList.remove('active');
});

let temperature2Btn = document.querySelector('.line4 .settings');
let temperature2Popup = document.querySelector('.temperature2_popup');
let closeBtn6 = document.querySelector('.temperature2_popup .close span');

temperature2Btn.addEventListener('click', ()=> {
    temperature2Popup.classList.add('active');
});

closeBtn6.addEventListener('click', ()=> {
    temperature2Popup.classList.remove('active');
});

