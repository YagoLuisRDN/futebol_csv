// Para executar este código, instale a biblioteca faker com:
// npm install @faker-js/faker

const fs = require('fs');
const { faker } = require('@faker-js/faker');

const NUM_RECORDS = 5000; // Ajuste conforme necessário

// Função para remover acentuações de uma string
function removeAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

// Função para gerar um CPF aleatório (11 dígitos)
function generateCPF() {
  let cpf = '';
  for (let i = 0; i < 11; i++) {
    cpf += faker.number.int({ min: 0, max: 9 }).toString();
  }
  return cpf;
}

// Função para escapar valores que serão escritos no CSV
function escapeCSV(value) {
  if (value == null) return '';
  let str = String(value);
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    str = `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Arrays sem acentuação para as colunas que necessitam
const formasPagamento = ['Cartao de Credito', 'Debito Automatico', 'Boleto'];
const escolaridades = ['Fundamental', 'Medio', 'Superior', 'Pos-graduacao'];

// Outros arrays
const planos = ['Bronze', 'Prata', 'Ouro', 'Diamante'];
const statusAssinatura = ['Ativa', 'Inativa', 'Pendente', 'Cancelada'];
const setores = ['Norte', 'Sul', 'Leste', 'Oeste', 'Central'];
const estadosCivis = ['Solteiro', 'Casado', 'Divorciado', 'Viuvo'];
const emailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com'];

// Definição dos headers do CSV
const headers = [
  "nome",
  "dataNascimento",
  "cpf",
  "numeroSocio",
  "sexo",
  "endereco",
  "cep",
  "telefone",
  "email",
  "dataAdesao",
  "planoSocio",
  "status",
  "formaPagamento",
  "dataUltimaRenovacao",
  "preferenciaSetor",
  "participacaoEventos",
  "nivelEngajamento",
  "escolaridade",
  "profissao",
  "renda",
  "estadoCivil",
  "numeroDependentes"
];

const rows = [];
rows.push(headers.join(','));

for (let i = 0; i < NUM_RECORDS; i++) {
  // Dados de Identificação Pessoal (sem títulos)
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const nome = `${firstName} ${lastName}`;
  const dataNascimento = faker.date.between({ from: '1950-01-01', to: '2003-12-31' })
                              .toISOString().split('T')[0];
  const cpf = generateCPF();
  const numeroSocio = i + 1;
  const sexo = faker.helpers.arrayElement(['Masculino', 'Feminino']);

  // Informações de Contato
  const endereco = `${faker.location.streetAddress()}, ${faker.location.city()}`;
  const cep = faker.location.zipCode('#####-###');
  const telefone = faker.phone.number();
  
  // Gera email baseado no nome (remove acentos, espaços e converte para minúsculas)
  const cleanName = removeAccents(nome).replace(/\s+/g, '').toLowerCase();
  const email = `${cleanName}@${faker.helpers.arrayElement(emailDomains)}`;

  // Dados de Adesão e Assinatura
  const dataAdesaoObj = faker.date.between({ from: '2010-01-01', to: '2024-01-01' });
  const dataAdesao = dataAdesaoObj.toISOString().split('T')[0];
  const planoSocio = faker.helpers.arrayElement(planos);
  const status = faker.helpers.arrayElement(statusAssinatura);
  const formaPagamento = faker.helpers.arrayElement(formasPagamento);
  // Gera dataUltimaRenovacao garantindo que não seja menor que dataAdesao
  const dataUltimaRenovacaoObj = faker.date.between({ from: dataAdesaoObj, to: new Date() });
  const dataUltimaRenovacao = dataUltimaRenovacaoObj.toISOString().split('T')[0];

  // Informações de Engajamento com o Clube
  // Gera participação em eventos (valor entre 0 e 10)
  const participacaoEventos = faker.number.int({ min: 0, max: 10 });
  // Calcula nível de engajamento com base na participação:
  // Para cada evento, adiciona 10 pontos mais um ruído aleatório entre 0 e 10, sem ultrapassar 100.
  const baseEngajamento = participacaoEventos * 10;
  const noise = faker.number.int({ min: 0, max: 10 });
  const nivelEngajamento = Math.min(100, baseEngajamento + noise);

  // Dados Demográficos
  const escolaridade = faker.helpers.arrayElement(escolaridades);
  const profissao = faker.person.jobTitle();
  const renda = faker.number.int({ min: 1000, max: 20000 });
  const estadoCivil = faker.helpers.arrayElement(estadosCivis);
  const numeroDependentes = faker.number.int({ min: 0, max: 4 });

  const values = [
    nome,
    dataNascimento,
    cpf,
    numeroSocio,
    sexo,
    endereco,
    cep,
    telefone,
    email,
    dataAdesao,
    planoSocio,
    status,
    formaPagamento,
    dataUltimaRenovacao,
    faker.helpers.arrayElement(setores), // preferenciaSetor
    participacaoEventos,
    nivelEngajamento,
    escolaridade,
    profissao,
    renda,
    estadoCivil,
    numeroDependentes
  ];

  const row = values.map(v => escapeCSV(v)).join(',');
  rows.push(row);
}

const csvContent = rows.join('\n');

// Salva o dataset em um arquivo CSV
fs.writeFileSync('socios_torcedores_dataset.csv', csvContent);
console.log(`Dataset com ${NUM_RECORDS} registros gerado em socios_torcedores_dataset.csv`);
