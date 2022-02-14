let postItArray = []; // Tableau de tous les post-it
let dragMode = true; // Flag bouton deplacer post-it
let resizeMode = false; // Flag bouton redimensionner post-it
let eraseMode = false; // Flag bouton redimensionner post-it
let editMode = false; // Flag bouton redimensionner post-it
let asideBar = document.getElementById('asideBar');
let max = 0;
searchMax();
let barDeployed = false;
// Input changer couleur texte postit et son event listener
let textColor = document.getElementById('textColor');
textColor.addEventListener("input", updateTextColor, false);
// Input changer couleur background postit et son event listener
let postItColor = document.getElementById('bodyColor');
postItColor.addEventListener("input", updatePostItColor, false);
// Select changer font family texte postit et son event listener
let fontSelect = document.getElementById('fontSelect');
fontSelect.addEventListener("change", updateFont, false);
// Input changer taille texte postit et son event listener
let fontSizeSelect = document.getElementById('fontSizeSelect');
fontSizeSelect.addEventListener("change", updateFontSize, false);
// Fonction sauvegarde en local Storage
window.addEventListener("change", updateStorage, false);

// Récupération des boutons
let buttonDrag = document.getElementById('modeButtonDrag');
let buttonResize = document.getElementById('modeButtonResize');
let buttonErase = document.getElementById('modeButtonErase');
let buttonEdit = document.getElementById('modeButtonEdit');

// Je met les boutons dans un tableau pour factoriser
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
    rotate; // son angle
    textColor; // couleur de police
    textSize; // taille police
    textFont; // Style de police
    backColor; // couleur du post-it
    textContent; // contenu texte du pos-it

    // Constructeur avec paramètres par défaut
    constructor(x = "500px", y = "400px", width = "150px", height = "150px", zIndex = max, rotate = 0, textColor = "", backColor = "", textSize = "", textFont = "", textContent = "") {
        this.posX = x;
        this.posY = y;
        this.width = width;
        this.height = height;
        this.isDraging = false;
        this.isResizing = false;
        this.rotate = rotate;
        this.zIndex = zIndex;
        if (max <= zIndex) {
            max = zIndex + 1;
        }
        // Création des composants du post-it et récupération du container
        this.post = document.createElement("div");
        this.text = document.createElement('textarea');
        this.erase = document.createElement('div');
        this.cross = document.createElement('div');
        let board = document.querySelector('.board');
        // Attribution des valeurs 
        this.post.className = "post-it";
        this.text.style.width = this.width;
        this.text.style.height = this.height;
        this.post.style.left = x;
        this.post.style.top = y;
        this.post.style.zIndex = this.zIndex;
        this.erase.className = "erase";
        this.erase.style.width = "30px";
        this.erase.style.display = "none";
        this.text.className = "text";
        // Attribution du contenu, des propriétés 
        this.text.value = textContent;
        if (backColor == "") {
            backColor = "#e2e265";
        }
        this.text.style.backgroundColor = backColor;
        this.post.style.backgroundColor = backColor;
        if (textColor == "") {
            textColor = "black";
        }
        this.text.style.color = textColor;
        this.post.style.transform = "rotate(" + rotate + "deg)";
        this.text.setAttribute("spellcheck", "false");
        this.cross.className = "cross";
        // Création de la structure HTML du post-it et envoi dans le DOM
        this.post.appendChild(this.text);
        this.post.appendChild(this.erase);
        this.erase.appendChild(this.cross);
        board.appendChild(this.post);
        // Afin de pouvoir mettre à jour les z-index et trié les post-it
        // J'enregistre la div et le z-index
        postItArray.push([this.post, this.zIndex, this.rotate]);
        // Application de la taille et du style de la police
        if (textFont == "") {
            textFont = "Roboto";
        }
        if (textSize == "") {
            textSize = "font22";
        }
        postItArray[postItArray.length - 1][0].childNodes[0].className = "text " + textFont;
        postItArray[postItArray.length - 1][0].childNodes[0].id = textSize;
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
            // Je passe la div en mode déplacement possible
            this.isDraging = true;
            // la div selectionné voit son z-index passé au max
            this.post.style.zIndex = max + 1;
            // Je enregistre la position de départ de la souris afin de calculer le déplacement
            this.xOnStart = e.clientX + window.pageXOffset;
            this.yOnStart = e.clientY + window.pageYOffset;
            // Je passe tous les pos-it en transparent
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
            // Je passe la div en mode déplacement impossible
            this.isDraging = false;
            // la div selectionné voit son z-index passé au max
            this.post.style.zIndex = max;
            // Je met à jour sa position
            this.posX = this.post.style.left;
            this.posY = this.post.style.top;
            // Je met à jour le z-index dans le tableau de post it
            postItArray.forEach((item) => {
                item[0].style.opacity = "1";
            })
        }
        // si le mode redimensionner est enclecnché
        if (resizeMode || editMode) {
            // la div selectionné voit son z-index passé au max
            this.post.style.zIndex = max;
        }
        // Je met à jour le z-index dans le tableau de post it
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
            // Gestion des limites de la zone post-it
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

            // Je cherche le post it et Je redéfinis son z-index
            postItArray.forEach((item) => {
                if (item[0] == this.post) {
                    item[1] = max + 1;
                }
            })
            // Tri du tableau de post-it en fonction de leur z-index croissant
            sortArray();
            //  et j'efface le dernier élément du tableau        
            postItArray.pop();
            // j'efface la div du DOM
            this.post.remove();
        }
    }
}
/*======================== FIN DU CONSTRUCTEUR ================================*/

// Fonction gérant les modes et l'affichage des boutons de mode
function mode(mode) {
    // Variable qui va stocker le current bouton
    let targetButton;
    // Je mets tous les modes à false
    eraseMode = false;
    dragMode = false;
    resizeMode = false;
    editMode = false;
    // Si le tableau de post it n'est pas vide, j'efface le focus du dernier post-it
    if (postItArray.length != 0) {
        postItArray[postItArray.length - 1][0].style.border = "none";
    }
    switch (mode) {
        case 'drag':
            dragMode = true;
            // Animation sidebar -> je la cache
            if (barDeployed) {
                asideBar.className = "hide";
            }
            targetButton = buttonDrag;
            postItArray.forEach((item) => {
                item[0].childNodes[0].style.resize = "none";
                item[0].style.opacity = "1";
                item[0].childNodes[1].style.display = "none";
            })
            break;
        case 'resize':
            // Animation sidebar -> je la cache
            if (barDeployed) {
                asideBar.className = "hide";
            }
            resizeMode = true;
            targetButton = buttonResize;
            postItArray.forEach((item) => {
                item[0].childNodes[0].style.resize = "both";
                item[0].style.opacity = "0.6";
                item[0].childNodes[1].style.display = "none";
            })
            break;
        case 'erase':
            // Animation sidebar -> je la cache
            if (barDeployed) {
                asideBar.className = "hide";
            }
            eraseMode = true;
            targetButton = buttonErase;
            postItArray.forEach((item) => {
                item[0].childNodes[0].style.resize = "none";
                item[0].style.opacity = "0.6";
                item[0].childNodes[1].style.display = "block";
            })
            break;
        case 'edit':
            // Animation sidebar -> je la déploie
            asideBar.className = "deploy";
            barDeployed = true;
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
            console.error("probleme sur le switch des modes");
            break;
    }

    // Gestion du display des boutons hors current
    for (const elmt of buttonArray) {
        if (elmt != targetButton) {
            elmt.style.height = "40px";
            elmt.style.width = "150px";
            elmt.style.backgroundColor = "rgb(226, 48, 48)";
        }
    } //Gestion du display du current bouton
    targetButton.style.height = "60px";
    targetButton.style.width = "180px";
    targetButton.style.backgroundColor = "rgb(18, 187, 18)";
}

// Fonction créer un post it relié au bouton
function addPostIt() {
    new Postit();
}

// Fonction qui recherche l'indice max et le redéfinit à +1
function searchMax() {
    postItArray.forEach((item) => {
        if (item[1] >= max) {
            max = item[1] + 1;
        }
    })
}

// Foncction triant le tableau de post-it par leur z-index croissant
function sortArray() {
    postItArray.sort(function (a, b) {
        if (a[1] === b[1]) {
            return 0;
        } else {
            return (a[1] < b[1]) ? -1 : 1;
        }
    })
}

// Fonction changement couleur du texte post-it selectionné
function updateTextColor(e) {
    // Tri tableau car le post-it seléctionné à forcément le z-index le plus grand    
    sortArray();
    // Si le tableau n'est pas vide, je change la couleur du texte du post-it 
    if (postItArray.length != 0) {
        postItArray[postItArray.length - 1][0].childNodes[0].style.color = e.target.value;
    }
}

// Fonction changement couleur du post-it selectionné
function updatePostItColor(e) {
    // Tri tableau car le post-it seléctionné à forcément le z-index le plus grand    
    sortArray();
    // Si le tableau n'est pas vide, je change la couleur du textarea et de la div
    if (postItArray.length != 0) {
        //textarea
        postItArray[postItArray.length - 1][0].childNodes[0].style.backgroundColor = e.target.value;
        //div
        postItArray[postItArray.length - 1][0].style.backgroundColor = e.target.value;
    }
}

// Fonction mis à jour de la police
function updateFont(family) {
    // Tri tableau car le post-it seléctionné à forcément le z-index le plus grand    
    sortArray();
    if (postItArray.length != 0) {
        postItArray[postItArray.length - 1][0].childNodes[0].className = "text " + fontSelect.value;
    }
}

// Fonction changeant la taille de la police du post-it sélectionné
function updateFontSize(size) {
    // Tri tableau car le post-it seléctionné à forcément le z-index le plus grand    
    sortArray();
    if (postItArray.length != 0) {
        postItArray[postItArray.length - 1][0].childNodes[0].id = fontSizeSelect.value;
    }
}

// Fonction rotation post-it
function rotate(direction) {
    sortArray();
    if (postItArray.length != 0) {
        if (direction == 'left') {
            postItArray[postItArray.length - 1][2] -= 15;
            postItArray[postItArray.length - 1][0].style.transform = "rotate(" + postItArray[postItArray.length - 1][2] + "deg)";
        }
        if (direction == 'right') {
            postItArray[postItArray.length - 1][2] += 15;
            postItArray[postItArray.length - 1][0].style.transform = "rotate(" + postItArray[postItArray.length - 1][2] + "deg)";
        }
    }
}

// Fonction sauvegarde dans le local storage
function updateStorage() {
    let item = 0;
    localStorage.clear();
    if (postItArray.length != 0) {
        for (const elmt of postItArray) {
            item++;
            let fontFamily = elmt[0].childNodes[0].className;
            fontFamily = fontFamily.substring(5, fontFamily.length);
            localStorage.setItem(item, elmt[0].style.left + "*" + elmt[0].style.top + "*" + elmt[0].childNodes[0].style.height + "*" + elmt[0].childNodes[0].style.width + "*" + elmt[0].style.zIndex + "*" + elmt[2] + "*" + elmt[0].childNodes[0].style.color + "*" + elmt[0].childNodes[0].style.backgroundColor + "*" + elmt[0].childNodes[0].id + "*" + fontFamily + "*" + elmt[0].childNodes[0].value);
            console.log(elmt[0].style.left + "*" + elmt[0].style.top + "*" + elmt[0].childNodes[0].style.height + "*" + elmt[0].childNodes[0].style.width + "*" + elmt[0].style.zIndex + "*" + elmt[2] + "*" + elmt[0].childNodes[0].style.color + "*" + elmt[0].childNodes[0].style.backgroundColor + "*" + elmt[0].childNodes[0].id + "*" + fontFamily + "*" + elmt[0].childNodes[0].value);
        }
    }
}

// Fonction load le local storage et création des objets post-it
function loadStorage() {
    for (let i = 1; i <= localStorage.length; i++) {
        let params = localStorage.getItem(i);
        params = params.split("*");
        // console.log(params)
        new Postit(params[0], params[1], params[2], params[3], parseInt(params[4]), parseInt(params[5]), params[6], params[7], params[8], params[9], params[10]);
    }
}


// setInterval(() => {
//     updateStorage();
// }, 1000);




// FONCTION CONVERSION RGB TO HEXADECIMAL
// function sliceRgb(string) {
//     string = string.substring(4, string.length - 2);
//     string = string.split(", ");
//     string = rgbToHex(string[0], string[1], string[2]);
//     return string;
// }

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