/// <reference types="Cypress"/>

describe('Central de Atendimento ao Cliente TAT', () => {
  beforeEach(() => {
    cy.visit('./src/index.html')
  });
  it('verifica o título da aplicação', () => {
    cy.title().should('eq', 'Central de Atendimento ao Cliente TAT');
  });

  it('preenche os campos obrigatórios e envia o formulário', () => {
    cy.get('#firstName').type('Rafael');
    cy.get('#lastName').type('Targino');
    cy.get('#email').type('rafael@targino.com');
    cy.get('#open-text-area').type('Me dá 1 real', { delay: 0 });
    cy.clock();
    cy.contains('.button', 'Enviar').click();
    cy.get('.success').should('be.visible');
    cy.tick(3000);
    cy.get('.success').should('not.be.visible');
  });

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.get('#firstName').type('Rafael');
    cy.get('#lastName').type('Targino');
    cy.get('#email').type('rafael.targino.com');
    cy.get('#open-text-area').type('Me dá 1 real', { delay: 0 });
    cy.clock();
    cy.contains('.button', 'Enviar').click();
    cy.get('.error').should('be.visible');
    cy.tick(3000);
    cy.get('.error').should('not.be.visible');
  });

  it('campo de telefone só aceita números', () => {
    cy.get('#phone')
      .should('be.empty')
      .type('casa')
      .should('be.empty');

  });

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.clock();
    cy.get('#firstName').type('Rafael');
    cy.get('#lastName').type('Targino');
    cy.get('#email').type('rafael@targino.com');
    cy.get('#open-text-area').type('Me dá 1 real');
    cy.get('#phone-checkbox').check();
    cy.contains('.button', 'Enviar').click();
    cy.get('.error').should('be.visible');
    cy.tick(3000);
    cy.get('.error').should('not.be.visible');
  });

  it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('#firstName')
      .type('Rafael')
      .should('have.value', 'Rafael')
      .clear()
      .should('have.value', '');
    cy.get('#lastName')
      .type('Targino')
      .should('have.value', 'Targino')
      .clear()
      .should('have.value', '');
    cy.get('#email')
      .type('rafael@targino.com')
      .should('have.value', 'rafael@targino.com')
      .clear()
      .should('have.value', '');
    cy.get('#phone')
      .type('999999999')
      .should('have.value', '999999999')
      .clear()
      .should('have.value', '');
  });

  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.clock()
    cy.contains('.button', 'Enviar').click();
    cy.get('.error').should('be.visible');
    cy.tick(3000);
    cy.get('.error').should('not.be.visible');
  });

  it('envia o formuário com sucesso usando um comando customizado', () => {
    cy.clock();
    cy.fillMandatoryFieldsAndSubmit('Rafael', 'Targino', 'rafael@targino.com', 'Me dá 1 real');
    cy.verifySuccessMessageIsVisible();
    cy.tick(3000);
    cy.get('.success').should('not.be.visible');
  });

  context('formas de interagir com campo de seleção suspensa', () => {
    beforeEach(() => {
      cy.get('#product')
        .as('product')
    })
    it('seleciona um produto (YouTube) por seu texto', () => {
      cy.get('@product')
        .select('YouTube')
        .should('have.value', 'youtube');
    });

    it('seleciona um produto (Mentoria) por seu valor (value)', () => {
      cy.get('@product')
        .select('mentoria')
        .should('have.value', 'mentoria');
    });

    it('seleciona um produto (Blog) por seu índice', () => {
      cy.get('@product')
        .select(1)
        .should('have.value', 'blog');
    });
  });
  context('interagindo com botões de rádio', () => {
    it('marca o tipo de atendimento "Feedback"', () => {
      cy.get('input[type=radio][value=feedback]')
        .as('feedback')
        .check()
        .should('have.value', 'feedback');
    });

    it('marca cada tipo de atendimento', () => {
      cy.get('input[type=radio]')
        .should('have.length', 3)
        .each(($radioButton) => {
          cy.wrap($radioButton)
            .check()
            .should('be.checked');
        });
    });
  });
  context('interagindo com checkboxes', () => {
    it('marca ambos checkboxes, depois desmarca o último', () => {
      cy.get('input[type=checkbox')
        .check()
        .should('be.checked')
        .last()
        .uncheck()
        .should('not.be.checked');
    });
  });
  context('fazendo upload de arquivos', () => {
    it('seleciona um arquivo da pasta fixtures', () => {
      cy.get('input[type=file]')
        .selectFile('./cypress/fixtures/example.json')
        .then(input => {
          expect(input[0].files[0].name).to.equal('example.json');
        });
    });
    it('seleciona um arquivo simulando um drag-and-drop', () => {
      cy.get('input[type=file]')
        .selectFile('./cypress/fixtures/example.json', { action: "drag-drop" })
        .then(input => {
          expect(input[0].files[0].name).to.equal('example.json');
        });
    });
    it('seleciona um arquivo simulando um drag-and-drop', () => {
      cy.fixture('example.json', { encoding: null }).as('example');
      cy.get('input[type=file]')
        .selectFile('@example')
        .then(input => {
          expect(input[0].files[0].name).to.equal('example.json');
        });
    });
  });
  context('interagindo com links', () => {
    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
      cy.get('#privacy a').should('have.attr', 'target', '_blank');
    });
    it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
      cy.get('#privacy a')
        .invoke('removeAttr', 'target')
        .click()
        .title().should('eq', 'Central de Atendimento ao Cliente TAT - Política de privacidade')
    });
    it('testa a página da política de privacidade de forma independente', () => {
      cy.visit('./src/privacy.html')
        .title().should('eq', 'Central de Atendimento ao Cliente TAT - Política de privacidade')
    });
  });
});