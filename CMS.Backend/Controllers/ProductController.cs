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
        public IActionResult Create(Product product, IFormFile uploadImage)
        {
            if (ModelState.IsValid)
            {
                if (uploadImage != null && uploadImage.Length > 0)
                {
                    string folder = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot/uploads"
                    );

                    if (!Directory.Exists(folder))
                    {
                        Directory.CreateDirectory(folder);
                    }

                    string fileName =
                        Guid.NewGuid().ToString()
                        + Path.GetExtension(uploadImage.FileName);

                    string filePath = Path.Combine(folder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        uploadImage.CopyTo(stream);
                    }

                    product.ImageUrl = "/uploads/" + fileName;
                }

                _context.Products.Add(product);
                _context.SaveChanges();

                return RedirectToAction("Index");
            }

            ViewBag.CategoryList = _context.CategoriesProducts.ToList();

            return View(product);
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
        public IActionResult Edit(Product product, IFormFile uploadImage)
        {
            if (ModelState.IsValid)
            {
                if (uploadImage != null && uploadImage.Length > 0)
                {
                    string folder = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot/uploads"
                    );

                    if (!Directory.Exists(folder))
                    {
                        Directory.CreateDirectory(folder);
                    }

                    string fileName =
                        Guid.NewGuid().ToString()
                        + Path.GetExtension(uploadImage.FileName);

                    string filePath = Path.Combine(folder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        uploadImage.CopyTo(stream);
                    }

                    product.ImageUrl = "/uploads/" + fileName;
                }
                else
                {
                    var oldProduct = _context.Products
                        .AsNoTracking()
                        .FirstOrDefault(p => p.Id == product.Id);

                    if (oldProduct != null)
                    {
                        product.ImageUrl = oldProduct.ImageUrl;
                    }
                }

                _context.Products.Update(product);
                _context.SaveChanges();

                return RedirectToAction("Index");
            }

            ViewBag.CategoryList = _context.CategoriesProducts.ToList();

            return View(product);
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