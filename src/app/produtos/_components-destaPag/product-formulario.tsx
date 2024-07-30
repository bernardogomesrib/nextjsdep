'use client';
import { ValidadeT } from '@/app/controllers/newTypes';
import { CriarValidade } from '@/app/controllers/ValidadeController';
import AuthFormMessage from '@/components/quadradoErro';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BuscaTipoPorNCM, CriarProdutoNovo, fetchNCM, ProcurarProdutoViaCodigo, TodosOsTiposDeProdutoViaNomeOuNCM } from '@/lib/databaseSearch';
import { cn } from "@/lib/utils";
import { InstituicoesParceiras, TipoEntrada, TipoProduto } from '@prisma/client';
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { User } from 'next-auth';
import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { ValidadeSchema } from '../../../../lib/zod';
import InstituicoesParceirasSearch from './instituicoesParceiras';
import { TabelaTipos } from './tabela-pesquisaNCM';


export function FormularioParaProduto({ tipoEntrada, user }: { tipoEntrada: TipoEntrada[], user: User }) {
    const [barcode, setBarcode] = useState('');
    const [productName, setProductName] = useState('');
    const [tipoProduto, setTipoProduto] = useState('');
    const [podeSerOsIngredientes, setPodeSerOsIngredientes] = useState<string | null>('');
    const [tipoProdutoId, setTipoProdutoId] = useState<string>('');
    const [newProduct, setNewProduct] = useState<boolean>(false);
    const [validade, setValidade] = React.useState<Date | null>(null);
    const [fabricacao, setFabricacao] = React.useState<Date | null>(null);
    const [error, setError] = useState<string | undefined>('');
    const [isMedicine, setIsMedicine] = useState<boolean>(false);
    const [descricao, setDescricao] = useState<string | null>('');
    const [resultadoPesquisa, setResultadoPesquisa] = useState<TipoProduto[] | null>(null);
    const [trocarFormulario, setTrocarFormulario] = useState<boolean>(true);
    const [produto, setProduto] = useState<any>({});
    const [lote, setLote] = useState<string>('');
    const [instituicaoParceira, setInstituicaoParceira] = useState<InstituicoesParceiras | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [foiSelecionadoInstituicaoParceira, setFoiSelecionadoInstituicaoParceira] = useState<boolean>(false);
    function definirInstituicaoParceira(instituicao: InstituicoesParceiras) {
        setInstituicaoParceira(instituicao);
        setFoiSelecionadoInstituicaoParceira(true)
    }
    // função para zerar todas as variáveis do formulário
    function zerarTodasVariaveis() {
        setTipoProduto('');
        setDescricao(null);
        setBarcode('');
        setProductName('');
        setPodeSerOsIngredientes(null);
        setTipoProdutoId('');
        setNewProduct(false);
        setValidade(null);
        setFabricacao(null);
        setError('');
        setIsMedicine(false);
        setResultadoPesquisa(null);
        setTrocarFormulario(true);
        setProduto({});
        setLote('');
        setFoiSelecionadoInstituicaoParceira(false);
        setErrors({});
    }
    // função para caso o produto seja remédio definir a descrição como os ingredientes
    useEffect(() => {
        if (tipoProduto) {
            if (tipoProduto.includes('Remédio') || tipoProduto.includes('Medicamento') || tipoProduto.includes('Vacina') || tipoProduto.includes('Soro') || tipoProduto.includes('Medicamentos'),tipoProduto.includes('Complementos alimentares')) {
                setPodeSerOsIngredientes(descricao);
                setIsMedicine(true);
            }
        }
    }, [descricao, tipoProduto]);
    // função para procurar o produto via código de barras
    const handleBarcodeScan = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // pegando as informações do form
        const codigo = new FormData(e.currentTarget);
        // definindo código de barras
        setBarcode(codigo.get('codigo') as string);
        // procurando o produto via código de barras
        const result = await ProcurarProdutoViaCodigo(codigo);
        // imprimindo o resultado da busca
        console.log(result);
        // caso o resultado seja sucesso, ele deve definir o produto e o formulário deve trocar
        if (result.success) {
            setNewProduct(false);
            setTrocarFormulario(false);
            setProduto(result.produto);
        } else {
            // caso não tenha encontrado produto tem que ter um erro, porém não acho que esteja funcionando direito, acho que da forma que está atualmente 
            // ele passa por isso e deixa todos os campos vazios
            if (result.success === false && !result.searchedProduct) {
                setError(result.error);
            } else {
                // definindo os campos do formulário com base no que foi encontrado pela api
                setNewProduct(true);
                setProductName(result.searchedProduct.description)
                try {
                    //pegando o ncm para definir um tipo de produto para o produto
                    //ncm é Nomenclatura Comum do Mercosul
                    const ncm = result.searchedProduct.ncm.code as number;
                    console.log(ncm);
                    const existeNCM = await BuscaTipoPorNCM(ncm, result.searchedProduct.ncm.full_description);
                    setDescricao(result.searchedProduct.ncm.description);
                    if (existeNCM?.name) {
                        setTipoProduto(existeNCM.name);
                        setTipoProdutoId(existeNCM.id.toString());
                    } else {
                        if (result.searchedProduct.ncm.code && result.searchedProduct.ncm.full_description) {
                            setTipoProduto(result.searchedProduct.ncm.full_description);
                            setTipoProdutoId(result.searchedProduct.ncm.code.toString());
                        } else {
                            let ncm = await fetchNCM(result.searchedProduct.ncm.code)
                            setTipoProduto(ncm.description);
                            setTipoProdutoId(ncm.code.toString());
                        }
                    }
                } catch (error: any) {
                    setError("Erro ao buscar produto! \n"+error.messe)
                }
            }
        }

    };
    // função para pesquisar o tipo caso não tenha na base de dados da api externa
    const handlePesquisaTipo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        try {
            const resultado = await TodosOsTiposDeProdutoViaNomeOuNCM(formData.get('tipoProduto') as string);
            setResultadoPesquisa(resultado);
            console.log(resultado);
        } catch (error: any) {
            setError('Erro ao pesquisar tipos de produto \n' + error.message);
        }
    }
    // função para adicionar mais produtos caso exista usando o lote e validade
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        try {
            const val: ValidadeT = {
                validade: validade,
                quantidade: parseInt(formData.get('quantidade') as string, 10),
                lote: formData.get('lote') as string,
                fabricacao: fabricacao,
            };
    
            try {
                ValidadeSchema.parse(val);
                console.log("Chegou aqui");
            } catch (error) {
                if (error instanceof z.ZodError) {
                    const newErrors: Record<string, string> = {};
                    error.errors.forEach((err) => {
                        if (err.path) {
                            newErrors[err.path[0]] = err.message;
                        }
                    });
                    setErrors(newErrors);
                    return; // Saia da função se houver erros de validação
                }
            }
            if(instituicaoParceira ===null){
                const tipoEntrada = parseInt(formData.get('tipoEntrada') as string, 10);
                if (val.validade && val.fabricacao && user.id && produto.id && tipoEntrada!=4 && tipoEntrada) {
                    const res = await CriarValidade(val.lote, val.quantidade, val.validade, val.fabricacao, produto.id, tipoEntrada, user.id, null);
        
                    console.log(res);
                    if (res.success === false) {
                        setError("Erro ao salvar a validade! \n" + res.error);
                    } else if (res.success === true && res.entrada) {
                        alert("Entrada cadastrada com sucesso!");
                        zerarTodasVariaveis();
                    }
                } else {
                    console.log(val.validade);
                    console.log(val.fabricacao);
                    console.log(user.id);
                    console.log(produto.id);
                    console.log(instituicaoParceira?.id);
                    console.log(tipoEntrada);
                    setError('Erro ao criar validade, verifique se todos os campos estão preenchidos');
                }
            }else{
                const tipoEntrada = parseInt(formData.get('tipoEntrada') as string, 10);
            if (val.validade && val.fabricacao && user.id && produto.id && (instituicaoParceira?.id||tipoEntrada!=4) && tipoEntrada) {
                const res = await CriarValidade(val.lote, val.quantidade, val.validade, val.fabricacao, produto.id, tipoEntrada, user.id, instituicaoParceira.id);
    
                console.log(res);
                if (res.success === false) {
                    setError("Erro ao salvar a validade! \n" + res.error);
                } else if (res.success === true && res.entrada) {
                    alert("Entrada cadastrada com sucesso!");
                    zerarTodasVariaveis();
                }
            } else {
                console.log(val.validade);
                console.log(val.fabricacao);
                console.log(user.id);
                console.log(produto.id);
                console.log(instituicaoParceira?.id);
                console.log(tipoEntrada);
                setError('Erro ao criar validade, verifique se todos os campos estão preenchidos');
            }
            }
            
        } catch (error) {
            console.log(error);
        }
        
    };
    
    const onSelect = (value: string) => {
        console.log(value);
        if (value === '4') {
            setFoiSelecionadoInstituicaoParceira(true);

        } else {
            setFoiSelecionadoInstituicaoParceira(false);
            setInstituicaoParceira(null);
        }

    }
    // função para criar um novo produto
    const makeNewProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        console.log(user);
        const response = await CriarProdutoNovo(formData, user, isMedicine);
        console.log(response);
        (e.target as HTMLFormElement).reset();
        zerarTodasVariaveis();

        if (response.success == true) {
            alert('Produto cadastrado com sucesso')
        } else {
            alert('Erro ao cadastrar produto')
            setError('Erro ao cadastrar produto \n' + response.error);
        }
    }

    return (
        <div className='flex flex-col items-center p-3 w-full'>
            {error && <AuthFormMessage type="error" message={error} title="Erro" />}
            {trocarFormulario ?
                (<div className='w-full flex flex-col'>
                    {/* caso seja um novo produto deve abrir o formulário de novo produto, porém o padrão é negativo desta variavel */}
                    {newProduct ? (
                        <form onSubmit={makeNewProduct} className='grid w-full flex-col gap-4'>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="codigo">codigo de barras</Label>
                                    <Input name='codigo' type='text' value={barcode} readOnly />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name">nome</Label>
                                    <Input id="name" name="name" type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox checked={isMedicine} id="isMedicine" onClick={() => { setIsMedicine(!isMedicine) }} />
                                    <Label
                                        htmlFor="isMedicine"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        É remédio?
                                    </Label>
                                </div>

                                {tipoProduto ? (<><div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="ncm">tipo id</Label>
                                    <Input id="ncm" name="ncm" type="number" readOnly={tipoProdutoId ? true : (false)} onChange={tipoProdutoId ? (undefined) : () => setTipoProdutoId} value={tipoProdutoId || ''} />
                                </div><div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="ncmName">tipo</Label>
                                        <Input id="ncmName" name="ncmName" type="text" readOnly={tipoProduto ? true : (false)} onChange={tipoProdutoId ? (undefined) : () => setTipoProduto} value={tipoProduto || ''} />
                                    </div></>
                                ) :
                                    (null)
                                }

                                {/* caso seja remédio deve abrir esta parte do formulário */}
                                {isMedicine == true ? (
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor='principioAtivo'>Princípio(s) ativo(s):</Label>
                                        <Input
                                            type="text"
                                            name='principioAtivo'
                                            value={podeSerOsIngredientes ? (podeSerOsIngredientes) : ('')}
                                            onChange={(e) => setPodeSerOsIngredientes(e.target.value)}
                                        />
                                    </div>
                                ) : (null)
                                }
                                <div className="flex flex-row justify-between">
                                    <Button className='w-[49.5%]' type="button" onClick={() => zerarTodasVariaveis()}>cancelar</Button>
                                    <Button className='w-[49.5%]' type="submit">cadastrar</Button>
                                </div>


                            </div>
                        </form>

                    ) : (
                        /* este é o formulário inicial que pergunta o código de barras */
                        <form onSubmit={handleBarcodeScan} className='grid flex w-full'>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5 justify-between w-full">
                                    <Label htmlFor="codigo">codigo</Label>
                                    <Input id="codigo" name="codigo" placeholder="777777777" type="number" required />
                                    <Button type="submit">pesquisar</Button>
                                </div>
                            </div>
                        </form>
                    )}
                    {/* alteração caso não tenha o tipoProduto no produto pesquisado */}
                    {newProduct && !tipoProduto ? (
                        <form onSubmit={handlePesquisaTipo} className='grid w-full flex-col gap-4'>
                            <div className="flex flex-col space-y-1.5 justify-between w-full">
                                <Label htmlFor="tipoProduto">pesquisar tipos de produtos</Label>
                                <Input id="tipoProduto" name="tipoProduto" placeholder="" type="text" />
                                <Button type="submit">pesquisar</Button>
                                {resultadoPesquisa ? (<TabelaTipos resultadoPesquisa={resultadoPesquisa} setTipoProduto={setTipoProduto} setTipoProdutoId={setTipoProdutoId} />) : (null)}
                            </div>
                        </form>
                    ) : (null)}
                </div>) : (<div className='w-full flex grid flex-col'>

                    {/* este é o formulário caso já exista o produto na base de dados interna, que deve definir a validade e lote */}
                    <form onSubmit={handleFormSubmit} className='w-full flex grid flex-col'>
                        <div className='flex flex-col space-y-1.5 mt-2 '>
                            <Label htmlFor="codigo">codigo de barras</Label>
                            <Input name='codigo' type='text' value={produto ? (produto.codigo) : ('')} readOnly />
                        </div>
                        <div className='flex flex-col space-y-1.5 mt-2 '>
                            <Label htmlFor="lote">lote</Label>
                            <Input name='lote' type='text' />
                            {errors.lote && <AuthFormMessage type="error" message={errors.lote} title="Erro" />}
                        </div>
                        <div className='flex flex-col space-y-1.5 mt-2 '>
                            <Label htmlFor='tipoEntrada'>Tipo de Entrada</Label>
                            <Select name='tipoEntrada' onValueChange={(value) => onSelect(value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione um tipo de entrada" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {tipoEntrada.map((tipo) => (<SelectItem key={tipo.id} value={String(tipo.id)}>{tipo.name}</SelectItem>))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col space-y-1.5 mt-2 w-full">
                            <Label>Validade</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !validade && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {validade ? format(validade, "dd/MM/yyyy") : <span>validade</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={validade ? (validade) : (undefined)}
                                        onSelect={(e) => {
                                            if (e === undefined)
                                                setValidade(null)
                                            else
                                                setValidade(e)
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            {errors.validade && <AuthFormMessage type="error" message={errors.validade} title="Erro" />}
                        </div>
                        <div className="flex flex-col space-y-1.5 mt-2 w-full">
                            <Label>data de fabricação</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !fabricacao && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {fabricacao ? format(fabricacao, "dd/MM/yyyy") : <span>fabricacao</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={fabricacao ? (fabricacao) : (undefined)}
                                        onSelect={(e) => {
                                            if (e === undefined)
                                                setFabricacao(null)
                                            else
                                                setFabricacao(e)
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            {errors.fabricacao && <AuthFormMessage type="error" message={errors.fabricacao} title="Erro" />}
                        </div>
                        <div className="flex flex-col space-y-1.5 mt-2 w-full">
                            <Label htmlFor="quantidade">quantidade</Label>
                            <Input id="quantidade" name="quantidade" type="number" />
                            {errors.quantidade && <AuthFormMessage type="error" message={errors.quantidade} title="Erro" />}
                        </div>
                        {
                            instituicaoParceira ? (<>
                                <div className="flex flex-row justify-between mt-2 w-full   ">
                                    <Label htmlFor="instituicaoParceiraNome">Instituição Parceira</Label>
                                    <Input type="text" name="instituicaoParceiraNome" value={instituicaoParceira?.nome} readOnly />
                                    
                                </div>
                                <div><input type="hidden" name="instituicaoParceiraId" value={instituicaoParceira?.id} /></div>
                                </>
                            ) : (null)
                        }
                        <div className="flex flex-row justify-between mt-2 w-full   ">
                            <Button className='w-[49.5%]' onClick={zerarTodasVariaveis}>Cancelar</Button>
                            <Button className='w-[49.5%]' type="submit">enviar</Button>
                        </div>

                    </form>
                    {foiSelecionadoInstituicaoParceira ? (
                        <div className='flex flex-col space-y-1.5 mt-2 w-full'>
                            <InstituicoesParceirasSearch setInstituicaoParceira={definirInstituicaoParceira} />
                        </div>

                    ) : (null)}
                </div>)}

        </div>

    );
};

/* definindo as colunas da tabela para selecionar o tipo do produto */
