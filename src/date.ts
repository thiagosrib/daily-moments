export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('pt-BR', {
    day: 'numeric', month: 'numeric', year: 'numeric'
  });
};
