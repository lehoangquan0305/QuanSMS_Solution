using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class OrderDetailController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderDetailController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // DANH SÁCH CHI TIẾT ĐƠN
        // =========================
        public IActionResult Index()
        {
            var details = _context.OrderDetails
                .Include(od => od.Order)
                .Include(od => od.Product)
                .ToList();

            return View(details);
        }
    }
}