using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using CMS.Backend.Models;

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
    [FromBody] CreateOrderRequest input)
        {
            if (input == null || input.Items == null || input.Items.Count == 0)
            {
                return BadRequest(new
                {
                    message = "Dữ liệu đơn hàng không hợp lệ"
                });
            }

            try
            {
                // =========================
                // KIỂM TRA TỒN KHO TRƯỚC
                // =========================
                foreach (var item in input.Items)
                {
                    var product = await _context.Products
                        .FindAsync(item.ProductId);

                    if (product == null)
                    {
                        return BadRequest(new
                        {
                            message = $"Không tìm thấy sản phẩm ID {item.ProductId}"
                        });
                    }

                    if (product.StockQuantity < item.Quantity)
                    {
                        return BadRequest(new
                        {
                            message = $"Sản phẩm {product.Name} không đủ tồn kho"
                        });
                    }
                }

                // =========================
                // TẠO ORDER
                // =========================
                var newOrder = new Order
                {
                    CustomerId = input.CustomerId,
                    Notes = input.Notes,
                    OrderDate = DateTime.Now,
                    Status = 0
                };

                _context.Orders.Add(newOrder);

                await _context.SaveChangesAsync();

                // =========================
                // TẠO ORDER DETAIL
                // =========================
                foreach (var item in input.Items)
                {
                    var product = await _context.Products
                        .FindAsync(item.ProductId);

                    var detail = new OrderDetail
                    {
                        OrderId = newOrder.Id,
                        ProductId = product.Id,
                        Quantity = item.Quantity,
                        UnitPrice = product.Price
                    };

                    _context.OrderDetails.Add(detail);

                    // Trừ tồn kho
                    product.StockQuantity -= item.Quantity;
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Đặt hàng thành công",
                    orderId = newOrder.Id
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }
        // ==========================================
        // GET: api/orders/customer/{customerId}
        // LẤY DANH SÁCH ĐƠN HÀNG CỦA MỘT KHÁCH HÀNG
        // ==========================================
        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetCustomerOrders(int customerId)
        {
            try
            {
                // Tìm tất cả đơn hàng dựa vào CustomerId, sắp xếp đơn mới nhất lên đầu
                var orders = _context.Orders
                    .Where(o => o.CustomerId == customerId)
                    .OrderByDescending(o => o.OrderDate)
                    .Select(o => new
                    {
                        o.Id,
                        o.CustomerId,
                        o.OrderDate,
                        o.Notes,
                        // Ánh xạ trạng thái số (0, 1, 2) sang chữ cho React dễ hiển thị nếu cần
                        Status = o.Status == 0 ? "Chờ xử lý" :
                                 o.Status == 1 ? "Đang giao" :
                                 o.Status == 2 ? "Đã hoàn thành" : "Đã hủy"
                    })
                    .ToList();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }
        // ==========================================
        // GET: api/orders/{id}
        // LẤY CHI TIẾT ĐƠN HÀNG VÀ CÁC SẢN PHẨM BÊN TRONG
        // ==========================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderDetail(int id)
        {
            try
            {
                // 1. Tìm đơn hàng gốc trước
                var order = await _context.Orders.FindAsync(id);
                if (order == null)
                {
                    return NotFound(new { message = "Không tìm thấy đơn hàng" });
                }

                // 2. Lấy danh sách sản phẩm trong đơn hàng đó (Join qua bảng Products để lấy tên, ảnh...)
                var details = _context.OrderDetails
                    .Where(d => d.OrderId == id)
                    .Select(d => new
                    {
                        d.Id,
                        d.ProductId,
                        d.Quantity,
                        d.UnitPrice,
                        // Thêm dòng này để lấy tên sản phẩm hiển thị lên React
                        ProductName = _context.Products.Where(p => p.Id == d.ProductId).Select(p => p.Name).FirstOrDefault()
                    })
                    .ToList();

                // 3. Gộp dữ liệu trả về cho Frontend
                return Ok(new
                {
                    OrderInfo = new
                    {
                        order.Id,
                        order.CustomerId,
                        order.OrderDate,
                        order.Notes,
                        Status = order.Status == 0 ? "Chờ xử lý" :
                                 order.Status == 1 ? "Đang giao" :
                                 order.Status == 2 ? "Đã hoàn thành" : "Đã hủy"
                    },
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