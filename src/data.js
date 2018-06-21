
window.computeUsersStats = (users, progress, courses) => {
  users.forEach(user => {
    courses.forEach(course => {
      // Si la usuaria tiene progresos en el curso
      if (progress[user.id][course]) {
        // Se crea el atributo stats en el user y se le asigna un objeto con las estadisticas
        user.stats = {
          percent: progress[user.id][course].percent,
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
      }
    }
  }
}
/*window.sortUsers = (users, orderBy, orderDirection) => {

};

window.filterUsers = (users, search) => {

};

window.processCohortData = (options, cohortData, users, progress, orderBy, sortUsers, orderDirection, search) => {

};*/


