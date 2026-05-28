using CMS.Backend.Models;
using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace CMS.Backend.Controllers
{
    public class HomeController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Inject Database Context
        public HomeController(ApplicationDbContext context)
        {
            _context = context;
        }

        // DASHBOARD
        public IActionResult Index()
        {
            // Thống kê dữ liệu thật từ SQL
            ViewBag.TotalPosts = _context.Posts.Count();

            ViewBag.TotalProducts = _context.Products.Count();

            ViewBag.TotalCustomers = _context.Customers.Count();

            ViewBag.TotalOrders = _context.Orders.Count();

            // Lấy 5 đơn hàng mới nhất
            var latestOrders = _context.Orders
                .OrderByDescending(x => x.Id)
                .Take(5)
                .ToList();

            return View(latestOrders);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0,
            Location = ResponseCacheLocation.None,
            NoStore = true)]

        public IActionResult Error()
        {
            return View(new ErrorViewModel
            {
                RequestId = Activity.Current?.Id
                ?? HttpContext.TraceIdentifier
            });
        }
    }
}