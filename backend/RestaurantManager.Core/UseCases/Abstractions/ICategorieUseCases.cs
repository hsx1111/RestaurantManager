using RestaurantManager.Core.Models;

namespace RestaurantManager.Core.UseCases.Abstractions;

public interface ICategorieUseCases
{
    IEnumerable<Categorie> GetAll();
    Categorie GetById(int id);
    Categorie Create(Categorie categorie);
    void Update(Categorie categorie);
    void Delete(int id);
}
