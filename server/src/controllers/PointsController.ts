import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {

    async index(request: Request, response: Response){
        
        const { city, uf, items } = request.query;

        const parsedItems = String(items)
            .split(',')
            .map( item => Number(item.trim()));        

        let points;
        
        if(city && uf && items){

            points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        } else {
            points = await knex('points');
        }        

        return response.json(points);

    }

    async show(request: Request, response: Response){

        const { id } = request.params;        
        const point = await knex('points').where('id', id).first();

        if(!point){
            return response.status(404).json({ message: 'Point not found' });
        }
                
        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('title');
        
        return response.json({point, items});        

    }

    async create(request: Request, response: Response){
        const {
            name, 
            email,
            whatsapp,
            latitude, 
            longitude,
            city,
            uf,
            items    
        } = request.body;

        const point = {
            image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80',
            name, 
            email,
            whatsapp,
            latitude, 
            longitude,
            city,
            uf,
        };
        
        const transaction = await knex.transaction();
    
        const insertedIds = await transaction('points').insert(point);
    
        const pointItems = items.map( (itemId: number) => {
            return {
                item_id  : itemId,
                point_id : insertedIds[0]
            }
        });
    
        await transaction('point_items').insert(pointItems);
        await transaction.commit();
           
        return response.json({
            id : insertedIds[0],
            ...point,
        });
    }

}

export default PointsController;