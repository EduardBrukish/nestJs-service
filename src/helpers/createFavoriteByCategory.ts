import { Repository } from 'typeorm';
import { Favorite } from '../favorites/entity/favorites.entity';

export const createFavoriteByCategory = async (
  collection: Repository<Favorite>,
  id: string,
  category: string,
): Promise<void> => {
  const favorite = new Favorite();
  favorite.id = id;
  favorite[category] = id;

  const favoriteToSave = await collection.create(favorite);

  await collection.save(favoriteToSave);
};
