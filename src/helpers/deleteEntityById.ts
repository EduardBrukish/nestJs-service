import { Repository } from 'typeorm';
import { CommonNotFoundException } from '../exception/not-found.exception';

export const deleteEntityById = async <T extends { id: string }>(
  repository: Repository<T>,
  id: string,
): Promise<boolean> => {
  const result = await repository.delete(id);

  if (result.affected === 0) {
    throw new CommonNotFoundException(`Entity with ID ${id} not found`);
  } else {
    return true;
  }
};
