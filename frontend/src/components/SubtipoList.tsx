import type { TipoComSubtipos } from "../types";

type Props = {
  tipos: TipoComSubtipos[];
  onExcluirSubtipo?: (id: number) => void;
  excluindoId?: number | null;
};

export default function SubtipoList({
  tipos,
  onExcluirSubtipo,
  excluindoId,
}: Props) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-3">Subtipos por Tipo</h3>

      <div className="space-y-4">
        {tipos.map((tipo) => (
          <div key={tipo.id} className="space-y-2">
            <h4 className="font-semibold text-sm text-slate-700">
              {tipo.nome}
            </h4>

            {tipo.subtipos.length === 0 ? (
              <p className="text-xs text-gray-400">
                Nenhum subtipo para este tipo.
              </p>
            ) : (
              <ul className="border rounded-md divide-y bg-white">
                {tipo.subtipos.map((s) => (
                  <li
                    key={s.id}
                    className="px-3 py-2 flex items-center justify-between text-sm"
                  >
                    <span>{s.nome}</span>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="text-gray-400">#{s.id}</span>
                      {onExcluirSubtipo && (
                        <button
                          type="button"
                          onClick={() => onExcluirSubtipo(s.id)}
                          disabled={excluindoId === s.id}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          {excluindoId === s.id ? "Excluindo..." : "Excluir"}
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
