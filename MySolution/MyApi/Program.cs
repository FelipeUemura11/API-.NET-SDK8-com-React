using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyApi.Models;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDataContext>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Substitua pela origem correta (REACT)
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers();

var app = builder.Build();

app.UseCors("AllowSpecificOrigin");
app.UseAuthorization();
app.MapControllers();

app.MapGet("/", () => "Sistema para Aprendizado!!! :D");

app.MapPost("/funcionario/cadastrar", ([FromBody]Funcionario funcionario, [FromServices] AppDataContext ctx) =>
{
    ctx.Funcionarios.Add(funcionario);
    ctx.SaveChanges();
    return Results.Created($"/funcionario/cadastrar/{funcionario.Id}", funcionario);
});

app.MapDelete("/funcionario/remover/{id}", ([FromServices] AppDataContext ctx, [FromRoute] int id) =>
{
    var funcionario = ctx.Funcionarios.Find(id);
    if (funcionario is null)
    {
        return Results.NotFound($"Funcionário com ID {id} não encontrado.");
    }

    ctx.Funcionarios.Remove(funcionario);
    ctx.SaveChanges();
    return Results.Ok($"Funcionário com ID {id} removido com sucesso.");
});

app.MapPut("/funcionario/editar/{id}", async (int id, [FromBody] Funcionario funcionarioAtualizado, [FromServices] AppDataContext ctx) =>
{
    var funcionarioExistente = await ctx.Funcionarios.FindAsync(id);

    if (funcionarioExistente is null)
    {
        return Results.NotFound($"Funcionário com ID {id} não encontrado.");
    }

    funcionarioExistente.Nome = funcionarioAtualizado.Nome;
    funcionarioExistente.CPF = funcionarioAtualizado.CPF;

    await ctx.SaveChangesAsync();

    return Results.Ok(funcionarioExistente);
});


app.MapGet("/funcionario/listar", ([FromServices] AppDataContext ctx) =>
{
    return Results.Ok(ctx.Funcionarios.ToList());
});

app.MapPost("/folha/cadastrar", ([FromBody]Folha folha, [FromServices] AppDataContext ctx) =>
{

    Funcionario? funcionario = ctx.Funcionarios.Find(folha.FuncionarioId);

    if(funcionario is null){
        return Results.NotFound("Funcionario nao encontrado");
    }

    folha.Funcionario = funcionario;
    
    ctx.Folhas.Add(folha);
    ctx.SaveChanges();
    return Results.Created($"/folha/cadastrar/{folha.Id}", folha);
});

app.MapDelete("/folha/remover/{id}", ([FromServices] AppDataContext ctx, [FromRoute] int id) =>
{
    var folha = ctx.Folhas.Find(id);
    
    if (folha is null)
    {
        return Results.NotFound($"Folha com ID {id} não encontrada.");
    }

    // Remove a folha e salva as alterações
    ctx.Folhas.Remove(folha);
    ctx.SaveChanges();

    return Results.Ok($"Folha com ID {id} removida com sucesso.");
});


app.MapGet("/folha/listar", ([FromServices] AppDataContext ctx) =>
{
    return Results.Ok(ctx.Folhas.Include(x => x.Funcionario).ToList());
});

app.MapGet("/folha/buscar/{cpf}/{mes}/{ano}", ([FromServices] AppDataContext ctx, [FromRoute] string cpf, [FromRoute] int mes, [FromRoute] int ano) =>
{
    Folha? folha = ctx.Folhas.Include(x => x.Funcionario).FirstOrDefault(f => f.Funcionario.CPF == cpf && f.Mes == mes && f.Ano == ano);
    if(folha is null){
        return Results.NotFound();
    }
    return Results.Ok(folha);
});
app.MapPut("/folha/editar/{id}", async (int id, [FromBody] Folha folhaAtualizada, [FromServices] AppDataContext ctx) =>
{
    var folhaExistente = await ctx.Folhas.Include(f => f.Funcionario).FirstOrDefaultAsync(f => f.Id == id);

    if (folhaExistente == null)
    {
        return Results.NotFound($"Folha com ID {id} não encontrada.");
    }

    folhaExistente.Quantidade = folhaAtualizada.Quantidade;
    folhaExistente.Valor = folhaAtualizada.Valor;
    folhaExistente.Mes = folhaAtualizada.Mes;
    folhaExistente.Ano = folhaAtualizada.Ano;
    folhaExistente.FuncionarioId = folhaAtualizada.FuncionarioId;

    await ctx.SaveChangesAsync();

    return Results.Ok(folhaExistente);
});

app.Run();
