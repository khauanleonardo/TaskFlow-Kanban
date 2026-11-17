// Utilitário para detecção e alternância de temas sazonais automáticos

export function obterTemaSazonalPadrao() {
  const agora = new Date();
  const mes = agora.getMonth() + 1; // 1 a 12
  const dia = agora.getDate();

  // Dezembro ou final de novembro: Natal / Fim de Ano
  if (mes === 12 || (mes === 11 && dia >= 10)) {
    return 'natal';
  }
  // Outubro: Halloween
  if (mes === 10) {
    return 'halloween';
  }
  // Junho: Festa Junina
  if (mes === 6) {
    return 'junina';
  }
  // Fevereiro: Carnaval
  if (mes === 2) {
    return 'carnaval';
  }

  return 'padrao';
}

export const TEMAS_INFO = {
  padrao: {
    id: 'padrao',
    nome: 'Tema Padrão',
    icone: '✨',
    descricao: 'Dark glassmorphism profissional'
  },
  natal: {
    id: 'natal',
    nome: 'Natal & Fim de Ano',
    icone: '🎄',
    descricao: 'Neve suave, gorro festivo e clima natalino'
  },
  halloween: {
    id: 'halloween',
    nome: 'Halloween',
    icone: '🎃',
    descricao: 'Acentos em laranja e clima misterioso'
  },
  carnaval: {
    id: 'carnaval',
    nome: 'Carnaval',
    icone: '🎉',
    descricao: 'Acentos festivos e cores alegres'
  }
};