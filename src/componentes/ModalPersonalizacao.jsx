// src/componentes/ModalPersonalizacao.jsx
// Modal para seleção de tema, paleta de cores e preferências visuais

import React from 'react';
import { useTheme, CORES_DESTAQUE } from '../contexts/ThemeContext';
import { X, Moon, Sun, Palette, Sparkles, Check } from 'lucide-react';

export default function ModalPersonalizacao({ aberto, aoFechar }) {
  const { tema, corId, densidade, atualizarPreferencias } = useTheme();

  if (!aberto) return null;

  return (
    <div className="modal-overlay" onClick={aoFechar}>
      <div 
        className="modal-content modal-personalizacao-card" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-cabecalho">
          <div className="modal-titulo-bloco">
            <Palette size={22} className="modal-icone-destaque" />
            <div>
              <h3>Personalização do TaskFlow</h3>
              <p>Configure a estética da interface conforme sua preferência de trabalho.</p>
            </div>
          </div>
          <button onClick={aoFechar} className="btn-fechar-modal" title="Fechar">
            <X size={20} />
          </button>
        </div>

        <div className="modal-corpo-personalizacao">
          {/* Modo de Aparência */}
          <div className="secao-personalizacao">
            <label className="subtitulo-secao">Modo de Exibição</label>
            <div className="opcoes-modo-grid">
              <button
                type="button"
                className={`card-opcao-modo ${tema === 'dark' ? 'selecionado' : ''}`}
                onClick={() => atualizarPreferencias({ tema: 'dark' })}
              >
                <div className="icone-modo-wrapper escuro">
                  <Moon size={22} />
                </div>
                <div className="info-opcao-modo">
                  <span className="titulo-opcao">Dark Glassmorphic</span>
                  <span className="desc-opcao">Fundo escuro profundo com contrastes suaves e descanso ocular.</span>
                </div>
                {tema === 'dark' && <Check size={18} className="icone-check-ativo" />}
              </button>

              <button
                type="button"
                className={`card-opcao-modo ${tema === 'light' ? 'selecionado' : ''}`}
                onClick={() => atualizarPreferencias({ tema: 'light' })}
              >
                <div className="icone-modo-wrapper claro">
                  <Sun size={22} />
                </div>
                <div className="info-opcao-modo">
                  <span className="titulo-opcao">Light Clean Pro</span>
                  <span className="desc-opcao">Fundo claro minimalista com alta nitidez para ambientes iluminados.</span>
                </div>
                {tema === 'light' && <Check size={18} className="icone-check-ativo" />}
              </button>
            </div>
          </div>

          {/* Cores de Destaque */}
          <div className="secao-personalizacao">
            <label className="subtitulo-secao">Cor de Destaque da Marca</label>
            <div className="paleta-cores-grid">
              {CORES_DESTAQUE.map((cor) => {
                const ativo = cor.id === corId;
                return (
                  <button
                    key={cor.id}
                    type="button"
                    className={`botao-cor-amostra ${ativo ? 'ativo' : ''}`}
                    onClick={() => atualizarPreferencias({ corId: cor.id })}
                    title={cor.nome}
                  >
                    <span 
                      className="circulo-cor" 
                      style={{ backgroundColor: cor.hex }}
                    >
                      {ativo && <Check size={14} color="#ffffff" />}
                    </span>
                    <span className="rotulo-cor">{cor.nome}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Densidade de Informação */}
          <div className="secao-personalizacao">
            <label className="subtitulo-secao">Densidade dos Elementos</label>
            <div className="botoes-densidade">
              <button
                type="button"
                className={`btn-densidade ${densidade === 'confortavel' ? 'ativo' : ''}`}
                onClick={() => atualizarPreferencias({ densidade: 'confortavel' })}
              >
                Confortável (Padrão)
              </button>
              <button
                type="button"
                className={`btn-densidade ${densidade === 'compacto' ? 'ativo' : ''}`}
                onClick={() => atualizarPreferencias({ densidade: 'compacto' })}
              >
                Compacto (Mais dados na tela)
              </button>
            </div>
          </div>
        </div>

        <div className="modal-rodape-personalizacao">
          <p className="nota-persistencia">
            <Sparkles size={14} /> Preferências salvas automaticamente no seu navegador.
          </p>
          <button type="button" onClick={aoFechar} className="btn-salvar">
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}
