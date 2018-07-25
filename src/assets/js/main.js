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
// se llama al API
const getData = (url) => {
  req.open('GET', url, false);
  req.send(null);
  if (req.status === 200) {
    return JSON.parse(req.responseText);
  }

  return [];
};

// borra todos los usuarios anteriores para poder escribir los filtrados
const removeUsersFromDom = (studentsDiv) => {
  let fc = studentsDiv.getElementsByClassName('student').item(0);
  while (fc) {
    studentsDiv.removeChild(fc);
    fc = studentsDiv.getElementsByClassName('student').item(0);
  }
};

// carga los users desde la API
const loadUsers = (cohort) => {
  let studentP;
  let studentDiv;
  let progressDiv;
  const studentsDiv = document.getElementById('students-' + cohort.id);
  const filter = document.getElementById('input-' + cohort.id).value.toUpperCase();
  const orderly = document.getElementById('orderly-' + cohort.id).value;
  const direction = document.getElementById('direction-' + cohort.id).value;
  
  removeUsersFromDom(studentsDiv);

  // si cohort no tiene users
  if (!cohort.users) {
    // busca las usuarias desde el API
    cohort.users = getData(`https://api.laboratoria.la/cohorts/${cohort.id}/users`);
  }
  // busca los progresos desde el API
  let progress = getData(`https://api.laboratoria.la/cohorts/${cohort.id}/progress`);

  // se llama a la funcion filterUser y se dibuja los usuarios resultantes
  processCohortData(Object.keys(cohort.coursesIndex), cohort.users, progress, orderly, direction, filter).forEach((student) => {
    studentP = document.createElement('p');
    studentP.append(document.createTextNode(student.name + ' ' + student.stats.percent + '%'));

    progressDiv = document.createElement('div');
    progressDiv.classList.add('studentProgress');
    progressDiv.style.width = student.stats.percent + '%';

    studentDiv = document.createElement('div');
    studentDiv.classList.add('student', 'tag');
    studentDiv.append(studentP);
    studentDiv.append(progressDiv);

    studentsDiv.append(studentDiv);
  });
};

// ========================================================
// se obtiene los tags desde el HTML
const tags = document.getElementsByClassName('tag');
// se obtiene el div que va a contener a los sites
const sitesDiv = document.getElementById('sites');
// se crean las variables que se van a usar para dibujar el HTML
let siteDiv;
let siteP;
let generationsDiv;
let generationDiv;
let generationP;
let cohortsDiv;
let cohortDiv;
let cohortP;
let cohortName;
let studentsDiv;
let idAlumnas;

// objeto que se encarga de hacer los llamados al API
const req = new XMLHttpRequest();
// se define metodo y url para obtener los sites del API de manera sincrona
req.open('GET', 'https://api.laboratoria.la/campuses', false);
// se hace llamado sin contenido en el body
req.send(null);
// se instancia un array vacio para poder ir acumulando los sites
const sites = [];
// si el API respondio de manera correcta
if (req.status === 200) {
  // parsea JSON que viene como string dentro de responseText y recorre los sites
  JSON.parse(req.responseText).forEach(site => {
    // si el site esta activo
    if (site.active) {
      // se crea un array vacio de generaciones para ir acumulando las generaciones
      site.generations = [];
      // agrega un objeto al array de site con el nombre y un conjunto donde se iran agegando las generaciones
      sites.push(site);
    }
  });
}

// se define metodo y url para obtener los cohorts del API de manera sincrona
req.open('GET', 'https://api.laboratoria.la/cohorts', false);
req.send(null);
if (req.status === 200) {
  let siteId;
  let year;
  // parsea json que viene como string dentro de responseText y recorre los cohorts
  JSON.parse(req.responseText).forEach(cohort => {
    // se obtiene el siteId a partir del cohort.id, split elimina el guion del id
    siteId = cohort.id.split('-')[0];
    year = cohort.id.split('-')[1];
    // para cada cohort recorre todos los sites antes creados
    sites.forEach(site => {
      // si el id del cohort empieza con el nombre del site
      if (siteId === site.id) {
        // se agrega el año que viene en el id del cohort a la generacion
        if (site.generations[year]) {
          site.generations[year].push(cohort);
        } else {
          // si no hay un array ya creado para ese año se crea un array con ese cohort como unico elemento
          site.generations[year] = [cohort];
        }
      }
    });
  });
}

const createOption = (description, value) => {
  const option = document.createElement('option');
  option.setAttribute('value', value);
  var text = document.createTextNode(description);
  option.appendChild(text);

  return option;
};

const createSelectDirection = (cohort) => {
  const selectDirection = document.createElement('select');
  selectDirection.appendChild(createOption('Ascendente', 'asc'));
  selectDirection.appendChild(createOption('Descendente', 'desc'));
  selectDirection.classList.add('direction');
  selectDirection.setAttribute('id', 'direction-' + cohort.id);
  selectDirection.addEventListener('click', (event) => {
    event.stopPropagation();
  });
  // al escribir en el filtro se llama a loadUsers
  selectDirection.addEventListener('change', () => {
    loadUsers(cohort);
  });

  return selectDirection;
};

const createOrderlyCriterion = (cohort) => {
  const orderlyCriterion = document.createElement('select');
  orderlyCriterion.appendChild(createOption('Nombre', 'name'));
  orderlyCriterion.appendChild(createOption('Porcenjate de completitud', 'percent'));
  orderlyCriterion.appendChild(createOption('Ejercicios', 'exercises'));
  orderlyCriterion.appendChild(createOption('Porcentaje de Quizzes', 'quizzes'));
  orderlyCriterion.appendChild(createOption('Promerdio de Quizzes', 'quizzesAvg'));
  orderlyCriterion.appendChild(createOption('Lecturas', 'reads'));
  orderlyCriterion.classList.add('orderly');
  orderlyCriterion.setAttribute('id', 'orderly-' + cohort.id);
  orderlyCriterion.addEventListener('click', (event) => {
    event.stopPropagation();
  });
  // al escribir en el filtro se llama a loadUsers
  orderlyCriterion.addEventListener('change', () => {
    loadUsers(cohort);
  });

  return orderlyCriterion;
};

const createSearch = (cohort) => {
  const studentsFilter = document.createElement('input');
  studentsFilter.setAttribute('type', 'text');
  studentsFilter.setAttribute('id', 'input-' + cohort.id);
  studentsFilter.setAttribute('placeholder', 'Search');
  studentsFilter.classList.add('search');

  // se agrega un compotamiento al click del filtro para evitar la propagacion del evento a la estudiantes que estan por detras
  studentsFilter.addEventListener('click', (event) => {
    event.stopPropagation();
  });
  // al escribir en el filtro se llama a loadUsers
  studentsFilter.addEventListener('keyup', () => {
    loadUsers(cohort);
  });

  return studentsFilter;
};

const createFilter = (cohort) => {
  const filterDiv = document.createElement('div');
  filterDiv.appendChild(createOrderlyCriterion(cohort));
  filterDiv.appendChild(createSelectDirection(cohort));
  filterDiv.appendChild(createSearch(cohort));
  return filterDiv;
};

// se recorre los sites
sites.forEach(site => {
  // se le asigna a siteP un nuevo elemento HTML del tipo parrafo
  siteP = document.createElement('p');
  // al elemento creado se le agrega la clase 'icon-triangle-down'
  siteP.classList.add('icon-triangle-down');
  // le agrega como ultimo hijo de P un nodo de texto con el nombre del site en mayuscula
  siteP.append(document.createTextNode(site.name.toUpperCase()));
  // se crea un div para contener al site
  siteDiv = document.createElement('div');
  // al elemento creado se le agrega las clases site y tag
  siteDiv.classList.add('site', 'tag');
  // se agrega como ultimo hijo de div al siteP
  siteDiv.append(siteP);

  generationsDiv = document.createElement('div');
  generationsDiv.classList.add('generations', 'whiteCard');

  siteDiv.append(generationsDiv);
  sitesDiv.append(siteDiv);

  site.generations.forEach((generation, year) => {
    generationP = document.createElement('p');
    generationP.classList.add('icon-triangle-down');
    generationP.append(document.createTextNode(year));

    generationDiv = document.createElement('div');
    generationDiv.classList.add('generation', 'tag');
    generationDiv.append(generationP);

    cohortsDiv = document.createElement('div');
    cohortsDiv.classList.add('turns', 'whiteCard');

    generationDiv.append(cohortsDiv);

    generationsDiv.append(generationDiv);

    generation.forEach((cohort) => {
      cohortP = document.createElement('p');
      cohortP.classList.add('icon-triangle-down');
      cohortName = cohort.id.split('-').slice(4).join(' ');
      cohortP.append(document.createTextNode(cohortName));

      cohortDiv = document.createElement('div');
      cohortDiv.classList.add('turn', 'tag');
      cohortDiv.append(cohortP);

      studentsDiv = document.createElement('div');
      studentsDiv.classList.add('students', 'whiteCard');
      // a studentsDiv se le asigna  un id para poder ser bucado luego cuando se carga las students
      studentsDiv.id = 'students-' + cohort.id;
      
      studentsDiv.append(createFilter(cohort));
      cohortDiv.append(studentsDiv);
      // al hacer click en el cohort ademas de desplegar las students se carga las mismas desde el API
      cohortDiv.addEventListener('click', () => {
        loadUsers(cohort);
      });
      // se agrega el cohort a la lista de cohort
      cohortsDiv.append(cohortDiv);
    });
  });
});

// asigna a todos los tags el evento click con la funcion toggle.
for (let i = 0; i < tags.length; i++) {
  tags[i].addEventListener('click', toggle);
}

