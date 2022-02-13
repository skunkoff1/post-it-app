let postItArray = []; // Tableau de tous les post-it
let dragMode = true; // Flag bouton deplaver post-it
let resizeMode = false; // Flag bouton redimensionner post-it
let eraseMode = false; // Flag bouton redimensionner post-it
let count = 0;

// Récupération des boutons
let buttonDrag = document.getElementById('modeButtonDrag');
let buttonResize = document.getElementById('modeButtonResize');
let buttonErase = document.getElementById('modeButtonErase');

// Style par défaut des boutons -> mode par défaut == deplacer

buttonResize.style.height = "40px";
buttonResize.style.width = "150px";
buttonResize.style.backgroundColor = "rgb(226, 48, 48)";
buttonErase.style.height = "40px";
buttonErase.style.width = "150px";
buttonErase.style.backgroundColor = "rgb(226, 48, 48)";

// Class Post-it
class Postit {
    width; // Largeur à l'écran
    height; // Hauteur à l'écran
    zIndex; // Son z-index
    posX; // Position horizontale à l'écran
    posY; // Position verticale à l'écran
    isDraging; // Flag déplavement enclenché
    isResizing; // Flag redimensionnement enclenché
    post; //la div principale du post-it 
    text; // textarea
    erase; // la div pour supprimer (coin bas gauche du post-it)
    cross; //la croix dans la div erase
    xOnStart; // sa position horizontal de départ pour calculer le déplacement
    yOnStart; // sa position verticale de départ pour calculer le déplacement

    constructor(x, y, width, height) {
        this.posX = x;
        this.posY = y;
        this.width = width;
        this.height = height;
        this.isDraging = false;
        this.isResizing = false;
        this.post = document.createElement("div");
        this.text = document.createElement('textarea');
        this.erase = document.createElement('div');
        this.cross = document.createElement('div');
        this.createPostIt();
    }

    createPostIt() {
        let board = document.querySelector('.board');
        this.post.className = "post-it";
        this.post.id = "post" + postItArray.length;
        this.text.style.width = this.width + "px";
        this.text.style.height = this.height + "px";
        this.post.style.left = this.posX + "px";
        this.post.style.top = this.posY + "px";
        this.zIndex = postItArray.length+count;
        this.post.style.zIndex = this.zIndex;
        this.erase.className = "erase";
        this.erase.style.width = "30px";
        this.erase.style.display = "none";
        this.text.className = "text";
        this.cross.className = "cross";
        this.post.appendChild(this.text);
        this.post.appendChild(this.erase);
        this.erase.appendChild(this.cross);
        board.appendChild(this.post);
        postItArray.push([this.post, this.zIndex]);
        this.post.addEventListener('mousedown', this.startDrag.bind(this));
        this.post.addEventListener('mouseup', this.stopDrag.bind(this));
        this.post.addEventListener('mousemove', this.drag.bind(this));
        this.erase.addEventListener('click', this.erasePostIt.bind(this));
    }

    startDrag(e) {
        // e.preventDefault();
        // e.stopImmediatePropagation();
        if (dragMode === true) {
            this.isDraging = true;
            this.post.style.zIndex = "1000";
            this.xOnStart = e.clientX + window.pageXOffset;
            this.yOnStart = e.clientY + window.pageYOffset;
            postItArray.forEach((item) => {
                item[0].style.opacity = "0.5";                
            })
        }
        if (resizeMode === true) {
            this.post.style.zIndex = "1000";  
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
            postItArray.forEach((item) => {
                item[0].style.opacity = "1";
                if(item[0] == this.post) {
                    item[1] =  postItArray.length+count;
                }
            })
        }
        if (resizeMode === true) {
            count++;
            this.post.style.zIndex = postItArray.length+count;
            postItArray.forEach((item) => {
                if(item[0] == this.post) {
                    item[1] =  postItArray.length+count;
                }
            })
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
    erasePostIt() {
        if(eraseMode === true) {
            postItArray.forEach((item) => {
                if(item[0] == this.post) {
                    item[1] =  postItArray.length+count;
                }
            })
            this.sortArray();
            postItArray.pop();
            this.post.remove();            
        }
    }  

    sortArray() {        
            postItArray.sort(function (a, b) {
                if (a[1] === b[1]) {
                    return 0;
                }
                else {
                    return (a[1] < b[1]) ? -1 : 1;
                }
            })
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
        eraseMode = false;
        buttonDrag.style.height = "60px";
        buttonDrag.style.width = "180px";
        buttonDrag.style.backgroundColor = "rgb(18, 187, 18)";
        buttonResize.style.height = "40px";
        buttonResize.style.width = "150px";
        buttonResize.style.backgroundColor = "rgb(226, 48, 48)";
        buttonErase.style.height = "40px";
        buttonErase.style.width = "150px";
        buttonErase.style.backgroundColor = "rgb(226, 48, 48)";
        postItArray.forEach((item) => {
            item[0].childNodes[0].style.resize = "none";
            item[0].style.opacity = "1";
            item[0].childNodes[1].style.display = "none";
        })
    }
    if (mode === 'resize') {
        dragMode = false;
        resizeMode = true;
        eraseMode = false;
        buttonDrag.style.height = "40px";
        buttonDrag.style.width = "150px";
        buttonDrag.style.backgroundColor = "rgb(226, 48, 48)";
        buttonResize.style.height = "60px";
        buttonResize.style.width = "180px";
        buttonResize.style.backgroundColor = "rgb(18, 187, 18)";
        buttonErase.style.height = "40px";
        buttonErase.style.width = "150px";
        buttonErase.style.backgroundColor = "rgb(226, 48, 48)";
        postItArray.forEach((item) => {
            item[0].childNodes[0].style.resize = "both";
            item[0].style.opacity = "0.5";
            item[0].childNodes[1].style.display = "none";
        })
    }
    if (mode === 'erase') {
        eraseMode = true;
        dragMode = false;
        resizeMode = false;
        buttonErase.style.height = "60px";
        buttonErase.style.width = "180px";
        buttonErase.style.backgroundColor = "rgb(18, 187, 18)";
        buttonResize.style.height = "40px";
        buttonResize.style.width = "150px";
        buttonResize.style.backgroundColor = "rgb(226, 48, 48)";
        buttonDrag.style.height = "40px";
        buttonDrag.style.width = "150px";
        buttonDrag.style.backgroundColor = "rgb(226, 48, 48)";
        postItArray.forEach((item) => {
            item[0].childNodes[0].style.resize = "none";
            item[0].style.opacity = "0.5";
            item[0].childNodes[1].style.display = "block";
        })
    }
}

function addPostIt() {
    let post = new Postit(500,400,150,150);
}


/**********************************************************************************/
/****************** FAIRE UN FRIGO CE SERA VACHEMENT PLUS STYLE *******************/
/**********************************************************************************/