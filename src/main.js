// remueve la clase active del elemento HTML y de sus hijos.
const cleanActives = (tag) => {
  // obtiene la lista de hijos que tienen la clase active.
  const activeChildren = tag.getElementsByClassName('active');
  // recorre a los hijos activos del tag.
  for (let i = 0; i < activeChildren.length; i++) {
    // para cada hijo activo se ejecuta la misma funcion cleanActives.
    cleanActives(activeChildren[i]);
  }
  tag.classList.remove('active'); // remueve la clase active del elemento HTML pasado como parametro
};


const toggle = (event) => {
  // se obtienen todos los nodos del mismo nivel del tag que disparo el evento.
  let brothers = event.currentTarget.parentNode.children;
  // se recorre los brothers para desactivar los hermanos que esten activos.
  for (let i = 0; i < brothers.length; i++) {
    // se crea una variable con el segundo hijo del hermano actual
    let whiteCard = brothers[i].children[1];
    // si el hermano no es el que recibio el click o ya tiene la clase active se le limpia la clase active del el y de todos sus hijos.
    if (brothers[i] !== event.currentTarget || whiteCard.classList.contains('active')) {
      cleanActives(whiteCard);
    } else { // si no le agrega la clase active.
      event.currentTarget.children[1].classList.add('active');
    }
  }
  // evita la propagacion del evento al los tags padres.
  event.stopPropagation();
};

const hola = document.getElementById('hola');

hola.addEventListener('click', () => {
  const x = document.getElementById('select_student');
  if (x === 'none') {
    x.style.display = 'block';
  } else {
    x.style.display = 'none';
  }
});

const tags = document.getElementsByClassName('tag');

const sitesDiv = document.getElementById('sites');
// limpia de contenido el div de sites para poder agregar los que se van a generar a partir del API
sitesDiv.innerHTML = '';

// objeto que se encarga de hacer los llamados al API
const req = new XMLHttpRequest();
// se define metodo y url para obtener los sites del API de manera sincrona
req.open('GET', 'https://api.laboratoria.la/campuses', false);
// se hace llamado sin contenido en el body
req.send(null);

let siteDiv;
let siteP;
let generationsDiv;
let yearDiv;
let yearP;
// se instancia un array vacio para poder ir acumulando los sites
const sites = [];
// si el API respondio de manera correcta
if (req.status === 200) {
  // parsea JSON que viene como string dentro de responseText y recorre los sites
  JSON.parse(req.responseText).forEach(site => {
    // si el site esta activo
    if (site.active) {
      // agrega un objeto al array de site con el nombre y un conjunto donde se iran agegando las generaciones
      sites.push({
        name: site.id,
        years: new Set()
      });
    }
  });
}

// se define metodo y url para obtener los cohorts del API de manera sincrona
req.open('GET', 'https://api.laboratoria.la/cohorts', false);
req.send(null);
if (req.status === 200) {
  // parsea json que viene como string dentro de responseText y recorre los cohorts
  JSON.parse(req.responseText).forEach(cohort => {
    // para cada cohort recorre todos los sites antes creados
    sites.forEach(site => {
      // si el id del cohort empieza con el nombre del site
      if (cohort.id.indexOf(site.name) === 0) {
        // se agrega el año que esta en la fecha de inicio del cohort al conjunto de años de site
        site.years.add(cohort.start.substr(0, 4));
      }
    });
  });
}
// se recorre los sites
sites.forEach(site => {
  // se le asigna a siteP un nuevo elemento HTML del tipo parrafo
  siteP = document.createElement('p');
  // al elemento creado se l agrega la clase 'icon-triangle-down'
  siteP.classList.add('icon-triangle-down');
  // le agrega como ultimo hijo de P un nodo de texto con el nombre del site en mayuscula
  siteP.append(document.createTextNode(site.name.toUpperCase()));

  siteDiv = document.createElement('div');
  siteDiv.classList.add('site', 'tag');
  siteDiv.append(siteP);

  generationsDiv = document.createElement('div');
  generationsDiv.classList.add('generations', 'whiteCard');

  siteDiv.append(generationsDiv);
  sitesDiv.append(siteDiv);

  site.years.forEach(year => {
    yearP = document.createElement('p');
    yearP.classList.add('icon-triangle-down');
    yearP.append(document.createTextNode(year));

    yearDiv = document.createElement('div');
    yearDiv.classList.add('generation', 'tag');
    yearDiv.append(yearP);

    generationsDiv.append(yearDiv);

  });
});

// asigna a todos los tags el evento click con la funcion toggle.
for (let i = 0; i < tags.length; i++) {
  tags[i].addEventListener('click', toggle);
}
