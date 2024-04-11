import { Repository, FindOptionsWhere, FindOptionsRelations } from 'typeorm';
import { CommonNotFoundException } from '../exception/not-found.exception';

export const getEntityById = async <T extends { id: string }>(
  collection: Repository<T>,
  id: string,
  relations?: FindOptionsRelations<T>,
): Promise<T | undefined> => {
  const entity = await collection.findOne({
    where: { id } as FindOptionsWhere<T>,
    relations,
  });

  if (!entity) {
    throw new CommonNotFoundException(`Entity with ID ${id} not found`);
  }

  return entity;
};
