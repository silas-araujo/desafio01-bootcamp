/*
*Desafio 01. Conceitos do NodeJS
*Crie uma aplicação do zero utilizando Express.
*Essa aplicação será utilizada para armazenar projetos e suas tarefas.
*/


const express = require ('express');

const server = express();

server.use(express.json());

//Variáveis 

let numberOfRequests = 0;
const projects =[];

/*
* Middlewares:
* Crie um middleware que será utilizado em todas rotas que recebem o ID do 
* projeto nos parâmetros da URL que verifica se o projeto com aquele ID existe. 
* Se não existir retorne um erro, caso contrário permita a requisição continuar 
* normalmente; 

* Crie um middleware global chamado em todas requisições que imprime 
* (console.log) uma contagem de quantas requisições foram feitas na 
* aplicação até então;
*/

function verifyProjectExists( req , res , next){ 

const {id}=req.params;

const project = projects.find(p=>p.id===id);

if (!project){

  return res.status(400).json({error : 'Projeto não encontrado' });

}

return next();
}

function logRequests(req , res , next){
  numberOfRequests++;

  console.log (`Número de requisições : ${numberOfRequests}`);

  return next();


}
server.use(logRequests);

/*
Rotas:
POST /projects:A rota deve receber id e title dentro corpo de cadastrar
um novo projeto dentro de um array no seguinte formato: 
{ id: "1", title: "Novo projeto", tasks: [] }; 
Certifique-se de enviar tanto o ID quanto o título do projeto no formato
string com àspas duplas.  */ 

server.post('/projects',(req , res)=>{
const {id,title}=req.body;
const project = {
  id,
  title,
  tasks:[]  
};

projects.push(project);

return res.json(project);

});


//GET /projects: Rota que lista todos projetos e suas tarefas;
server.get ('/projects', (req , res)=>{
return res.json(projects);

});

/*PUT /projects/:id: A rota deve alterar apenas o título do projeto com o id 
presente nos parâmetros da rota; */
server.put ('/projects/:id' ,verifyProjectExists, (req , res)=>{
const {id} = req.params;
const {title}= req.body;

const project= projects.find(p=>p.id===id);
project.title = title;

return res.json(project);

});

/* DELETE /projects/:id: A rota deve deletar o projeto com o id presente nos 
parâmetros da rota; */

server.delete('/projects/:id',verifyProjectExists, (req , res)=>{
  const {id}=req.params;

  const projectIndex=projects.findIndex(p=>p.id===id);
  
  projects.splice(projectIndex, 1);
  
  return res.send();

});

/*POST /projects/:id/tasks: A rota deve receber um campo title e armazenar uma 
nova tarefa no array de tarefas de um projeto específico escolhido através do 
id presente nos parâmetros da rota.*/

server.post('/projects/:id/tasks' ,verifyProjectExists, (req , res)=>{
  const {id}=req.params;  
  const {title}=req.body;
  
  const project=projects.find(p=>p.id===id);
   
  project.tasks.push(title);

  return res.json(project);

});



server.listen(3000);