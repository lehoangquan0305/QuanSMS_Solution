using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // DANH SÁCH
        // =========================
        public IActionResult Index()
        {
            var products = _context.Products
                .Include(p => p.CategoryProduct)
                .ToList();

            return View(products);
        }

        // =========================
        // FORM THÊM
        // =========================
        public IActionResult Create()
        {
            ViewBag.CategoryList =
                _context.CategoriesProducts.ToList();

            return View();
        }

        // =========================
        // XỬ LÝ THÊM
        // =========================
        [HttpPost]
        public IActionResult Create(Product product)
        {
            _context.Products.Add(product);

            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // =========================
        // FORM SỬA
        // =========================
        public IActionResult Edit(int id)
        {
            var product = _context.Products.Find(id);

            if (product == null)
            {
                return NotFound();
            }

            ViewBag.CategoryList =
                _context.CategoriesProducts.ToList();

            return View(product);
        }

        // =========================
        // XỬ LÝ SỬA
        // =========================
        [HttpPost]
        public IActionResult Edit(Product product)
        {
            _context.Products.Update(product);

            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // =========================
        // XÓA
        // =========================
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);

            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);

            _context.SaveChanges();

            return RedirectToAction("Index");
        }
    }
}