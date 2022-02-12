let postItArray = [];

class Postit {
    width;
    height;
    zIndex;
    poxX;
    posY;

    constructor(x, y, width, height) {
        this.posX = x;
        this.posY = y;
        this.width = width;
        this.height = height;
        this.zIndex = postItArray.length + 1;
        this.createPostIt();
    }

    createPostIt() {
        let board = document.querySelector('.board');
        let post = document.createElement('div');
        post.className = "post-it";
        post.id = "post" + postItArray.length;
        post.style.width = this.width + "px";
        post.style.height = this.height + "px";
        post.style.left = this.posX + "px";
        post.style.top = this.posY + "px";
        post.style.zIndex = this.zIndex;
        postItArray.push(post);
        board.appendChild(post);
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

/**********************************************************************************/
/****************** FAIRE UN FRIGO CE SERA VACHEMENT PLUS STYLE *******************/
/**********************************************************************************/