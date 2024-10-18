import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tiposEntrada = [
    { name: 'Recebido pelo Governo' },
    { name: 'Compra Interna' },
    { name: 'Doado por Parente' },
    { name: 'Doação de Empresa parceira' },
    { name: 'Doação de ONG' },
    { name: 'Doação Anônima' },
  ];
  const tiposSaida = [
    { name: 'Doado' },
    { name: 'Descartado' },
    { name: 'Utilizado por Residente'},
    { name: 'Doado para Empresa Parceira' },
  ];
  const Roles = [
    { name: 'Admin' },
    { name: 'Farmaceutico' },
    {name: 'Enfermeiro'},
    {name: 'RH'},
    { name: 'User' },
  ];
  for (const tipo of tiposEntrada) {
    await prisma.tipoEntrada.create({
      data: tipo,
    });
  }
  for (const tipo of tiposSaida) {
    await prisma.tipoSaida.create({
      data: tipo,
    });
  }

}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });