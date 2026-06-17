using RestaurantManager.Core.Entities;

namespace RestaurantManager.Core.Interfaces;

public interface ICategorieRepository
{
    IEnumerable<Categorie> GetAll();
    Categorie? GetById(int id);
    int Add(Categorie categorie);
    int Update(Categorie categorie);
    int Delete(int id);
}
