import { Request, Response } from 'express';
import knex from '../database/connection'

class PointsController {

  async index(req: Request, res: Response) {
    const { city, uf, items } = req.query
    const parsedItems = String(items)
      .split(',')
      .map( item => Number(item.trim()))

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('points.city', String(city))
      .where('points.uf', String(uf))
      .distinct()
      .select('points.*')

    return res.status(200).json(points)
  }

  async create(req: Request, res: Response) {
    const {
      image,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items
    } = req.body
  
    const trx = await knex.transaction()

    const point = {
      image: 'https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf
    }
    
    const insertedIds = await trx('points').insert(point)
    const point_id = insertedIds[0]
  
    const pointItems = items.map((item_id: number) => {
      return {
        item_id: item_id,
        point_id: point_id
      }
    })
  
    await trx('point_items').insert(pointItems)

    await trx.commit()
  
    return res.json({ id: point_id, ...point })
  }

  async show(req: Request, res: Response) {
    const { id } = req.params
    const point = await knex('points').where('id', id).first()

    if (!point) {
      return res.status(400).json({ error: "Ponto de coleta não encontrado." })
    }

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.id', 'items.title', 'items.image')

    res.status(200).json({point, items})
  }
}

export default new PointsController()