export interface Plan {
  id: string;
  title: string;
  description: string;
  durationDays: number;
  devotionalIds: string[];
}

export const plans: Plan[] = [
  {
    id: '1',
    title: '7 Dias com Deus',
    description: 'Um plano perfeito para iniciar ou reiniciar sua jornada de intimidade com o Criador.',
    durationDays: 7,
    devotionalIds: ['1', '2', '3', '4', '5', '6', '7']
  },
  {
    id: '2',
    title: '21 Dias de Transformação Espiritual',
    description: 'Mergulhe profundamente na Palavra para renovar sua mente e transformar suas atitudes.',
    durationDays: 21,
    devotionalIds: Array.from({length: 21}, (_, i) => (i + 10).toString())
  },
  {
    id: '3',
    title: 'Plano para Vencer a Ansiedade',
    description: 'Encontre a paz que excede todo entendimento através das promessas de Deus.',
    durationDays: 14,
    devotionalIds: Array.from({length: 14}, (_, i) => (i + 31).toString())
  },
  {
    id: '4',
    title: 'Propósito de Vida',
    description: 'Descubra o que Deus planejou para você desde antes da fundação do mundo.',
    durationDays: 10,
    devotionalIds: Array.from({length: 10}, (_, i) => (i + 50).toString())
  },
  {
    id: '5',
    title: 'Cura Emocional',
    description: 'Deixe o amor de Deus curar as feridas do seu passado e restaurar sua alma.',
    durationDays: 15,
    devotionalIds: Array.from({length: 15}, (_, i) => (i + 60).toString())
  },
  {
    id: '6',
    title: 'Fé no Trabalho',
    description: 'Aprenda a glorificar a Deus através da sua profissão e a ser luz no ambiente de trabalho.',
    durationDays: 7,
    devotionalIds: Array.from({length: 7}, (_, i) => (i + 80).toString())
  },
  {
    id: '7',
    title: 'Família Restaurada',
    description: 'Princípios bíblicos para fortalecer seu casamento e abençoar seus filhos.',
    durationDays: 14,
    devotionalIds: Array.from({length: 14}, (_, i) => (i + 90).toString())
  },
  {
    id: '8',
    title: 'Libertação do Medo',
    description: 'Substitua o medo pela fé inabalável no Deus que tudo pode.',
    durationDays: 10,
    devotionalIds: Array.from({length: 10}, (_, i) => (i + 110).toString())
  },
  {
    id: '9',
    title: 'Fortalecimento Espiritual',
    description: 'Exercícios espirituais para criar resiliência e maturidade na fé.',
    durationDays: 30,
    devotionalIds: Array.from({length: 30}, (_, i) => (i + 130).toString())
  },
  {
    id: '10',
    title: 'Esperança Inabalável',
    description: 'Como manter a esperança viva mesmo nos dias mais difíceis da vida.',
    durationDays: 7,
    devotionalIds: Array.from({length: 7}, (_, i) => (i + 170).toString())
  }
];

export function getPlanById(id: string): Plan | undefined {
  return plans.find(p => p.id === id);
}
