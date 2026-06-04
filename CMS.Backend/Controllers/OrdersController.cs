using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/orders
        [HttpPost]
        public async Task<IActionResult> CreateOrder(
            [FromBody] OrderInputDTO input)
        {
            if (input == null)
            {
                return BadRequest(new
                {
                    message = "Dữ liệu đơn hàng không hợp lệ"
                });
            }

            try
            {
                var newOrder = new Order
                {
                    CustomerId = input.CustomerId,
                    Notes = input.Notes,
                    OrderDate = DateTime.Now,
                    Status = 0
                };

                _context.Orders.Add(newOrder);

                await _context.SaveChangesAsync();

                return StatusCode(201, new
                {
                    message = "Đặt hàng thành công",
                    orderId = newOrder.Id
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Lỗi xử lý đơn hàng",
                    detail = ex.Message
                });
            }
        }
    }

    // DTO đặt ngay trong Controller
    public class OrderInputDTO
    {
        public int CustomerId { get; set; }

        public string? Notes { get; set; }
    }
}