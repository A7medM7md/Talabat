using Microsoft.EntityFrameworkCore;
using Talabat.Core.Models;
using Talabat.Core.Repositories;
using Talabat.Repository.Data;


namespace Talabat.Repository
{
    //public class BasketRepository : IBasketRepository
    //{
    //    private readonly IDatabase _database;

    //    public BasketRepository(IConnectionMultiplexer redis)
    //    {
    //        // Ask CLR for object that implement interface IConnectionMultiplexer
    //        // Add This Service in program => Inside Class [ConfigureRedisExtension]
    //        _database = redis.GetDatabase();
    //    }

    //    public async Task<CustomerBasket?> GetBasketAsync(string basketId)
    //    {
    //        var basket = await _database.StringGetAsync(basketId);

    //        return (basket.IsNull) ? null : JsonSerializer.Deserialize<CustomerBasket>(basket);
    //    }

    //    public async Task<CustomerBasket?> UpdateBasketAsync(CustomerBasket basket)
    //    {
    //        var jsonBasket = JsonSerializer.Serialize(basket);

    //        var createdOrUpdated = await _database.StringSetAsync(basket.Id, jsonBasket, TimeSpan.FromDays(1));

    //        return (!createdOrUpdated) ? null : await GetBasketAsync(basket.Id);
    //    }

    //    public async Task<bool> DeleteBasketAsync(string basketId)
    //    {
    //        return await _database.KeyDeleteAsync(basketId);
    //    }
    //}


    namespace Talabat.Repository
    {
        public class BasketRepository : IBasketRepository
        {
            private readonly AppDbContext _context;

            public BasketRepository(AppDbContext context)
            {
                _context = context;
            }

            public async Task<CustomerBasket?> GetBasketAsync(string basketId)
            {
                return await _context.CustomerBaskets
                    .Include(b => b.Items)
                    .FirstOrDefaultAsync(b => b.Id == basketId);
            }

            public async Task<CustomerBasket?> UpdateBasketAsync(CustomerBasket basket)
            {
                var existingBasket = await _context.CustomerBaskets
                    .Include(b => b.Items)
                    .FirstOrDefaultAsync(b => b.Id == basket.Id);

                // temp change (instead or redis)
                foreach (var item in basket.Items)
                {
                    item.Id = 0;
                }

                if (existingBasket is null)
                {
                    await _context.CustomerBaskets.AddAsync(basket);
                }
                else
                {
                    // Update basket properties
                    existingBasket.DeliveryMethodId = basket.DeliveryMethodId;
                    existingBasket.PaymentIntentId = basket.PaymentIntentId;
                    existingBasket.ClientSecret = basket.ClientSecret;

                    // Replace items
                    _context.BasketItems.RemoveRange(existingBasket.Items);

                    existingBasket.Items = basket.Items;
                }

                await _context.SaveChangesAsync();

                return await GetBasketAsync(basket.Id);
            }

            public async Task<bool> DeleteBasketAsync(string basketId)
            {
                var basket = await _context.CustomerBaskets
                    .Include(b => b.Items)
                    .FirstOrDefaultAsync(b => b.Id == basketId);

                if (basket is null)
                    return false;

                _context.CustomerBaskets.Remove(basket);
                await _context.SaveChangesAsync();

                return true;
            }
        }
    }



}
