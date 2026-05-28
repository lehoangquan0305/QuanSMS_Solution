using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // DANH SÁCH
        // =========================
        public IActionResult Index()
        {
            var data = _context.CategoriesProducts.ToList();

            return View(data);
        }

        // =========================
        // FORM THÊM
        // =========================
        public IActionResult Create()
        {
            return View();
        }

        // =========================
        // XỬ LÝ THÊM
        // =========================
        [HttpPost]
        public IActionResult Create(CategoryProduct category)
        {
            if (ModelState.IsValid)
            {
                _context.CategoriesProducts.Add(category);

                _context.SaveChanges();

                return RedirectToAction("Index");
            }

            return View(category);
        }

        // =========================
        // FORM SỬA
        // =========================
        public IActionResult Edit(int id)
        {
            var category = _context.CategoriesProducts.Find(id);

            if (category == null)
            {
                return NotFound();
            }

            return View(category);
        }

        // =========================
        // XỬ LÝ SỬA
        // =========================
        [HttpPost]
        public IActionResult Edit(CategoryProduct category)
        {
            if (ModelState.IsValid)
            {
                _context.CategoriesProducts.Update(category);

                _context.SaveChanges();

                return RedirectToAction("Index");
            }

            return View(category);
        }

        // =========================
        // XÓA
        // =========================
        public IActionResult Delete(int id)
        {
            var category = _context.CategoriesProducts.Find(id);

            if (category == null)
            {
                return NotFound();
            }

            _context.CategoriesProducts.Remove(category);

            _context.SaveChanges();

            return RedirectToAction("Index");
        }
    }
}