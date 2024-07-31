"use client";
import { ValidadeT as Validade } from "@/app/controllers/newTypes";
import { salvarSaida } from "@/app/controllers/saidaController";
import { validadeMaisProximaViaCodigo, validadeMaisProximaViaLote } from "@/app/controllers/ValidadeController";
import AuthFormMessage from "@/components/error/errorcard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InstituicoesParceiras, TipoSaida } from "@prisma/client";
import { User } from "next-auth";
import { useState } from "react";
import { z } from "zod";
import { SaidaSchema } from "../../../../lib/zod";
import InstituicoesParceirasSearch from "../produtos/_components-destaPag/instituicoesParceiras";
import AlertDialogFunc from './_components-saidas/dialogAlerta';



export default function FormularioParaSaida({ tipoSaida, user }: { tipoSaida: TipoSaida[], user: User }) {
    const [viaLote, setViaLote] = useState(true);
    const [barcode, setBarcode] = useState('');
    const [lote, setLote] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [pesquisado, setPesquisado] = useState(false);
    const [resultadoPesquisa, setResultadoPesquisa] = useState<any>();
    const [error, setError] = useState<string | null>(null);
    const [tipoSaidaSelecionado, setTipoSaidaSelecionado] = useState<string>('');
    const [foiSelecionadoInstituicaoParceira, setFoiSelecionadoInstituicaoParceira] = useState(false);
    const [instituicaoParceira, setInstituicaoParceira] = useState<InstituicoesParceiras | null>(null);
    const [quantidadeSaida, setQuantidadeSaida] = useState<number>(0);
    const onSelect = (value: string) => {
        setTipoSaidaSelecionado(value);
        if (value === '4') {
            setFoiSelecionadoInstituicaoParceira(true);
        } else {
            setFoiSelecionadoInstituicaoParceira(false);
            setInstituicaoParceira(null);
        }
    }
    const zerarTodasVariaveis = () => {
        setBarcode('');
        setLote('');
        setErrors({});
        setPesquisado(false);
        setResultadoPesquisa(null);
        setError(null);
        setTipoSaidaSelecionado('');
        setInstituicaoParceira(null);
        setQuantidadeSaida(0);
        setFoiSelecionadoInstituicaoParceira(false);

        console.log("zerando todas variaveis");

    }
    const generatePlaceholder = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.toLocaleString('default', { month: 'short' }).toUpperCase().replace('.', '');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const placeholder = `${year}${month}${day}123`;
        return placeholder;
    }
    const pesquisarViaLote = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(lote);
        setPesquisado(true);
        const resultado = await validadeMaisProximaViaLote(lote)
        if (resultado) {
            console.log(resultado)
            setResultadoPesquisa(resultado);
        } else {
            setError("Lote não encontrado");
        }
    }
    const pesquisarViaBarcode = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(barcode);
        setPesquisado(true);
        const resultado = await validadeMaisProximaViaCodigo(barcode)
        if (resultado) {
            console.log(resultado)
            setResultadoPesquisa(resultado);
        } else {
            setError("Lote não encontrado via código de barras, possivelmente alguma saida foi preenchida incorretamente antes");
        }
    }

    const salvarSaidaLocal = async () => {
        try {
            
            if(quantidadeSaida>resultadoPesquisa.quantidade){
                setError("Quantidade de saida não pode ser maior que a quantidade na validade");
                return;
            }
            if (instituicaoParceira != null) {
                console.log("instituição parceira não é nula")
                SaidaSchema.parse({ quantidade: quantidadeSaida, produtoId: resultadoPesquisa.Produto.id, validadeId: resultadoPesquisa.id, instituicoes_parceirasId: instituicaoParceira.id, userId: user.id, tipoSaidaId: Number(tipoSaidaSelecionado),quantidadeNaValidade:resultadoPesquisa.quantidade as number});
                console.log("passou teste")
            }else {
                console.log("testou ")
                SaidaSchema.parse({ quantidade: quantidadeSaida, produtoId: resultadoPesquisa.Produto.id, validadeId: resultadoPesquisa.id, userId: user.id, tipoSaidaId: Number(tipoSaidaSelecionado),quantidadeNaValidade:resultadoPesquisa.quantidade as number });
                console.log("terminou teste e passou")
            }

            if (user.id && quantidadeSaida !== 0) {

                const result = await salvarSaida(quantidadeSaida, resultadoPesquisa.Produto.id, resultadoPesquisa.id, instituicaoParceira?.id, user.id, Number(tipoSaidaSelecionado));
                if (result) {
                    console.log("saida salva com sucesso");
                    alert("Saida salva com sucesso");
                    zerarTodasVariaveis();
                }
            } else if (quantidadeSaida === 0) {
                alert("Quantidade de saida não pode ser 0");
                setError("Quantidade de saida não pode ser 0");

            }
        } catch (error: any) {
            //console.log(error);
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    if (err.path) {
                        newErrors[err.path[0]] = err.message;
                    }
                });
                setErrors(newErrors);
                return;
            }
            if (error instanceof Error) {
                setError(error.message);
            }else{
                console.log(error)
            }
        }
    }

    return (
        <div className='flex flex-col items-center p-3 gap-3'>
            <div className='w-full flex flex-col'>
                <h1 className='text-2xl font-bold text-center'>Registrar Saida</h1>
            </div>
            <div className='flex flex-col space-y-1.5 justify-between w-full'>
                <Button onClick={() => { setViaLote(!viaLote) }} >Alterar tipo de Saida</Button>
                {error && <AuthFormMessage type="error" message={error} title="Erro" />}
            </div>
            {viaLote ? <div className='w-full flex flex-col'>
                <div className='w-full flex flex-col'>
                    <h2 className='text-2xl font-bold text-center'>Saida via lote</h2>
                </div>
                <form onSubmit={pesquisarViaLote} className='grid w-full flex-col gap-4'>
                    <div className="flex flex-col space-y-1.5 justify-between w-full">
                        <Label htmlFor="lote">Lote</Label>
                        <Input id="lote" name="lote" placeholder={generatePlaceholder()} value={lote? lote:''} required onChange={(e) => { setLote(e.target.value) }} />
                        {errors.lote && <AuthFormMessage type="error" message={errors.lote} title="Erro" />}
                        {!pesquisado && <Button type="submit">Pesquisar</Button>}
                    </div>
                </form>

                {resultadoPesquisa && <div className='w-full flex flex-col'>
                    <ResultadoPesquisa resultado={resultadoPesquisa} tipoSaida={tipoSaida} setTipoSaidaSelecionado={setTipoSaidaSelecionado} zerarTodasVariaveis={zerarTodasVariaveis} salvarSaidaLocal={salvarSaidaLocal} foiSelecionadoInstituicaoParceira={foiSelecionadoInstituicaoParceira} definirInstituicaoParceira={setInstituicaoParceira} instituicao={instituicaoParceira} tipoCodigo={false} onSelect={onSelect} quantidadeSaida={quantidadeSaida} setQuantidadeSaida={setQuantidadeSaida} errors={errors} />
                </div>}
            </div> : <div className='w-full flex flex-col'>
                <div className='w-full flex flex-col'>
                    <h2 className='text-2xl font-bold text-center'>Saida via Código de barras</h2>
                </div>
                <form onSubmit={pesquisarViaBarcode} className='grid w-full flex-col gap-4'>
                    <div className="flex flex-col space-y-1.5 justify-between w-full">
                        <Label htmlFor="codigo">Código</Label>
                        <Input id="codigo" name="codigo" placeholder="777777777" type="number" required onChange={(e) => { setBarcode(e.target.value) }} />
                        {errors.codigo && <AuthFormMessage type="error" message={errors.codigo} title="Erro" />}
                        {!pesquisado && <Button type="submit">Pesquisar</Button>}
                    </div>
                </form>
                {resultadoPesquisa && <div className='w-full flex flex-col'>
                    <ResultadoPesquisa resultado={resultadoPesquisa} tipoSaida={tipoSaida} setTipoSaidaSelecionado={setTipoSaidaSelecionado} zerarTodasVariaveis={zerarTodasVariaveis} salvarSaidaLocal={salvarSaidaLocal} foiSelecionadoInstituicaoParceira={foiSelecionadoInstituicaoParceira} definirInstituicaoParceira={setInstituicaoParceira} instituicao={instituicaoParceira} tipoCodigo={true} onSelect={onSelect} quantidadeSaida={quantidadeSaida} setQuantidadeSaida={setQuantidadeSaida} errors={errors} />
                </div>}
            </div>}
        </div>
    );

};

const ResultadoPesquisa = ({ resultado, tipoSaida, setTipoSaidaSelecionado, zerarTodasVariaveis, salvarSaidaLocal,
    foiSelecionadoInstituicaoParceira, definirInstituicaoParceira, instituicao, tipoCodigo, onSelect, quantidadeSaida, setQuantidadeSaida, errors }:
    {
        resultado: Validade, tipoSaida: TipoSaida[], salvarSaidaLocal: () => void, zerarTodasVariaveis: () => void,
        setTipoSaidaSelecionado: (value: string) => void, foiSelecionadoInstituicaoParceira: boolean,
        definirInstituicaoParceira: (instituicao: InstituicoesParceiras) => void, instituicao: InstituicoesParceiras | null,
        tipoCodigo: boolean | null, onSelect: (value: string) => void, quantidadeSaida: number, setQuantidadeSaida: (num: number) => void,
        errors: Record<string, string>
    }) => {


    return (
        <>
            <AlertDialogFunc title="Atenção!" description="Cheque as informações buscadas antes de inserir!" />
            <div className="flex flex-col space-y-1.5 justify-between w-full">
                <Label htmlFor="validade">Validade</Label>
                <Input name="validade" value={resultado.validade ? new Date(resultado.validade).toLocaleDateString('pt-BR') : ''} disabled readOnly />
            </div>
            <div className="flex flex-col space-y-1.5 justify-between w-full">
                <Label htmlFor="quantidade">Quantidade Encontrada</Label>
                <Input name="quantidade" value={resultado.quantidade ? resultado.quantidade : ''} disabled readOnly />
            </div>
            <div className="flex flex-col space-y-1.5 justify-between w-full">
                <Label htmlFor="lote">Lote</Label>
                <Input name="lote" value={resultado.lote ? resultado.lote : ''} disabled readOnly />
            </div>
            <div className="flex flex-col space-y-1.5 justify-between w-full">
                <Label htmlFor="fabricacao">Data de Fabricação</Label>
                <Input name="fabricacao" value={resultado.fabricacao ? new Date(resultado.fabricacao).toLocaleDateString('pt-BR') : ''} disabled readOnly />
            </div>
            <div className="flex flex-col space-y-1.5 justify-between w-full">
                <Label htmlFor="produto">Produto</Label>
                <Input name="produto" value={resultado.Produto ? resultado.Produto.nome : ''} disabled readOnly />
            </div>
            <div className="flex flex-col space-y-1.5 justify-between w-full">
                <Label htmlFor="codigoDoProduto">Código do Produto</Label>
                <Input name="codigoDoProduto" value={resultado.Produto ? resultado.Produto.codigo : ''} disabled readOnly />
            </div>
            <div className='flex flex-col space-y-1.5 mt-2 '>
                <Label htmlFor='tipoSaida'>Tipo de Saida</Label>
                <Select name='tipoSaida' onValueChange={(value) => onSelect(value)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um tipo de saida" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {tipoSaida.map((tipo) => (<SelectItem key={tipo.id} value={String(tipo.id)}>{tipo.name}</SelectItem>))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                {errors.tipoSaidaId && <AuthFormMessage type="error" message={errors.tipoSaidaId} title="Erro" />}
            </div>
            {instituicao && <div className='flex flex-col space-y-1.5 mt-2 w-full'>
                <Label htmlFor='instituicaoParceira'>Instituição Parceira</Label>
                <Input name='instituicaoParceira' value={instituicao.nome} disabled readOnly />
                <input hidden name="instituicaoParceiraId" value={instituicao.id} />
            </div>}

            {foiSelecionadoInstituicaoParceira ? (
                <div className='flex flex-col space-y-1.5 mt-2 w-full'>
                    <InstituicoesParceirasSearch setInstituicaoParceira={definirInstituicaoParceira} />
                </div>
            ) : (null)}
            <div className='flex flex-col space-y-1.5 mt-2 w-full'>
                <Label htmlFor='quantidadeSaida'>Quantidade de Saida</Label>
                <Input name='quantidadeSaida' type='number' value={quantidadeSaida? quantidadeSaida:''} onChange={(e) => setQuantidadeSaida(Number(e.target.value))} />
                {errors.quantidade && <AuthFormMessage type="error" message={errors.quantidade} title="Erro" />}
            </div>
            <div className="flex flex-row justify-between">
                <Button className='w-[49.5%]' type="button" onClick={() => zerarTodasVariaveis()}>Cancelar</Button>
                <Button className='w-[49.5%]' type="button" onClick={salvarSaidaLocal}>Salvar saida</Button>
            </div>
        </>
    );
}