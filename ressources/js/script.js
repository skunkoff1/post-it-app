let postItArray = [];
let drag = false;
let write = true;

let dragButton = document.getElementById('dragButton');
let writeButton = document.getElementById('writeButton');

dragButton.style.backgroundColor = "red";
dragButton.style.color = "white";
writeButton.style.height = "80px";
writeButton.style.width = "200px";
writeButton.style.fontSize = "25px";
class Postit {
    width;
    height;
    zIndex;
    posX;
    posY;
    isDraging;
    post;
    xOnStart;
    yOnStart;
    resize;
    isResizing;

    constructor(x, y, width, height) {
        this.posX = x;
        this.posY = y;
        this.width = width;
        this.height = height;
        this.zIndex = postItArray.length + 1;
        this.isDraging = false;
        this.isResizing = false;
        this.post = document.createElement('div');
        this.resize = document.createElement('div');
        this.createPostIt();
    }

    createPostIt() {
        let board = document.querySelector('.board');
        this.post.className = "post-it";
        this.post.id = "post" + postItArray.length;
        this.post.style.width = this.width + "px";
        this.post.style.height = this.height + "px";
        this.post.style.left = this.posX + "px";
        this.post.style.top = this.posY + "px";
        this.post.style.zIndex = this.zIndex;
        this.resize.className = "resize";
        this.resize.style.left = parseInt(this.width - 20) + "px";
        this.resize.style.top = parseInt(this.height - 20) + "px";
        postItArray.push(this.post);
        this.post.appendChild(this.resize);
        board.appendChild(this.post);
        this.post.addEventListener('mousedown', this.startDrag.bind(this));
        this.post.addEventListener('mouseup', this.stopDrag.bind(this));
        this.post.addEventListener('mousemove', this.drag.bind(this));
        this.resize.addEventListener('mousedown', this.startResize.bind(this));
        this.resize.addEventListener('mouseup', this.stopResize.bind(this));
        this.resize.addEventListener('mousemove', this.resizing.bind(this));
    }

    startDrag(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (drag === true) {
            this.isDraging = true;
            this.post.style.zIndex += 1000;
            this.xOnStart = e.clientX + window.pageXOffset;
            this.yOnStart = e.clientY + window.pageYOffset;
        }

    }
    stopDrag(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (drag === true) {
            this.isDraging = false;
            this.post.style.zIndex -= 1000;
            this.posX = this.post.style.left;
            this.posY = this.post.style.top;
        }
    }
    drag(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (this.isDraging === true && drag === true) {
            this.post.style.left = parseInt(e.clientX) + parseInt(this.posX) - this.xOnStart + "px";
            this.post.style.top = parseInt(e.clientY) + parseInt(this.posY) - this.yOnStart + "px";
        }
    }
    startResize(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        this.isResizing = true;
        this.post.style.zIndex += 1000;
        this.xOnStart = e.clientX + window.pageXOffset;
        this.yOnStart = e.clientY + window.pageYOffset;
    }
    stopResize(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        this.isResizing = false;
        this.width = this.post.style.width;
        this.height = this.post.style.height;
        this.post.style.zIndex -= 1000;
    }
    resizing(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (this.isResizing === true) {
            this.post.style.width = parseInt(e.clientX) + parseInt(this.width) - this.xOnStart + "px";
            this.post.style.height = parseInt(e.clientY) + parseInt(this.height) - this.yOnStart + "px";
            this.resize.style.left = parseInt(this.post.style.width) - 20 + "px";
            this.resize.style.top = parseInt(this.post.style.height) - 20 + "px";
        }
    }
}
let post1 = new Postit(400, 400, 150, 150);
let post2 = new Postit(200, 400, 100, 100);

document.onmousemove = function(e) {
    let x = document.querySelector('.horizontal');
    let y = document.querySelector('.vertical');
    x.innerHTML = e.clientX + window.pageXOffset;
    y.innerHTML = e.clientY + window.pageYOffset;

};

function canDrag() {
    drag = true;
    write = false;
    writeButton.style.backgroundColor = "red";
    writeButton.style.color = "white";
    writeButton.style.height = "60px";
    writeButton.style.width = "150px";
    writeButton.style.fontSize = "16px";
    dragButton.style.backgroundColor = "green";
    dragButton.style.color = "black";
    dragButton.style.height = "80px";
    dragButton.style.width = "200px";
    dragButton.style.fontSize = "22px";
}

function canWrite() {
    drag = false;
    write = true;
    dragButton.style.backgroundColor = "red";
    dragButton.style.color = "white";
    dragButton.style.height = "60px";
    dragButton.style.width = "150px";
    dragButton.style.fontSize = "16px";
    writeButton.style.backgroundColor = "green";
    writeButton.style.color = "black";
    writeButton.style.height = "80px";
    writeButton.style.width = "200px";
    writeButton.style.fontSize = "22px";
}

/**********************************************************************************/
/****************** FAIRE UN FRIGO CE SERA VACHEMENT PLUS STYLE *******************/
/**********************************************************************************/