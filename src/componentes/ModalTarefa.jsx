import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mensagensDeErro } from '../api';

function paraNumero(valor) {
  return valor !== '' && valor !== null && valor !== undefined ? Number(valor) : null;
}

export default function ModalTarefa({
  aberto,
  tarefa = null,
  coluna = 'afazer',
  onFechar,
  onSalvar,
  prioridades = [],
  usuarios = [],
  projetos = [],
}) {
  const { usuario } = useAuth();

  const [texto, setTexto] = useState('');
  const [idPrioridade, setIdPrioridade] = useState('2');
  const [usuarioId, setUsuarioId] = useState('');
  const [projetoId, setProjetoId] = useState('');
  const [erros, setErros] = useState([]);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!aberto) return;
    setErros([]);
    setSalvando(false);

    if (tarefa) {
      setTexto(tarefa.texto ?? '');
      setIdPrioridade(String(tarefa.idprioridade ?? 2));
      setUsuarioId(String(tarefa.usuario_id ?? usuario?.id ?? usuarios[0]?.id ?? ''));
      setProjetoId(String(tarefa.projeto_id ?? projetos[0]?.id ?? ''));
    } else {
      setTexto('');
      setIdPrioridade('2');
      setUsuarioId(String(usuario?.id ?? usuarios[0]?.id ?? ''));
      setProjetoId(String(projetos[0]?.id ?? ''));
    }
  }, [aberto, tarefa, usuario, usuarios, projetos]);

  useEffect(() => {
    if (!aberto) return;

    function lidarTecla(e) {
      if (e.key === 'Escape') {
        onFechar?.();
      }
    }

    document.addEventListener('keydown', lidarTecla);
    return () => document.removeEventListener('keydown', lidarTecla);
  }, [aberto, onFechar]);

  if (!aberto) return null;

  async function handleSalvar(e) {
    e.preventDefault();
    setErros([]);
    setSalvando(true);

    const dados = {
      ...(tarefa ? { id: tarefa.id } : {}),
      texto,
      coluna: tarefa ? tarefa.coluna : coluna,
      idprioridade: paraNumero(idPrioridade),
      usuario_id: paraNumero(usuarioId),
      projeto_id: paraNumero(projetoId),
    };

    try {
      await onSalvar(dados);
      onFechar?.();
    } catch (err) {
      setErros(mensagensDeErro(err));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div
        className="modal-content modal-formulario-tarefa"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-cabecalho">
          <h2>{tarefa ? 'Editar tarefa' : 'Nova tarefa'}</h2>
        </div>

        <form onSubmit={handleSalvar} className="modal-form-conteudo">
          <div className="form-group">
            <label htmlFor="tarefa-texto">Tarefa</label>
            <textarea
              id="tarefa-texto"
              placeholder="Descreva a tarefa"
              rows={4}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              className="textarea-estilizado"
            />
          </div>

          <div className="form-group">
            <label htmlFor="tarefa-responsavel">Responsável</label>
            <select
              id="tarefa-responsavel"
              value={usuarioId}
              onChange={(e) => setUsuarioId(e.target.value)}
              className="select-estilizado"
            >
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tarefa-projeto">Projeto</label>
            <select
              id="tarefa-projeto"
              value={projetoId}
              onChange={(e) => setProjetoId(e.target.value)}
              className="select-estilizado"
            >
              {projetos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tarefa-prioridade">Prioridade</label>
            <select
              id="tarefa-prioridade"
              value={idPrioridade}
              onChange={(e) => setIdPrioridade(e.target.value)}
              className="select-estilizado"
            >
              {prioridades.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.descricao}
                </option>
              ))}
            </select>
          </div>

          {erros.length > 0 && (
            <ul className="alerta-erros-lista">
              {erros.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          )}

          <div className="modal-rodape-acoes">
            <button type="button" onClick={onFechar} className="btn-cancelar">
              Cancelar
            </button>
            <button type="submit" disabled={salvando} className="btn-salvar">
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
