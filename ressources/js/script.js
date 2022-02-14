let postItArray = []; // Tableau de tous les post-it
let dragMode = true; // Flag bouton deplacer post-it
let resizeMode = false; // Flag bouton redimensionner post-it
let eraseMode = false; // Flag bouton redimensionner post-it
let editMode = false; // Flag bouton redimensionner post-it
let asideBar = document.getElementById('asideBar');
let max = 0;
let textColor = document.getElementById('textColor');
textColor.addEventListener("input", updateTextColor, false);
let postItColor = document.getElementById('bodyColor');
postItColor.addEventListener("input", updatePostItColor, false);
let fontSelect = document.getElementById('fontSelect');
fontSelect.addEventListener("change", updateFont, false);

// Récupération des boutons
let buttonDrag = document.getElementById('modeButtonDrag');
let buttonResize = document.getElementById('modeButtonResize');
let buttonErase = document.getElementById('modeButtonErase');
let buttonEdit = document.getElementById('modeButtonEdit');

let buttonArray = [buttonDrag, buttonResize, buttonErase, buttonEdit];

// Style par défaut des boutons -> mode par défaut == deplacer
for (const elmt of buttonArray) {
    if (elmt != buttonDrag) {
        elmt.style.height = "40px";
        elmt.style.width = "150px";
        elmt.style.backgroundColor = "rgb(226, 48, 48)";
    }
}

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
    edit; // la div pour editer ( bas du post-it)
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
        this.erase.style.width = "100%";
        this.erase.style.display = "none";
        this.text.className = "text";
        this.text.setAttribute("spellcheck", "false");
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
        this.post.addEventListener('touchstart', this.startDrag.bind(this));
        this.post.addEventListener('touchend', this.stopDrag.bind(this));
        this.post.addEventListener('touchmove', this.drag.bind(this));
        this.erase.addEventListener('click', this.erasePostIt.bind(this));
    }

    // Fonction déplacer ou redimensionner post-it
    // lorsque le click est enfoncé
    startDrag(e) {
            // Si le mode déplacer est enclenché
            if (dragMode) {
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
            if (resizeMode || eraseMode) {
                // la div selectionné voit son z-index passé au max
                this.post.style.zIndex = max + 1;
            }
            if (editMode) {
                this.post.style.zIndex = max + 1;
                postItArray[postItArray.length - 1][0].style.border = "none";
                // postItColor.value = (sliceRgb(postItArray[postItArray.length - 1][0].childNodes[0].style.backgroundColor));
            }
        }
        // fonction déplacer ou redimensionner post-it
        // lorsque le click est relaché
    stopDrag(e) {
            searchMax();
            // Si le mode déplacer est enclenché
            if (dragMode) {
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
                })
            }
            // si le mode redimensionner est enclecnché
            if (resizeMode || editMode) {
                // la div selectionné voit son z-index passé au max
                this.post.style.zIndex = max;
            }
            // on met à jour le z-index dans le tableau de post it
            postItArray.forEach((item) => {
                if (item[0] == this.post) {
                    item[1] = max;
                }
            })
        }
        // Fonction déplacer post-it
        // lors du déplacement de la souris
    drag(e) {
        if (this.isDraging && dragMode) {
            this.post.style.left = parseInt(e.clientX) + parseInt(this.posX) - this.xOnStart + "px";
            this.post.style.top = parseInt(e.clientY) + parseInt(this.posY) - this.yOnStart + "px";
            if ((parseInt(e.clientX) + parseInt(this.posX) - this.xOnStart) <= (window.innerWidth / 10)) {
                this.post.style.left = window.innerWidth / 10 + "px";
            }
            if ((parseInt(e.clientX) + parseInt(this.posX) - this.xOnStart) >= window.innerWidth - window.innerWidth / 10 - parseInt(this.text.style.width)) {
                this.post.style.left = (window.innerWidth - window.innerWidth / 10 - parseInt(this.text.style.width) + "px");
            }
            if ((parseInt(e.clientY) + parseInt(this.posY) - this.yOnStart) <= window.innerHeight / 10) {
                this.post.style.top = window.innerHeight / 10 + "px";
            }
            if ((parseInt(e.clientY) + parseInt(this.posY) - this.yOnStart) >= window.innerHeight - (window.innerHeight / 10) - parseInt(this.text.style.height)) {
                this.post.style.top = (window.innerHeight - (window.innerHeight / 10) - parseInt(this.text.style.height) + "px");
            }
        }
    }

    // Fonction effacer un postit
    erasePostIt() {
        if (eraseMode) {
            searchMax();

            // On cherche le post it et on redéfinit son z-index
            postItArray.forEach((item) => {
                    if (item[0] == this.post) {
                        item[1] = max + 1;
                    }
                })
                // Tri du tableau de post-it en fonction de leur z-index croissant
            sortArray();
            //  et on efface le dernier élément du tableau        
            postItArray.pop();
            // on efface la div du DOM
            this.post.remove();
        }
    }
}

// Fonction gérant les modes et l'affichage des boutrons de mode
function mode(mode) {
    let targetButton;
    eraseMode = false;
    dragMode = false;
    resizeMode = false;
    editMode = false;
    if (postItArray.length != 0) {
        postItArray[postItArray.length - 1][0].style.border = "none";
    }
    switch (mode) {
        case 'drag':
            dragMode = true;
            asideBar.className = "hide";
            targetButton = buttonDrag;
            postItArray.forEach((item) => {
                item[0].childNodes[0].style.resize = "none";
                item[0].style.opacity = "1";
                item[0].childNodes[1].style.display = "none";
            })
            break;
        case 'resize':
            asideBar.className = "hide";
            resizeMode = true;
            targetButton = buttonResize;
            postItArray.forEach((item) => {
                item[0].childNodes[0].style.resize = "both";
                item[0].style.opacity = "0.6";
                item[0].childNodes[1].style.display = "none";
            })
            break;
        case 'erase':
            asideBar.className = "hide";
            eraseMode = true;
            targetButton = buttonErase;
            postItArray.forEach((item) => {
                item[0].childNodes[0].style.resize = "none";
                item[0].style.opacity = "0.6";
                item[0].childNodes[1].style.display = "block";
            })
            break;
        case 'edit':
            asideBar.className = "deploy";
            editMode = true;
            targetButton = buttonEdit;
            postItArray.forEach((item) => {
                item[0].childNodes[0].style.resize = "none";
                item[0].style.opacity = "1";
                item[0].childNodes[1].style.display = "none";
            })
            sortArray();
            if (postItArray.length != 0) {
                postItArray[postItArray.length - 1][0].style.border = "3px solid red";
            }
            break;
        default:
            break;
    }

    for (const elmt of buttonArray) {
        if (elmt != targetButton) {
            elmt.style.height = "40px";
            elmt.style.width = "150px";
            elmt.style.backgroundColor = "rgb(226, 48, 48)";
        }
    }
    targetButton.style.height = "60px";
    targetButton.style.width = "180px";
    targetButton.style.backgroundColor = "rgb(18, 187, 18)";
}

// Fonction créer un post it
function addPostIt() {
    new Postit(500, 400, 150, 150);
}

function searchMax() {
    postItArray.forEach((item) => {
        if (item[1] >= max) {
            max = item[1] + 1;
        }
    })
}

// Foncction triant le tableau de post-it par leur z-index croissant
function sortArray() {
    postItArray.sort(function(a, b) {
        if (a[1] === b[1]) {
            return 0;
        } else {
            return (a[1] < b[1]) ? -1 : 1;
        }
    })
}

function updateTextColor(e) {
    sortArray();
    if (postItArray.length != 0) {
        postItArray[postItArray.length - 1][0].childNodes[0].style.color = e.target.value;
    }
}

function updatePostItColor(e) {
    sortArray();
    if (postItArray.length != 0) {
        console.log(e.target.value)
        postItArray[postItArray.length - 1][0].childNodes[0].style.backgroundColor = e.target.value;
        postItArray[postItArray.length - 1][0].style.backgroundColor = e.target.value;
    }
}

function updateFont() {
    sortArray();
    if (postItArray.length != 0) {
        postItArray[postItArray.length - 1][0].childNodes[0].className = "text " + fontSelect.value;

    }
}

function sliceRgb(string) {
    string = string.substring(4, string.length - 2);
    string = string.split(", ");
    string = rgbToHex(string[0], string[1], string[2]);
    return string;
}

// function rgbToHex(r, g, b) {
//     return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
// }

// function componentToHex(c) {
//     var hex = c.toString(16);
//     return hex.length == 1 ? "0" + hex : hex;
// }

// function rgbToHex(r, g, b) {
//     return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
// }

/**********************************************************************************/
/****************** FAIRE UN FRIGO CE SERA VACHEMENT PLUS STYLE *******************/
/**********************************************************************************/
/******************* ROTATE POST IT ***********************************************/
/**********************************************************************************/
/**************************Copier Coller post it***********************************/
/**********************************************************************************/
/*********************** menu sur le coté pour l'édition **************************/