rotas de produtos:

/products

GET
/ -> retornar todos os produtos da loja
/:id -> retornar um produto em específico
/type/:type -> retornar todos os produtos de um tipo

POST
/ -> cria um novo produto

PATCH
/:id -> atualiza um produto

DELETE
/:id -> deleta um produto

MIDDLEWARE:

ADMIN -> verificar se é a conta da dona administradora

TOKEN -> verificar se existe um token válido

TODO: configure biome

TODO: Schema of response for every route
TODO: .env para versão do prisma nas chamadas manuais de errors


/USER

*DADOS DO USUÁRIO VIRÃO DE UMA REQUISIÇÃO AO BANCO DE DADOS COM O ID DO USUÁRIO QUE SABEREMOS PELO TOKEN ENVIADO PELO HEADER*

GET
/ -> retorna os dados do usuário
/products/reserved -> retorna todos os produtos que o usuário reservou
/products/liked -> retorna todos os produtos que o usuário gostou

PATCH
/ -> atualiza algum dado do usuário