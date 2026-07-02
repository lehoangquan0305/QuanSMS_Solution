using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using CMS.Backend.Models;
using CMS.Backend.Services;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService;

        public OrdersController(ApplicationDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // POST: api/orders
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest input)
        {
            if (input == null || input.Items == null || input.Items.Count == 0)
            {
                return BadRequest(new { message = "Dữ liệu đơn hàng không hợp lệ" });
            }

            try
            {
                // 1. KIỂM TRA TỒN KHO
                foreach (var item in input.Items)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product == null)
                        return BadRequest(new { message = $"Không tìm thấy sản phẩm ID {item.ProductId}" });

                    if (product.StockQuantity < item.Quantity)
                        return BadRequest(new { message = $"Sản phẩm {product.Name} không đủ tồn kho" });
                }

                // 2. TẠO ORDER
                var newOrder = new Order
                {
                    CustomerId = input.CustomerId,
                    Notes = input.Notes,
                    OrderDate = DateTime.Now,
                    Status = 0
                };

                _context.Orders.Add(newOrder);
                await _context.SaveChangesAsync();

                // 3. TẠO ORDER DETAIL & TRỪ TỒN KHO
                foreach (var item in input.Items)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);
                    var detail = new OrderDetail
                    {
                        OrderId = newOrder.Id,
                        ProductId = product.Id,
                        Quantity = item.Quantity,
                        UnitPrice = product.Price
                    };

                    _context.OrderDetails.Add(detail);
                    product.StockQuantity -= item.Quantity;
                }

                await _context.SaveChangesAsync();

                // 4. GỬI EMAIL THÔNG BÁO
                try
                {
                    var customer = await _context.Customers.FindAsync(input.CustomerId);
                    if (customer != null && !string.IsNullOrEmpty(customer.Email))
                    {
                        // Tạo nội dung HTML chuyên nghiệp
                        string body = $@"
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;'>
        <div style='background-color: #2c3e50; padding: 20px; text-align: center;'>
            <h1 style='color: #ffffff; margin: 0;'>ADIDAS STORE</h1>
        </div>
        <div style='padding: 30px;'>
            <h2 style='color: #333;'>Đơn hàng của bạn đã được đặt thành công!</h2>
            <p style='color: #555;'>Xin chào <strong>{customer.FullName}</strong>,</p>
            <p style='color: #555;'>Cảm ơn bạn đã tin tưởng mua sắm tại ADIDAS STORE. Đơn hàng của bạn đã được hệ thống ghi nhận.</p>
            
            <div style='background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;'>
                <p style='margin: 5px 0;'><strong>Mã đơn hàng:</strong> #{newOrder.Id}</p>
                <p style='margin: 5px 0;'><strong>Ngày đặt:</strong> {newOrder.OrderDate:dd/MM/yyyy HH:mm}</p>
            </div>

            <p style='color: #555;'>Bộ phận kho đang chuẩn bị hàng và sẽ sớm liên hệ với bạn qua số điện thoại <strong>{customer.Phone}</strong>.</p>
        </div>
        <div style='background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #888;'>
            <p>ADIDAS STORE - Nền tảng thương mại điện tử chuyên nghiệp</p>
            <p>Nếu bạn cần hỗ trợ, hãy liên hệ hotline: 1900 888 666</p>
        </div>
    </div>";

                        _emailService.SendEmail(customer.Email, "Xác nhận đặt hàng thành công #" + newOrder.Id, body);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Lỗi gửi mail: " + ex.Message);
                }

                return Ok(new
                {
                    success = true,
                    message = "Đặt hàng thành công",
                    orderId = newOrder.Id
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound(new { message = "Không tìm thấy đơn hàng" });

            // Chỉ cho phép hủy nếu đơn hàng đang ở trạng thái 0 (Chờ xử lý)
            if (order.Status != 0)
            {
                return BadRequest(new { message = "Đơn hàng này không thể hủy vì đã được xử lý hoặc đã giao." });
            }

            order.Status = 3; // Giả sử 3 là trạng thái "Đã hủy"
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Đơn hàng đã được hủy thành công." });
        }

        // GET: api/orders/customer/{customerId}
        [HttpGet("customer/{customerId}")]
        public IActionResult GetCustomerOrders(int customerId)
        {
            try
            {
                var orders = _context.Orders
                    .Where(o => o.CustomerId == customerId)
                    .OrderByDescending(o => o.OrderDate)
                    .Select(o => new
                    {
                        o.Id,
                        o.CustomerId,
                        o.OrderDate,
                        o.Notes,
                        Status = o.Status == 0 ? "Chờ xử lý" :
         (o.Status == 1 ? "Đang giao" :
         (o.Status == 3 ? "Đã hủy" : "Đã hoàn thành"))
                    })
                    .ToList();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }



        // GET: api/orders/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderDetail(int id)
        {
            try
            {
                var order = await _context.Orders.FindAsync(id);
                if (order == null) return NotFound(new { message = "Không tìm thấy đơn hàng" });

                var details = _context.OrderDetails
                    .Where(d => d.OrderId == id)
                    .Select(d => new
                    {
                        d.Id,
                        d.ProductId,
                        d.Quantity,
                        d.UnitPrice,
                        ProductName = _context.Products.Where(p => p.Id == d.ProductId).Select(p => p.Name).FirstOrDefault()
                    })
                    .ToList();

                return Ok(new
                {
                    OrderInfo = new { order.Id, order.CustomerId, order.OrderDate, order.Notes, Status = order.Status },
                    Items = details
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}