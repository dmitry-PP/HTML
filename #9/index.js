const openFormButton = document.getElementsByClassName('open-form')[0];
const closeFormButton = document.getElementsByClassName('close')[0];
// const cangeButton = document.getElementsByClassName('change')[0];
// const deleteButton = document.getElementsByClassName('delete')[0];
// const openBodyButton = document.getElementsByClassName('open-body')[0];
const saveFormButton = document.getElementsByClassName('button')[0];

// const titleContainer = document.getElementsByClassName('title')[0];
// const body = document.getElementsByClassName('hidden-body')[0];
const popup = document.getElementsByClassName('back-fone')[0];
const photo = document.getElementById('photo');
const tasks = document.getElementsByClassName('list-tasks')[0];

let reader = new FileReader();

class Task{
	static validate(title, content, urlPhoto){
		if(title === "") throw "Cant be empty string";
		if(content === "") throw "Cant be empty string";
			
		return new this(title, content, urlPhoto);
	}

	constructor(title, content, urlPhoto){
		this.title = title;
		this.content = content;
		this.urlPhoto = urlPhoto;
	}
}

class TaskManager{
	constructor(){
		this._tasks = new Array();
	}

	addTask = (task) => this._tasks.push(task);
	getTask = (index) => this._tasks[index];
	deleteTask = (index) => this._tasks.splice(index,1);
	changeTask = (index, task) => this._tasks[index] = task;

	get taskLength (){ 
		return this._tasks.length;
	}
}

function addLiToUl(task, index){
	const demo = document.getElementById('demo-li');
	let li = document.createElement("li");

	li.innerHTML = createLi(task, index)
	tasks.appendChild(li);

}

function updateTask(index){
	const form = document.getElementById('form');

	setOrClearForm(form,taskManager.getTask(index))

	form.dataset.update = "1";
	form.dataset.changed = index + ""
}

const taskManager = new TaskManager();

function MouseDown (current) {
	let titleContainer = current.closest(".title");

 	const handleMouseUp = () => {
  		titleContainer.style.background = "#5CE0A8";
    	document.removeEventListener('mouseup', handleMouseUp);
	};

	titleContainer.style.background = "#DAE5EB";
 	document.addEventListener('mouseup', handleMouseUp);
}

function Click(current){ //current === this
	let titleContainer = current.closest(".title");
	let body = titleContainer.nextElementSibling;

	titleContainer.style.background = "#DAE5EB";
	if(body.dataset.open == "0") {

		body.style.display = 'grid';
		body.dataset.open = "1";
		titleContainer.style.borderRadius = "10px 10px 0px 0px"
	}
	else{

		body.style.display = 'none';
		titleContainer.style.background = "#5CE0A8";
		body.dataset.open = "0";
		titleContainer.style.borderRadius = "10px";
	}
}

function removeTask(index){
	taskManager.deleteTask(index);
	tasks.children[index].remove()
}

openFormButton.addEventListener('click', function(e){
	popup.style.display = "block";
})

closeFormButton.addEventListener('click', function(e){
	setOrClearForm();
	form.dataset.update == "0"	
})

photo.addEventListener('change', function(e){

	let selectedFile = photo.files[0];
	if (selectedFile) {

	    reader.addEventListener("load", function(e){
			const image = document.getElementById('img');
	    	image.src = reader.result;

	    	document.getElementsByClassName('image-wrapper')[0].style.display = "block";
		});

		reader.readAsDataURL(selectedFile);
	}

})

saveFormButton.addEventListener('click', function(e){
	const form = document.getElementById('form');

	let title = form.querySelector('#title').value;
	let content = form.querySelector('#content').value;
	let imageData = document.getElementById('img').src;

	try{
		let task = Task.validate(title,content,imageData);

		if(form.dataset.update == "0"){
			taskManager.addTask(task)
			addLiToUl(task, taskManager.taskLength-1);
		}
		else{
			let index = form.dataset.changed			
			taskManager.changeTask(index, task)

			let li = document.createElement("li");
			li.innerHTML = createLi(task, index)
			
			tasks.children[index].replaceWith(li)
			form.dataset.update = "0"
		}
		setOrClearForm(form)
	}
	catch(error){
		alert("Неправильные данные в форме "+ error.message);
	}

})

function setOrClearForm(form = null, task = null){
	if(form==null) form = document.getElementById('form');

	form.querySelector('#title').value = (task!=null)? task.title : null;
	form.querySelector('#content').value = (task!=null)? task.content : null;
	document.getElementById('img').src = (task!=null)? task.urlPhoto : null;

	photo.value = null;

	document.getElementsByClassName('image-wrapper')[0].style.display =(task!=null)? "block" : "none";
	popup.style.display = (task!=null)? "block" :"none";

}

function createLi(task, index){
	
    return `<div class="title">
        <div class="title-cnt">${task.title}</div>
            <div class="open-body btn" onmousedown="MouseDown(this)" onclick="Click(this)">
                <svg viewBox='0 0 140 140' width='24' height='24' xmlns='http://www.w3.org/2000/svg'><g><path d='m121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z' fill='black'/></g></svg>
            </div>
        </div>
        <div class="hidden-body" data-open="0">
            <div class="body-cnt">${task.content}
                <div align="center" style="margin-top: 10px;">
                    <img src="${task.urlPhoto}" width="700px" id="photo-img">
                </div>
	        </div>
        <div class="change btn" onclick="updateTask(${index})">Изменить</div>
        <div class="delete btn" onclick="removeTask(${index})">Удалить</div>
    </div>
    `

}