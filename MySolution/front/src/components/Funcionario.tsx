import React, { useState, useEffect } from "react";
import axios from "axios";

const Funcionario: React.FC = () => {
    const[funcionarios, setFuncionario] = useState<FuncionarioForm[]>([]);
    const[nome, setNome] = useState<string>("");
    const[cpf, setCpf] = useState<string>("");
    const[editandoId, setEditandoId] = useState<number | null>(null);

    const apiBaseUrl = "http://localhost:5073/funcionario";

    useEffect(()=>{
        carregarFuncionarios();
    }, []);

    const carregarFuncionarios = async () => {
        try{
            const response = await axios.get<FuncionarioForm[]>(`${apiBaseUrl}/listar`)
            setFuncionario(response.data);
        }catch(error){
            console.error("Erro ao carregar os funcionarios:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            if(editandoId !== null){
                // edit funcionario
                await axios.put(`${apiBaseUrl}/editar/${editandoId}`, {nome, cpf}); // rota de edicao
            }else{
                await axios.post(`${apiBaseUrl}/cadastrar/`, {nome, cpf}); // rota para cadastro
            }

            carregarFuncionarios();
            setNome("");
            setCpf("");
            setEditandoId(null);
        }catch(error){
            console.error("Erro salvar o funcionario.:", error);
        }
    };

    const handleEdit = (id:number) => {
        const funcionario = funcionarios.find((func) => func.id == id);
        if(funcionario){
            setNome(funcionario.nome);
            setCpf(funcionario.cpf);
            setEditandoId(id);
        }
    };

    const handleDelete = async (id:number) => {
        try{
            await axios.delete(`${apiBaseUrl}/remover/${id}`);
            carregarFuncionarios();
        }catch(error){
            console.error("Erro ao deletar funcionario:", error);
        }
    };

    return (
        <div>
            <h1> CRUD de Funcionarios </h1>
            {/*Formulario*/}
            <form onSubmit={handleSubmit}>
                <div>
                <label>
                    Nome:
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required 
                    />
                </label>
                </div>
                <div>
                <label>
                    Cpf:
                    <input
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
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

            {/* Lista de Funcionários */}
            <h2> Lista de Funcionarios </h2>
            {funcionarios.length > 0 ? (
                <table>
                <thead>
                    <tr>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {funcionarios.map((func) => (
                    <tr key={func.id}>
                        <td>{func.nome}</td>
                        <td>{func.cpf}</td>
                        <td>
                        <button onClick={() => handleEdit(func.id)}>Editar</button>
                        <button onClick={() => handleDelete(func.id)}>Excluir</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            ) : (
                <p>Nenhum funcionario cadastrado.</p>
            )}

        </div>
    )

}

export default Funcionario;