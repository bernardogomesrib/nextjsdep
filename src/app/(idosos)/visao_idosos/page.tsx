// app/visao_idosos/page.tsx
'use client'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Acolhido } from '@prisma/client';
import { useEffect, useState } from 'react';
import { columns } from "./columns";
import { DataTable } from './dataTable';
import { osIdosos, pesquisarIdoso } from './visao_idosos';

export default function IdososPage() {
    const [data, setData] = useState<Acolhido[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const acolhidos = await osIdosos();
                
                setData(acolhidos.props.acolhidos);
            } catch (error) {
                console.error('Error fetching acolhidos:', error);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
    
            const response = await pesquisarIdoso(formData);
            console.log(response)
            setData(response);
    }

    return (
        <div className="container mx-auto py-10">
            <form onSubmit={handleSubmit} className='flex align-center'>
                <Input name="entrada" />
                <Button type="submit">Pesquisar</Button>
            </form>
            <DataTable columns={columns} data={data} />
        </div>
    );
}