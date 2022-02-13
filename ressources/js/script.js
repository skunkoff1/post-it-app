let postItArray = [];

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
        this.isDraging = true;
        this.post.style.zIndex += 1000;
        this.xOnStart = e.clientX + window.pageXOffset;
        this.yOnStart = e.clientY + window.pageYOffset;
    }
    stopDrag(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        this.isDraging = false;
        this.posX = this.post.style.left;
        this.posY = this.post.style.top;
        this.post.style.zIndex -= 1000;
        console.log(this)
    }
    drag(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (this.isDraging == true) {
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
        if (this.isResizing == true) {
            this.post.style.width = parseInt(e.clientX) + parseInt(this.width) - this.xOnStart + "px";
            this.post.style.height = parseInt(e.clientY) + parseInt(this.height) - this.yOnStart + "px";
            this.resize.style.left = parseInt(this.post.style.width) - 20 + "px";
            this.resize.style.top = parseInt(this.post.style.height) - 20 + "px";
            console.log(this.post.style.width)
        }
    }
}
let post1 = new Postit(400, 400, 150, 150);
let post2 = new Postit(200, 400, 100, 100);



document.onmousemove = function (e) {
    let x = document.querySelector('.horizontal');
    let y = document.querySelector('.vertical');
    x.innerHTML = e.clientX + window.pageXOffset;
    y.innerHTML = e.clientY + window.pageYOffset;

};


/**********************************************************************************/
/****************** FAIRE UN FRIGO CE SERA VACHEMENT PLUS STYLE *******************/
/**********************************************************************************/