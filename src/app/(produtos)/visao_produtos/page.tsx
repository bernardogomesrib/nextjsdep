// app/visao_idosos/page.tsx
'use client'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Produto } from '@/app/controllers/newTypes';
import { findPaginated, searchPaginated } from '@/app/controllers/ProdutoController';
import { useEffect, useState } from 'react';
import TabelaProdutos from './_components-destaPag/table';

export default function ProdutosPage() {
    const [data, setData] = useState<Produto[]>([]);
    const [pages, setPages] = useState<number>(0);
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = await searchPaginated(1, 15, event.currentTarget.entrada.value);
        setData(result.products);
    };
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('fetching data');
                const result = await findPaginated(1, 15);
                console.log("chegou até depois do findPaginated");
                console.log(result);
                console.log("chegou até depois do print do result");
                if (result.success) {
                    setData(result.products);
                    setPages(result.totalPages);
                } else {
                    console.log(result);
                    alert('Erro ao buscar produtos');
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="container mx-auto py-10">
            <form onSubmit={handleSubmit} className='flex align-center'>
                <Input name="entrada" />
                <Button type="submit">Pesquisar</Button>
            </form>
            <TabelaProdutos produtos={data} />
        </div>
    );
}
