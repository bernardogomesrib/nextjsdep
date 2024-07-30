'use server';

import { Decimal } from "@prisma/client/runtime/library";
import { User } from "next-auth";
import db from "../../lib/db";
export async function ProcurarProdutoViaCodigo(formData:FormData){

    const codigo = formData.get('codigo');
    //rentando encontrar na base de dados com o código de barras
    const produto = await db.produto.findFirst({
        where:{
            codigo:codigo as string
        }
    })
    // caso não exista na base de dados, tenta buscar na API
    if(produto){
        //neste caso existe e retorna o produto
        const formattedItem = {
            ...produto,
            quantidade: produto.quantidade instanceof Decimal ? produto.quantidade.toNumber() : produto.quantidade,
        };
        return {success:true, produto:formattedItem};
    }else{
        //neste caso não existe e tenta buscar na API
        const searchedProduct = await fetchProduct(codigo as string);
        //retornando o que foi encontrado via fetch na api externa
        return {success:false, error:'Produto não encontrado', searchedProduct};
    }
}
/* export async function ProcurarValidade(validade:string,codigo:string,quantidade:number){
        try {
            const produto = await db.produto.findFirst({
                where:{
                    codigo
                }
            });
            const Validade = await db.validade.findFirst({
            where:{
                validade:validade as string,
                produtoId:produto?.id
            }
            })
            if(Validade && produto){
                
                Validade.quantidade = new Decimal(quantidade).plus(Validade.quantidade);
                produto.quantidade = new Decimal(quantidade).plus(produto?.quantidade);
                try {
                    await db.produto.update({
                        where:{
                            id:produto.id
                        },
                        data:{
                            quantidade:produto.quantidade
                        }
                    });
                    await db.validade.update({
                        where:{
                            id:Validade.id
                        },
                        data:{
                            quantidade:Validade.quantidade
                        }
                    });
                } catch (error) {
                    return {success:false, error:'Erro ao atualizar quantidade'};
                }
                return {success:true, Validade};
            }else{
                return {success:false, error:'Validade não encontrada'};
            }
        } catch (error) {
            return {success:false, error:'Validade não encontrada'};
        }
} */
export async function fetchProduct(ean:string) {
    const apiUrl = 'https://api.cosmos.bluesoft.com.br/gtins/' + ean;
    
    const headers = {
        'Accept': '*/*',
        'User-Agent': 'Cosmos-API-Request',
        'X-Cosmos-Token': `${process.env.COSMOS_TOKEN}`
  };
  
  const requestOptions = {
    method: 'GET',
    headers: headers
  };
  
  
  try {
    const response = await fetch(apiUrl, requestOptions);
    const data = await response.json();
    //console.log(data)
    return data; // Retorna os dados diretamente
  } catch (error) {
    console.error('Erro:', error);
    throw new Error('Erro ao buscar produto'); // Lança um erro para tratamento posterior
  }
    
}
export async function fetchProductByEan(ean:string) {
    const apiUrl = 'https://api.upcdatabase.org/product/' + ean;
    
    const headers = {
        'Accept': '*/*',
        'User-Agent': 'Cosmos-API-Request',
        'Authorization': `Bearer ${process.env.UPC_TOKEN}`
  };
  
  const requestOptions = {
    method: 'GET',
    headers: headers
  };
  
  
  try {
    const response = await fetch(apiUrl, requestOptions);
    const data = await response.json();
    if(data.success === false){
        const url = 'https://big-product-data.p.rapidapi.com/gtin/'+ean;
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': `${process.env.RAPIDAPI_KEY}`,
		'x-rapidapi-host': 'big-product-data.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	//console.log(result);
} catch (error) {
	console.error(error);
}
    }
    //console.log(data)
    return data; // Retorna os dados diretamente
  } catch (error) {
    console.error('Erro:', error);
    throw new Error('Erro ao buscar produto'); // Lança um erro para tratamento posterior
  }
    
}
export async function fetchNCM(ncm:string) {
    const apiUrl = 'https://api.cosmos.bluesoft.com.br/ncms/' + ncm+"/products";
    
    
    const headers = {
        'Accept': '*/*',
        'User-Agent': 'Cosmos-API-Request',
        'X-Cosmos-Token': `${process.env.COSMOS_TOKEN}`
  };
  
  const requestOptions = {
    method: 'GET',
    headers: headers
  };
  
  
  try {
    const response = await fetch(apiUrl, requestOptions);
    const data = await response.json();
    //console.log(data)
    return data; // Retorna os dados diretamente
  } catch (error) {
    console.error('Erro:', error);
    throw new Error('Erro ao buscar produto'); // Lança um erro para tratamento posterior
  }
    
}
export async function fetchByName(name:string) {
    const apiUrl = 'https://api.cosmos.bluesoft.com.br/products?query=' + name;
    
    
    const headers = {
        'Accept': '*/*',
        'User-Agent': 'Cosmos-API-Request',
        'X-Cosmos-Token': `${process.env.COSMOS_TOKEN}`
  };
  
  const requestOptions = {
    method: 'GET',
    headers: headers
  };
  
  
  try {
    const response = await fetch(apiUrl, requestOptions);
    const data = await response.json();
    return data; // Retorna os dados diretamente

  } catch (error) {
    console.error('Erro:', error);
    throw new Error('Erro ao buscar produto'); // Lança um erro para tratamento posterior
  }
    
}
export async function CriarProdutoNovo(formData:FormData,user:User,isRemedio:boolean){
    //console.log(user);
    //console.log(formData);
    const tipo = Number(formData.get('ncm'));
    if(typeof tipo !== 'number'){
        return {success:false, error:'Tipo inválido para o NCM',ncm:tipo};
    }
    const descricao = formData.get('ncmName');
    
    const tipoProduto = await BuscaTipoPorNCM(tipo as number,descricao as string);
    
    if(!tipoProduto){
        return{success:false, error:'Erro ao buscar tipo de produto'};
    }
    
    try {
        const product = await db.produto.create({
            data:{
                codigo:formData.get('codigo') as string,
                nome:formData.get('name') as string,
                quantidade:0,
                tipoId:tipoProduto.id
            }
        })
        const formattedItem = {
            ...product,
            quantidade: product.quantidade instanceof Decimal ? product.quantidade.toNumber() : product.quantidade,
        };
        if (isRemedio){
            console.log('é remédio');
            console.log(formData.get('principioAtivo'))
            
            const lista = (formData.get('principioAtivo') as string).split(';');
            let listaDePrincipios = [];
            for (const principio of lista) {
                try {
                    const paExiste = await db.principioAtivo.findFirst({
                        where:{
                            name:principio as string
                        }
                    });
                    if(paExiste){
                        listaDePrincipios.push(paExiste);
                        continue;

                    }
                    listaDePrincipios.push(await db.principioAtivo.create({
                        data:{
                            name:principio as string
                        }
                    }))
                } catch (error) {
                    '';
                }
            }
            console.log('separou as criou principios ativos')
            for (const principio of listaDePrincipios) {
                try {
                    await db.produto.update({
                        where:{
                            id:product.id
                        },
                        data: {
                            principiosAtivos: {
                                connect: {
                                    id: principio.id
                                }
                            }
                        }
                    });
                } catch (error) {
                    '';
                }
            }
            console.log('colocou no produto')
        }
        return{success:true, message:'Produto criado com sucesso',product:formattedItem};
    } catch (error:any) {
        
        return {success:false,message:error.message,error};
    }
}

export async function CriarProdutoNovoCompleto(formData:FormData,searchedProduct:any,user:User){
    const codigo = searchedProduct.gtin;
    const descricao = searchedProduct.description;
    let ncm = searchedProduct.ncm.code
    const tipoEntrada = formData.get('tipoEntrada') as number | unknown;
    const validade = formData.get('validade') as string | unknown;
    const ncmDescription = searchedProduct.ncm.description as string | unknown;
    const lote = formData.get('lote') as string | unknown;
    const data_fabricacao = formData.get('data_fabricacao') as string | unknown;
    const instituicoes_parceirasId = formData.get('InstituicoesParceiras') as string | unknown;
    const quantidade = formData.get('quantidade') as number | unknown;
    if(typeof instituicoes_parceirasId!=='string'){
        return {success:false, error:'Instituição inválida'};
    }
    if(typeof tipoEntrada!=='number'){
        return {success:false, error:'Tipo de entrada inválido'};
    }
    if(typeof validade!=='string'){
        return {success:false, error:'Validade inválida'};
    }
    if(typeof codigo!=='string'){
        return {success:false, error:'Código inválido'};
    }
    if(typeof descricao!=='string'){
        return {success:false, error:'Descrição inválida'};
    }
    if(typeof ncm!=='string'){
        return {success:false, error:'NCM inválido'};
    }else{
        ncm = new Number(ncm);
    }
    if(typeof data_fabricacao!=='string'){
        return {success:false, error:'Data de fabricação inválida'};
    }
    if(typeof lote!=='string'){
        return {success:false, error:'Lote inválido'};
    }
    if(typeof ncmDescription!=='string'){
        return {success:false, error:'NCM inválido'};
    }
    if(typeof quantidade !== 'number'){
        return {success:false, error:'Quantidade inválida'};
    }
    try {
        await db.tipoProduto.create({
            data:{
                id:ncm,
                name:ncmDescription
            }
        });
    } catch (error) {
        '';
    }
    
    try {
        const produto = await db.produto.create({
            data:{
                codigo:codigo as string,
                nome:descricao as string,
                quantidade,
                tipoProduto: ncm
            }
        });
    
        const vldd = await db.validade.create({
            data:{
                validade,
                lote,
                quantidade,
                data_fabricacao,
                produtoId:produto.id
            }
        });
        await db.entrada.create({
            data:{
                quantidade,
                produtoId:produto.id,
                validadeId:vldd.id,
                tipoEntradaId:tipoEntrada as number,
                userId:user.id as string,
                instituicoes_parceirasId
            }
        })
        return {success:true,produto};
    } catch (error:any) {
        return {success:false,erro:error.message as string}
    }
}
export async function BuscaTipoPorNCM(ncm:number,description:string){
    let tipo;
    if(description===''){
        return null;
    }
    try {
        tipo = await db.tipoProduto.findFirst({
            where:{
                id:ncm
            }
        });
        //console.log({message:"primeira vez",tipo});
        if (tipo===null) {
            console.log('chegou dentro?')
            const tipo = await db.tipoProduto.create({
                data: {
                    id: ncm,
                    name: description
                }
            });
            //console.log({message:"segunda vez",tipo});
            return tipo;
        }
  
        return tipo;
    } catch (error:any) {
        return null;
    }
}
export async function TodosOsTipos(){
    return await db.tipoProduto.findMany();
}
export async function TodosOsTiposDeProdutoViaNomeOuNCM(name:string){
    const ncm = parseInt(name);
    if(isNaN(ncm)){
        return await db.tipoProduto.findMany({
            where:{
                name:{
                    contains:name
                }
            }
        });
    }
    return await db.tipoProduto.findMany({
        where:{
            OR:[
                {
                    name:{
                        contains:name
                    }
                },
                {
                    id:{
                        equals:ncm
                    }
                }
            ]
        }
    });
}