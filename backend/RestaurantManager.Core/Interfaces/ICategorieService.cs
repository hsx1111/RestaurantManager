using RestaurantManager.Core.Entities;

namespace RestaurantManager.Core.Interfaces;

public interface ICategorieService
{
    IEnumerable<Categorie> GetAll();
    Categorie GetById(int id);
    Categorie Create(Categorie categorie);
    void Update(Categorie categorie);
    void Delete(int id);
}
