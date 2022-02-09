describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      username: 'testUser',
      name: 'testName',
      password: 'testPassword'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3003')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
  })
  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testUser')
      cy.get('#password').type('testPassword')
      cy.get('#login-button').click()
      cy.contains('Blogs')
      cy.get('.message')
        .should('contain', 'testUser logged in succesfully')

    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('wrong')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
      cy.get('.message')
        .should('contain', 'Logged in failed or incorrect username or password')
    })
  })
  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'testUser', password: 'testPassword' })
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('testTitle')
      cy.get('#author').type('testAuthor')
      cy.get('#url').type('testUrl')
      cy.get('#create-blog').click()
      cy.get('.message')
        .should('contain', 'testTitle Added Succesfully')
      cy.contains('testTitle')
      cy.contains('testAuthor')
    })
    describe('when there are already blogs', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'title1', url: 'url1', author: 'author1' })
        cy.createBlog({ title: 'title2', url: 'url2', author: 'author2' })
        cy.createBlog({ title: 'title3', url: 'url3', author: 'author3' })
      })
      it('a blog can be liked', function() {
        cy.contains('title2').click()
        cy.contains('like').click()
        cy.contains('1 likes')
      })
      it('a blog can be deleted', function() {
        cy.contains('title2').click()
        cy.contains('remove').click()
        cy.contains('title2 Deleted Succesfully')
      })
      it('other users cannot delete blog', function() {
        cy.contains('logout').click()
        const user = {
          username: 'testUser2',
          name: 'testName2',
          password: 'testPassword2'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)
        cy.login({ username: 'testUser2', password: 'testPassword2' })
        cy.contains('title2').parent().get('#delete-button').should('not.exist')
      })
      it('blogs are ordered according to likes', function() {
        cy.contains('title2').click()
        cy.contains('like').click()
        cy.contains('1 likes')
        cy.visit('http://localhost:3003')

        cy.contains('title3').click()
        cy.contains('like').click()
        cy.contains('1 likes')
        cy.contains('like').click()
        cy.contains('2 likes')
        cy.visit('http://localhost:3003')
        cy.wait(5000)
        cy.get('tr').then(rows => {
          cy.get(rows[1]).contains('title3')
          cy.get(rows[1]).contains('title3')
          cy.get(rows[2]).contains('title2')
          cy.get(rows[2]).contains('title2')
          cy.get(rows[3]).contains('title1')
          cy.get(rows[3]).contains('title1')
        })
      })
    })
  })
})