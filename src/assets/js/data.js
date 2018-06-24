window.computeUsersStats = (users, progress, courses) => {
  let stats;
  users.forEach(user => {
    // Se crea el atributo stats en el user y se le asigna un objeto con las estadisticas
    stats = {
      percent: 0,
      total: 0,
      exercises: {
        total: 0,
        completed: 0
      },
      quizzes: {
        total: 0,
        completed: 0,
        scoreSum: 0
      },
      reads: {
        total: 0,
        completed: 0
      },
    };
    courses.forEach(course => {
      // Si la usuaria tiene progresos en el curso
      if (progress[user.id] && progress[user.id][course]) {
        stats.percent += progress[user.id][course].percent;
        stats.total++;

        // Se obtiene el arreglo de los valores de units (la lista de unidades) y lo recorre
        Object.values(progress[user.id][course].units).forEach(unit => {
          // Se obtiene el arreglo de los valores de parts (la lista de unidades) y lo recorre
          Object.values(unit.parts).forEach(part => {
            // Si la parte es una practice
            if (part.type === 'practice') {
              // Suma uno al total
              stats.exercises.total++;
              // Como completed es un entero que vale 0 o 1, simplemente lo acumula
              stats.exercises.completed += part.completed ? parent.completed : 0;
            }
            // Si la parte es una quiz
            if (part.type === 'quiz') {
              stats.quizzes.total++;
              stats.quizzes.completed += part.completed ? part.completed : 0;
              // Si el quiz fue completado se acumula su puntuacion
              if (part.completed) {
                stats.quizzes.scoreSum += part.score ? part.score : 0;
              }
            }
            // Si la parte es un read
            if (part.type === 'read') {
              stats.reads.total++;
              stats.reads.completed += part.completed ? parent.completed : 0;
            }
          });
        });

        // Se calculan los promedios basados en los totales y acumuladores
        if (stats.exercises.total > 0) {
          stats.exercises.percent = Math.round(stats.exercises.completed / stats.exercises.total * 100);
        } else {
          stats.exercises.percent = 0;
        }
        if (stats.quizzes.total > 0) {
          stats.quizzes.percent = Math.round(stats.quizzes.completed / stats.quizzes.total * 100);
        } else {
          stats.quizzes.percent = 0;
        }
        if (stats.quizzes.completed > 0) {
          stats.quizzes.scoreAvg = Math.round(stats.quizzes.scoreSum / stats.quizzes.completed);
        } else {
          stats.quizzes.scoreAvg = 0;
        }
        if (stats.reads.total > 0) {
          stats.reads.percent = Math.round(stats.reads.completed / stats.reads.total * 100);
        } else {
          stats.reads.percent = 0;
        }
      }
    });
    if (stats.total > 0) {
      stats.percent = Math.round(stats.percent / stats.total);
    }

    user.stats = stats;
  });

  return users;
};

window.sortUsers = (users, orderBy, orderDirection) => {
  switch (orderBy) {
    case 'name':
      return users.sort((a, b) => {
        if (orderDirection === 'asc') {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      });
    case 'percent':
      return users.sort((a, b) => {
        if (a.stats && b.stats) {
          if (orderDirection === 'asc') {
            return a.stats.percent - b.stats.percent;
          } else {
            return b.stats.percent - a.stats.percent;
          }
        } else {
          return -1;
        }
      });
    default:
      break;
  }
};

window.filterUsers = (users, search) => {
  //guardando en una variable el nuevo arreglo 
  let newArrUsers = [];
  //users pasa por un filtrado al cual le paso cada elemento del arreglo que recorrera
  return users.filter(cohort => {
    //si el search coincide con el usuario y este es >= a 0
    return cohort.id.toLowerCase().indexOf(search.toLowerCase()) >= 0;
  });
  //entonces nos entregara el nuevo array
  return newArrUsers;
};

window.processCohortData = (options, cohortData, users, progress, orderBy, sortUsers, orderDirection, search) => {

};


