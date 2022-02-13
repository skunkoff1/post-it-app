let postItArray = []; // Tableau de tous les post-it
let dragMode = true; // Flag bouton deplaver post-it
let resizeMode = false; // Flag bouton redimensionner post-it
let count = 0;

// Récupération des boutons
let buttonDrag = document.getElementById('modeButtonDrag');
let buttonResize = document.getElementById('modeButtonResize');

// Style par défaut des boutons -> mode par défaut == deplacer

buttonResize.style.height = "40px";
buttonResize.style.width = "150px";
buttonResize.style.backgroundColor = "rgb(226, 48, 48)";

// Class Post-it
class Postit {
    width; // Largeur à l'écran
    height; // Hauteur à l'écran
    zIndex; // Son z-index
    posX; // Position horizontale à l'écran
    posY; // Position verticale à l'écran
    isDraging; // Flag déplavement enclenché
    isResizing; // Flag redimensionnement enclenché
    post; // la div principale du post-it
    resize; // la div pour le resize (coin bas droit du post-it)
    xOnStart; // sa position horizontal de départ pour calculer le déplacement
    yOnStart; // sa position verticale de départ pour calculer le déplacement

    constructor(x, y, width, height) {
        this.posX = x;
        this.posY = y;
        this.width = width;
        this.height = height;
        this.isDraging = false;
        this.isResizing = false;
        this.post = document.createElement('textarea');
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
        postItArray.push(this.post);
        this.zIndex = postItArray.length+count;
        this.post.style.zIndex = this.zIndex;
        board.appendChild(this.post);
        this.post.addEventListener('mousedown', this.startDrag.bind(this));
        this.post.addEventListener('mouseup', this.stopDrag.bind(this));
        this.post.addEventListener('mousemove', this.drag.bind(this));
    }

    startDrag(e) {
        // e.preventDefault();
        // e.stopImmediatePropagation();
        if (dragMode === true) {
            this.isDraging = true;
            this.post.style.zIndex = "1000";
            this.xOnStart = e.clientX + window.pageXOffset;
            this.yOnStart = e.clientY + window.pageYOffset;
        }

    }
    stopDrag(e) {
        // e.preventDefault();
        // e.stopImmediatePropagation();
        if (dragMode === true) {
            count++;
            this.isDraging = false;
            this.post.style.zIndex = postItArray.length+count;
            this.posX = this.post.style.left;
            this.posY = this.post.style.top;
        }
    }
    drag(e) {
        // e.preventDefault();
        // e.stopImmediatePropagation();
        if (this.isDraging === true && dragMode === true) {
            this.post.style.left = parseInt(e.clientX) + parseInt(this.posX) - this.xOnStart + "px";
            this.post.style.top = parseInt(e.clientY) + parseInt(this.posY) - this.yOnStart + "px";
        }
    }    
}

document.onmousemove = function (e) {
    let x = document.querySelector('.horizontal');
    let y = document.querySelector('.vertical');
    x.innerHTML = e.clientX + window.pageXOffset;
    y.innerHTML = e.clientY + window.pageYOffset;

};

function mode(mode) {    
    if (mode === 'drag') {
        dragMode = true;
        resizeMode = false;
        buttonDrag.style.height = "60px";
        buttonDrag.style.width = "180px";
        buttonDrag.style.backgroundColor = "rgb(18, 187, 18)";
        buttonResize.style.height = "40px";
        buttonResize.style.width = "150px";
        buttonResize.style.backgroundColor = "rgb(226, 48, 48)";
        postItArray.forEach((item) => {
            item.style.resize = "none";
        })
    }
    if (mode === 'resize') {
        dragMode = false;
        resizeMode = true;
        buttonDrag.style.height = "40px";
        buttonDrag.style.width = "150px";
        buttonDrag.style.backgroundColor = "rgb(226, 48, 48)";
        buttonResize.style.height = "60px";
        buttonResize.style.width = "180px";
        buttonResize.style.backgroundColor = "rgb(18, 187, 18)";
        postItArray.forEach((item) => {
            item.style.resize = "both";
        })
    }
}

function addPostIt() {
    let post = new Postit(500,400,150,150);
}


/**********************************************************************************/
/****************** FAIRE UN FRIGO CE SERA VACHEMENT PLUS STYLE *******************/
/**********************************************************************************/