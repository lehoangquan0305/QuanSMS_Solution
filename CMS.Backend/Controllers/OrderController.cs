using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // DANH SÁCH ĐƠN HÀNG
        // =========================
        // =========================
        // DANH SÁCH ĐƠN HÀNG
        // =========================
        public IActionResult Index()
        {
            // 1. Lấy dữ liệu từ DB
            var orders = _context.Orders
                .AsNoTracking()
                .Include(o => o.Customer)
                .OrderByDescending(o => o.OrderDate)
                .ToList();

            // 2. GIẢI PHÁP: Ngắt kết nối vòng lặp ngay trong bộ nhớ trước khi gửi sang View
            // Điều này ngăn chặn Razor Engine rơi vào vòng lặp vô tận (Stack Overflow)
            foreach (var order in orders)
            {
                if (order.Customer != null)
                {
                    order.Customer.Orders = null;
                }
            }


            return View(orders);
        }
        [HttpPost]
        public async Task<IActionResult> UpdateStatus(int id, int status)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.Status = status;
            await _context.SaveChangesAsync();
            return Json(new { success = true });
        }

        [HttpPost]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            // Xóa chi tiết đơn hàng trước (nếu có liên kết khóa ngoại)
            var details = _context.OrderDetails.Where(d => d.OrderId == id);
            _context.OrderDetails.RemoveRange(details);

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            return Json(new { success = true });
        }
    }
}