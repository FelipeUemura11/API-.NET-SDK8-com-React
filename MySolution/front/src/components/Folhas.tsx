import React, { useState, useEffect } from "react";
import axios from "axios";

interface Folha {
    id: number;
    quantidade: number;
    valor: number;
    mes: string;
    ano: number;
    funcionarioId: number;
    funcionario: {
        id: number;
        nome: string;
        };
}

const Folhas: React.FC = () => {
    const [folhas, setFolhas] = useState<Folha[]>([]);
    const [quantidade, setQuantidade] = useState<number>(0);
    const [valor, setValor] = useState<number>(0);
    const [mes, setMes] = useState<string>("");
    const [ano, setAno] = useState<number>(new Date().getFullYear());
    const [funcionarioId, setFuncionarioId] = useState<number>(0);
    const [editandoId, setEditandoId] = useState<number | null>(null);

    const apiBaseUrl = "http://localhost:5073/folha";

    useEffect(() => {
        carregarFolhas();
    }, []);

    const carregarFolhas = async () => {
        try {
            const response = await axios.get<Folha[]>(`${apiBaseUrl}/listar`);
            setFolhas(response.data);
        }catch(error){
            console.error("Erro ao carregar folhas:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const novaFolha = {
            quantidade,
            valor,
            mes,
            ano,
            funcionarioId,
        };

        try {
            if (editandoId !== null) {
                // Editar folha
                await axios.put(`${apiBaseUrl}/editar/${editandoId}`, novaFolha);
            } else {
                // Adicionar nova folha
                await axios.post(`${apiBaseUrl}/cadastrar`, novaFolha);
            }

            carregarFolhas(); // Atualizar lista de folhas
            setQuantidade(0);
            setValor(0);
            setMes("");
            setAno(new Date().getFullYear());
            setFuncionarioId(0);
            setEditandoId(null);
        }catch(error){
            console.error("Erro ao salvar folha:", error);
        }
    };

    const handleEdit = (id: number) => {
        const folha = folhas.find((f) => f.id === id);
        if (folha) {
            setQuantidade(folha.quantidade);
            setValor(folha.valor);
            setMes(folha.mes);
            setAno(folha.ano);
            setFuncionarioId(folha.funcionarioId);
            setEditandoId(id);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`${apiBaseUrl}/remover/${id}`);
            carregarFolhas();
        }catch(error){
            console.error("Erro ao excluir folha:", error);
        }
    };

    return (
        <div>
        <h1>CRUD de Folhas</h1>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
            <div>
            <label>
                Quantidade:
                <input
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                required
                />
            </label>
            </div>
            <div>
            <label>
                Valor:
                <input
                type="number"
                step="1"
                value={valor}
                onChange={(e) => setValor(Number(e.target.value))}
                required
                />
            </label>
            </div>
            <div>
            <label>
                Mês:
                <input
                type="text"
                value={mes}
                onChange={(e) => setMes(e.target.value)}
                required
                />
            </label>
            </div>
            <div>
            <label>
                Ano:
                <input
                type="number"
                value={ano}
                onChange={(e) => setAno(Number(e.target.value))}
                required
                />
            </label>
            </div>
            <div>
            <label>
                ID do Funcionário:
                <input
                type="number"
                value={funcionarioId}
                onChange={(e) => setFuncionarioId(Number(e.target.value))}
                required
                />
            </label>
            </div>
            <button type="submit">{editandoId !== null ? "Editar" : "Adicionar"}</button>
            {editandoId !== null && (
            <button type="button" onClick={() => setEditandoId(null)}>
                Cancelar
            </button>
            )}
        </form>

        {/* Lista de Folhas */}
        <h2>Lista de Folhas</h2>
        {folhas.length > 0 ? (
            <table>
            <thead>
                <tr>
                <th>ID</th>
                <th>Quantidade</th>
                <th>Valor</th>
                <th>Mês</th>
                <th>Ano</th>
                <th>Funcionário</th>
                <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {folhas.map((folha) => (
                <tr key={folha.id}>
                    <td>{folha.id}</td>
                    <td>{folha.quantidade}</td>
                    <td>{folha.valor}</td>
                    <td>{folha.mes}</td>
                    <td>{folha.ano}</td>
                    <td>{folha.funcionario.nome}</td>
                    <td>
                    <button onClick={() => handleEdit(folha.id)}>Editar</button>
                    <button onClick={() => handleDelete(folha.id)}>Excluir</button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        ) : (
            <p>Nenhuma folha cadastrada.</p>
        )}
        </div>
    );
};

export default Folhas;
