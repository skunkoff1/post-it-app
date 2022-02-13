let postItArray = []; // Tableau de tous les post-it
let dragMode = true; // Flag bouton deplacer post-it
let resizeMode = false; // Flag bouton redimensionner post-it
let eraseMode = false; // Flag bouton redimensionner post-it
let max = 0;

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
        searchMax();        
        let board = document.querySelector('.board');
        this.post.className = "post-it";
        this.text.style.width = this.width + "px";
        this.text.style.height = this.height + "px";
        this.post.style.left = this.posX + "px";
        this.post.style.top = this.posY + "px";
        this.zIndex = max;
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
        // Afin de pouvoir mettre à jour les z-index et trié les post-it
        // J'enregistre la div et le z-index
        postItArray.push([this.post, this.zIndex]);
        // Ecouteurs d'évènements
        this.post.addEventListener('mousedown', this.startDrag.bind(this));
        this.post.addEventListener('mouseup', this.stopDrag.bind(this));
        this.post.addEventListener('mousemove', this.drag.bind(this));
        this.erase.addEventListener('click', this.erasePostIt.bind(this));
    }

    // Fonction déplacer ou redimensionner post-it
    // lorsque le click est enfoncé
    startDrag(e) {       
        // Si le mode déplacer est enclenché
        if (dragMode === true) {
            // On passe la div en mode déplacement possible
            this.isDraging = true;
            // la div selectionné voit son z-index passé au max
            this.post.style.zIndex = max + 1;
            // On enregistre la position de départ de la souris afin de calculer le déplacement
            this.xOnStart = e.clientX + window.pageXOffset;
            this.yOnStart = e.clientY + window.pageYOffset;
            // on passe tous les pos-it en transparent
            postItArray.forEach((item) => {
                item[0].style.opacity = "0.6";
            })
        }
        // Si le mode redimensionner est enclenché
        if (resizeMode === true || eraseMode === true) {
            // la div selectionné voit son z-index passé au max
            this.post.style.zIndex = max + 1;
        }
    }
    // fonction déplacer ou redimensionner post-it
    // lorsque le click est relaché
    stopDrag(e) {
        searchMax();
        // Si le mode déplacer est enclenché
        if (dragMode === true) {
            // On passe la div en mode déplacement impossible
            this.isDraging = false;
            // la div selectionné voit son z-index passé au max
            this.post.style.zIndex = max;
            // on met à jour sa position
            this.posX = this.post.style.left;
            this.posY = this.post.style.top;
            // on met à jour le z-index dans le tableau de post it
            postItArray.forEach((item) => {
                item[0].style.opacity = "1";
                if (item[0] == this.post) {
                    item[1] = max;
                }
            })
        }
        // si le mode redimensionner est enclecnché
        if (resizeMode === true) {
            // la div selectionné voit son z-index passé au max
            this.post.style.zIndex = max;            
            // on met à jour le z-index dans le tableau de post it
            postItArray.forEach((item) => {
                if (item[0] == this.post) {
                    item[1] = max;
                }
            })
        }
    }
    // Fonction déplacer post-it
    // lors du déplacement de la souris
    drag(e) {
        if (this.isDraging === true && dragMode === true) {
            this.post.style.left = parseInt(e.clientX) + parseInt(this.posX) - this.xOnStart + "px";
            this.post.style.top = parseInt(e.clientY) + parseInt(this.posY) - this.yOnStart + "px";
        }
    }

    // Fonction effacer un postit
    erasePostIt() {
        if (eraseMode === true) {
            searchMax();

            // On cherche le post it et on redéfinit son z-index
            postItArray.forEach((item) => {
                if (item[0] == this.post) {
                    item[1] = max + 1;
                }
            })
            // Tri du tableau de post-it en fonction de leur z-index croissant
            this.sortArray();
            //  et on efface le dernier élément du tableau        
            postItArray.pop();
            // on efface la div du DOM
            this.post.remove();
        }
    }

    // Foncction triant le tableau de post-it par leur z-index croissant
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


// Trackeur de la position de la souris sur l'écran
document.onmousemove = function (e) {
    let x = document.querySelector('.horizontal');
    let y = document.querySelector('.vertical');
    x.innerHTML = e.clientX + window.pageXOffset;
    y.innerHTML = e.clientY + window.pageYOffset;

};


// Fonction gérant les modes et l'affichage des boutrons de mode
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
            item[0].style.opacity = "0.6";
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
            item[0].style.opacity = "0.6";
            item[0].childNodes[1].style.display = "block";
        })
    }
}

// Fonction créer un post it
function addPostIt() {
    let post = new Postit(500, 400, 150, 150);
}

function searchMax() {
    postItArray.forEach((item) => {
        if (item[1] >= max) {
            max = item[1] + 1;
            console.log(item[1])
        }
    })
}

/**********************************************************************************/
/****************** FAIRE UN FRIGO CE SERA VACHEMENT PLUS STYLE *******************/
/**********************************************************************************/