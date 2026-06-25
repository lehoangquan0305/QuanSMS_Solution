using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq; // Đảm bảo có thư viện này để dùng được hàm .Where()

namespace CMS.Backend.Controllers
{
    public class OrderDetailController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderDetailController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================================
        // DANH SÁCH CHI TIẾT ĐƠN - ĐÃ SỬA LỌC THEO MÃ ĐƠN HÀNG (orderId)
        // ==========================================================
        public IActionResult Index(int orderId)
        {
            // Phòng hờ trường hợp người dùng gõ bậy URL không có id hoặc id âm, trả về trang danh sách đơn chính
            if (orderId <= 0)
            {
                return RedirectToAction("Index", "Order");
            }

            // Tiến hành lọc: chỉ lấy những Chi tiết đơn hàng nào có OrderId khớp với ID được truyền vào
            var details = _context.OrderDetails
                .Include(od => od.Order)
                .Include(od => od.Product)
                .Where(od => od.OrderId == orderId) // <--- Chìa khóa xử lý dứt điểm lỗi ở đây bồ nhé!
                .ToList();

            return View(details);
        }
    }
}