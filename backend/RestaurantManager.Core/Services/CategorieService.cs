using RestaurantManager.Core.Entities;
using RestaurantManager.Core.Exceptions;
using RestaurantManager.Core.Interfaces;

namespace RestaurantManager.Core.Services;

public class CategorieService : ICategorieService
{
    private readonly ICategorieRepository _categorieRepository;
    private readonly IPlatRepository _platRepository;

    public CategorieService(ICategorieRepository categorieRepository, IPlatRepository platRepository)
    {
        _categorieRepository = categorieRepository;
        _platRepository = platRepository;
    }

    public IEnumerable<Categorie> GetAll()
    {
        return _categorieRepository.GetAll();
    }

    public Categorie GetById(int id)
    {
        return _categorieRepository.GetById(id)
            ?? throw new CategorieNotFoundException(id);
    }

    public Categorie Create(Categorie categorie)
    {
        categorie.IdCategorie = _categorieRepository.Add(categorie);
        return categorie;
    }

    public void Update(Categorie categorie)
    {
        var lignesAffectees = _categorieRepository.Update(categorie);
        if (lignesAffectees == 0)
        {
            throw new CategorieNotFoundException(categorie.IdCategorie);
        }
    }

    public void Delete(int id)
    {
        if (_platRepository.CountByCategorie(id) > 0)
        {
            throw new CategorieEnUsageException();
        }

        var lignesAffectees = _categorieRepository.Delete(id);
        if (lignesAffectees == 0)
        {
            throw new CategorieNotFoundException(id);
        }
    }
}
