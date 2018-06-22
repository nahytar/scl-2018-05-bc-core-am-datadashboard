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

const loadUsers = (cohort, studentsDivId) => {
  let studentP;
  let studentDiv;
  let progressDiv;
  const studentsDiv = document.getElementById(studentsDivId);

  req.open('GET', `https://api.laboratoria.la/cohorts/${cohort.id}/users`, false);
  req.send(null);
  // if (req.status === 200 || studentsDiv.children.length === 0) {
  //   req.open('GET', `https://api.laboratoria.la/progress?cohortid=${cohort.id}`, false);
  //   req.send(null);
  //   if (req.status === 200) {
  //     computeUsersStats((users, progress, courses))
  //   }
  JSON.parse(req.responseText).forEach((student) => {
    studentP = document.createElement('p');
    studentP.append(document.createTextNode(student.name));

    progressDiv = document.createElement('div');
    progressDiv.classList.add('studentProgress');
    progressDiv.style.width = '60%';
    progressDiv.append(studentP);

    studentDiv = document.createElement('div');
    studentDiv.classList.add('student', 'tag');
    studentDiv.append(progressDiv);

    studentsDiv.append(studentDiv);
  });

  console.log(studentsDiv);
}
const tags = document.getElementsByClassName('tag');
const sitesDiv = document.getElementById('sites');
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

// limpia de contenido el div de sites para poder agregar los que se van a generar a partir del API
sitesDiv.innerHTML = '';

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
  let splitedId;
  // parsea json que viene como string dentro de responseText y recorre los cohorts
  JSON.parse(req.responseText).forEach(cohort => {
    splitedId = cohort.id.split('-');
    // para cada cohort recorre todos los sites antes creados
    sites.forEach(site => {
      // si el id del cohort empieza con el nombre del site
      if (splitedId[0] === site.id) {
        // se agrega el año que esta en la fecha de inicio del cohort al conjunto de años de site
        if (site.generations[splitedId[1]]) {
          site.generations[splitedId[1]].push(cohort);
        } else {
          site.generations[splitedId[1]] = [cohort];
        }
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
      studentsDiv.id = 'students-' + cohort.id;

      cohortDiv.append(studentsDiv);

      cohortDiv.addEventListener('click', () => {
        loadUsers(cohort, 'students-' + cohort.id);
      });

      cohortsDiv.append(cohortDiv);
    });
  });
});

// asigna a todos los tags el evento click con la funcion toggle.
for (let i = 0; i < tags.length; i++) {
  tags[i].addEventListener('click', toggle);
}
