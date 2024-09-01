
const tasks = [];
let time = 0;
let timer = null;
let timerBreak = null;
const minuIni = 0.5;
const minuBre = 0.2;

const nomTask = document.querySelector('#itTask');
const form = document.querySelector('#form');
const taskName = document.querySelector('#time #taskName');

renderTime();

function createTask(value){
    const newTask = {
        id: Math.round(Math.random() * 100)+1,
        title: value,
        completed: false
    };
    tasks.unshift(newTask);
}
form.addEventListener('submit', e => {
    e.preventDefault();
    if (nomTask.value != ''){
        createTask(nomTask.value);
        nomTask.value = '';
        renderTasks();
    }
})
function renderTasks(){
    const html = tasks.map(task =>{
        return `
            <div class="task">
                <div class="completed">${task.completed ? `<span class="done">Done</span>` : `<button class="start-button" data-id="${task.id}">Start</button>`}</div>
                <div class="title">${task.title}</div>
                <button class="drop-button" data-id="${task.id}">X</button>
            </div>`;
    });
    const tasksCon = document.querySelector('#tasks');
    tasksCon.innerHTML = html.join(" ");
    //----------------------------------------------
    const startButtons = document.querySelectorAll('.task .start-button');
    startButtons.forEach(button => {
        button.addEventListener('click', e =>{
            if (!timer){
                const id = button.getAttribute('data-id');
                startButtonHandler(id);
                button.textContent = 'In progress ...';
            }
        })
    });
    //----------------------------------------------para borrar
    const dropButtons = document.querySelectorAll('.task .drop-button');
    dropButtons.forEach(button => {
        button.addEventListener('click', e =>{
            const id = button.getAttribute('data-id');
            const taskIndex = tasks.findIndex((task) => parseInt(task.id) === parseInt(id));
            tasks.splice(taskIndex, 1);
            //------------------------
            if (timer){
                clearInterval(timer);
                clearInterval(timerBreak);
                time = 0;
                timer = null;
                timerBreak = null;
            }
            taskName.textContent ='';
            renderTasks();
            renderTime();
        })
    });
}
function startButtonHandler(id){
    time = minuIni * 60;
    const taskIndex = tasks.findIndex((task) => parseInt(task.id) === parseInt(id));
    taskName.textContent = tasks[taskIndex].title;
    timer = setInterval(() => {
        timeHandler(id);
    }, 1000);
}
function timeHandler(id){
    time--;
    renderTime();    
    if(time === 0){
        clearInterval(timer);
        markCompleted(id);
        timer = null
        taskName.textContent ='';
        renderTasks();
        startBreak();
    }
}
function startBreak(){
    time = minuBre * 60;
    taskName.textContent = 'Break';
    timerBreak = setInterval(()=>{
        timerBreakHandler();
    }, 1000);
}
function timerBreakHandler(){
    time--;
    renderTime();
    if(time === 0){
        clearInterval(timerBreak);
        timerBreak = null;
        taskName.textContent ='';
        renderTasks();
    }
}
function renderTime(){
    const timeDiv = document.querySelector('#time #value');
    const minutes = parseInt(time / 60);
    const seconds = parseInt(time % 60);
    timeDiv.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
function markCompleted(id){
    const taskIndex = tasks.findIndex((task) => parseInt(task.id) === parseInt(id));
    tasks[taskIndex].completed = true;
}