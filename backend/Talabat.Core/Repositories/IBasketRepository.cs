using Talabat.Core.Models;

namespace Talabat.Core.Repositories
{
    public interface IBasketRepository
    {
        Task<CustomerBasket?> GetBasketAsync(string basketId);
        Task<CustomerBasket?> UpdateBasketAsync(CustomerBasket basket); // Create Or Update
        Task<bool> DeleteBasketAsync(string basketId);
    }
}
