describe('data', () => {

  it('debería exponer función computeUsersStats en objeto global', () => {
    assert.isFunction(computeUsersStats);
  });

  it('debería exponer función sortUsers en objeto global', () => {
    assert.isFunction(sortUsers);
  });

  it('debería exponer función filterUsers en objeto global', () => {
    assert.isFunction(filterUsers);
  });

  it('debería exponer función processCohortData en objeto global', () => {
    assert.isFunction(processCohortData);
  });

  describe('computeUsersStats(users, progress, courses)', () => {
    const cohort = fixtures.cohorts.find(item => item.id === 'lim-2018-03-pre-core-pw');
    const courses = Object.keys(cohort.coursesIndex);
    const { users, progress } = fixtures;

    it('debería retornar arreglo de usuarios con propiedad stats', () => {
      const processed = computeUsersStats(users, progress, courses);

      assert.equal(users.length, processed.length);

      processed.forEach(user => {
        assert.ok(user.hasOwnProperty('stats'));
        assert.isNumber(user.stats.percent);
        assert.isObject(user.stats.exercises);
        assert.isObject(user.stats.quizzes);
        assert.isObject(user.stats.reads);
      });
    });

    describe('user.stats para el primer usuario en data de prueba - ver carpeta data/', () => {

      const processed = computeUsersStats(users, progress, courses);

      it(
        'debería tener propiedad percent con valor 53',
        () => assert.equal(processed[0].stats.percent, 53)
      );

      it('debería tener propiedad exercises con valor {total: 2, completed: 1, percent: 50}', () => {
        assert.deepEqual(processed[0].stats.exercises, {
          total: 2,
          completed: 1,
          percent: 50,
        });
      });

      it('debería tener propiedad quizzes con valor {total: 3, completed: 2, percent: 67, scoreSum: 57, scoreAvg: 29}', () => {
        assert.deepEqual(processed[0].stats.quizzes, {
          total: 3,
          completed: 2,
          percent: 67,
          scoreAvg: 29,
          scoreSum: 57,
        });
      });

      it('debería tener propiedad reads con valor {total: 11, completed: 6, percent: 55}', () => {
        assert.deepEqual(processed[0].stats.reads, {
          total: 11,
          completed: 6,
          percent: 55,
        });
      });

    });

  });

  describe('sortUsers(users, orderBy, orderDirection)', () => {
    const cohort = fixtures.cohorts.find(item => item.id === 'lim-2018-03-pre-core-pw');
    const courses = Object.keys(cohort.coursesIndex);
    const { users, progress } = fixtures;
    
    it('debería retornar arreglo de usuarios ordenado por nombre ASC', () => {
      const usersAsc = sortUsers(users, 'name', 'asc');
      
      assert.equal(usersAsc[1].name, 'Aide Reyna Huanacuni Pacho');
      assert.equal(usersAsc[233].name, 'Fransheska Chavez');
    });
    it('debería retornar arreglo de usuarios ordenado por nombre DESC', () => {
      const usersDesc = sortUsers(users, 'name', 'desc');

      assert.equal(usersDesc[0].name, 'Zurisadai Rosas Aramburú');
      assert.equal(usersDesc[10].name, 'Yoanna');
    });
    it('debería retornar arreglo de usuarios ordenado por porcentaje general ASC', () => {
      const processed = computeUsersStats(users, progress, courses);
      const usersAsc = sortUsers(processed, 'percent', 'asc');

      assert.equal(usersAsc[0].stats.percent, 0);
      assert.equal(usersAsc[usersAsc.length - 1].stats.percent, 100);
    });
    it('debería retornar arreglo de usuarios ordenado por porcentaje general DESC', () => {
      const processed = computeUsersStats(users, progress, courses);
      const usersDesc = sortUsers(processed, 'percent', 'desc');

      assert.equal(usersDesc[0].stats.percent, 100);
      assert.equal(usersDesc[usersDesc.length - 1].stats.percent, 0);
    });

    it('debería retornar arreglo de usuarios ordenado por ejercicios completados ASC', () => {

    });
    it('debería retornar arreglo de usuarios ordenado por ejercicios completados DESC');
    it('debería retornar arreglo de usuarios ordenado por quizzes completados ASC');
    it('debería retornar arreglo de usuarios ordenado por quizzes completados DESC');
    it('debería retornar arreglo de usuarios ordenado por score promedio en quizzes completados ASC');
    it('debería retornar arreglo de usuarios ordenado por score promedio en quizzes completados DESC');
    it('debería retornar arreglo de usuarios ordenado por lecturas (reads) completadas ASC');
    it('debería retornar arreglo de usuarios ordenado por lecturas (reads) completadas DESC');
  });

  describe('filterUsers(users, filterBy)', () => {

    it('debería retornar nuevo arreglo solo con usuarios con nombres que contengan string (case insensitive)');

  });

  describe('processCohortData({ cohortData, orderBy, orderDirection, filterBy })', () => {

    it('debería retornar arreglo de usuarios con propiedad stats y aplicar sort y filter');

  });

});
