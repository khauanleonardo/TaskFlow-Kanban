// Acrescenta ao expect os comparadores de tela,
// como o toBeInTheDocument
import '@testing-library/jest-dom/vitest';
import { beforeEach } from 'vitest';

// Garante um localStorage em memória nos testes
// (evita o erro "localStorage.getItem is not a function" no Node 25+ com Vitest 3 + jsdom)
function criarStorageMemoria() {
  let dados = {};
  return {
    getItem: (chave) => (Object.prototype.hasOwnProperty.call(dados, chave) ? dados[chave] : null),
    setItem: (chave, valor) => {
      dados[chave] = String(valor);
    },
    removeItem: (chave) => {
      delete dados[chave];
    },
    clear: () => {
      dados = {};
    },
    key: (indice) => Object.keys(dados)[indice] ?? null,
    get length() {
      return Object.keys(dados).length;
    },
  };
}

const storage = criarStorageMemoria();

Object.defineProperty(globalThis, 'localStorage', {
  value: storage,
  configurable: true,
  writable: true,
});

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: storage,
    configurable: true,
    writable: true,
  });
}

beforeEach(() => {
  storage.clear();
});
