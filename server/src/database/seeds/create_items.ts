import Knex from 'knex';

export async function seed(knex: Knex){
    await knex('items').insert([
        {
            title : 'Lampadas',
            image : 'lampadas.svg'
        },
        {
            title : 'Pilhas e baterias',
            image : 'baterias.svg'
        },
        {
            title : 'Papíes e papelão',
            image : 'papeis-papelao.svg'
        },
        {          
            title : 'Resíduos eletrônicos',
            image : 'eletronicos.svg'
        },
        {
            title : 'Resíduos orgânicos',
            image : 'organicos.svg'
        },
        {
            title : 'Ólero de cozinha',
            image : 'oleo.svg'
        }
    ]);

}