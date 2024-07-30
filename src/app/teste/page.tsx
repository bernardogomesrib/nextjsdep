'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { z } from 'zod';
import { InstituicoesParceirasSchema, ValidadeSchema } from '../../../lib/zod';
import { Parceiro, ValidadeT as Validade } from '../controllers/newTypes';



const Page = () => {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();


        try {
            let data: Validade = {
                validade: new Date(event.currentTarget.validade.value),
                quantidade: parseInt(event.currentTarget.quantidade.value),
                lote: event.currentTarget.lote.value,
                fabricacao: new Date(event.currentTarget.fabricacao.value),
            };

            ValidadeSchema.parse(data);
            // Dados válidos, faça o que for necessário aqui
        } catch (error) {

            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    if (err.path) {
                        newErrors[err.path[0]] = err.message;
                    }
                });
                setErrors(newErrors);
            }
        }

    };
    const handleParceiro = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            let data: Parceiro = {
                nome: event.currentTarget.nome.value,
                cnpj: event.currentTarget.cnpj.value,
                email: event.currentTarget.email.value,
                telefone: event.currentTarget.telefone.value,
                endereco: event.currentTarget.endereco.value,
            };
            InstituicoesParceirasSchema.parse(data);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    if (err.path) {
                        newErrors[err.path[0]] = err.message;
                    }
                });
                setErrors(newErrors);
            }
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                {/* Renderize os campos do formulário aqui */}
                {/* Exemplo: */}
                <div>
                    <label htmlFor="validade">Validade:</label>
                    <Input type="date" id="validade" name="validade" />
                    {errors.validade && <span>{errors.validade}</span>}
                </div>
                <div>
                    <label htmlFor="quantidade">Quantidade:</label>
                    <Input type="number" id="quantidade" name="quantidade" />
                    {errors.quantidade && <span>{errors.quantidade}</span>}
                </div>
                <div>
                    <label htmlFor="lote">Lote:</label>
                    <Input type="text" id="lote" name="lote" />
                    {errors.lote && <span>{errors.lote}</span>}
                </div>
                <div>
                    <label htmlFor="fabricacao">Fabricação:</label>
                    <Input type="date" id="fabricacao" name="fabricacao" />
                    {errors.fabricacao && <span>{errors.fabricacao}</span>}
                </div>
                <Button type="submit">Enviar</Button>
            </form>

            <form onSubmit={handleParceiro}>
                {/* nome: event.currentTarget.nome.value,
                cnpj: event.currentTarget.cnpj.value,
                email: event.currentTarget.email.value,
                telefone: event.currentTarget.telefone.value,
                endereco: event.currentTarget.endereco.value,
         */}
                <div>
                    <label htmlFor="nome">Nome</label>
                    <Input type="text" id="nome" name="nome" />
                    {errors.nome && <span>{errors.nome}</span>}
                </div>
                <div>
                    <label htmlFor="cnpj">Cnpj</label>
                    <Input type="text" id="cnpj" name="cnpj" />
                    {errors.cnpj && <span>{errors.cnpj}</span>}
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <Input type="email" id="email" name="email" />
                    {errors.email && <span>{errors.email}</span>}
                </div>
                <div>
                    <label htmlFor="telefone">Telefone</label>
                    <Input type="text" id="telefone" name="telefone" />
                    {errors.telefone && <span>{errors.telefone}</span>}
                </div>
                <div>
                    <label htmlFor="endereco">Endereço</label>
                    <Input type="text" id="endereco" name="endereco" />
                    {errors.endereco && <span>{errors.endereco}</span>}
                </div>
                <div>
                    <Button type="submit">Enviar</Button>
                </div>
            </form>
        </div>
    );
};

export default Page;