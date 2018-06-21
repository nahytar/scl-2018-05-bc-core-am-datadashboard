const elements = document.getElementsByClassName('element');

const cleanActives = (element) => {
  const activeChildren = element.getElementsByClassName('active');
  for (let i = 0; i < activeChildren.length; i++) {
    cleanActives(activeChildren[i]);
  }
  element.classList.remove('active');
}

const toggle = (event) => {
  let brothers = event.currentTarget.parentNode.children;
  for (let i = 0; i < brothers.length; i++) {
    let whiteCard = brothers[i].children[1];
    if(brothers[i] !== event.currentTarget || whiteCard.classList.contains('active')) {
      cleanActives(whiteCard);
    } else {
      event.currentTarget.children[1].classList.add('active');
    }
  }

  event.stopPropagation();
}

for (let i = 0; i < elements.length; i++) {
  elements[i].addEventListener('click', toggle);
}

const tags = document.getElementsByClassName('tag');

const sitesDiv = document.getElementById('sites');
// limpia de contenido el div de sites para poder agregar los que se van a generar a partir del API
sitesDiv.innerHTML = '';

// objeto que se encarga de hacer los llamados para obtener los site
const req = new XMLHttpRequest();
req.open('GET', 'https://api.laboratoria.la/campuses');
req.send(null);
let siteDiv;
let siteP;
let generationsDiv;
let yearDiv;
let yearP;
const sites = [];
if (req.status === 200) {
  // parsea json que viene como string dentro de responseText
  JSON.parse(req.responseText).forEach(site => {
    if (site.active) {
      sites.push({
        site: site.id,
        years: new Set()
      });
    }
  });
}
sites.forEach(site => {
  siteP = document.createElement('p');
  siteP.classList.add('icon-triangle-down');
  siteP.append(document.createTextNode(site.site.toUpperCase()));
 
  siteDiv = document.createElement('div');
  siteDiv.classList.add('site', 'tag');
  siteDiv.append(siteP);
// asigna a todos los tags el evento click con la funcion toggle.
for (let i = 0; i < tags.length; i++) {
  tags[i].addEventListener('click', toggle);
}
});


/*const cont_select = document.getElementById('conte_select');
cont_select.addEventListener('click', => {
  if(select_alumna.style.display === 'none'){
    select_alumna.style.display = 'block';
  }else{
    select_alumna.style.display = 'none';
  }
})*/