using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class CategoryController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // DANH SÁCH
        // =========================
        public IActionResult Index()
        {
            var categories = _context.Categories.ToList();

            return View(categories);
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
        public IActionResult Create(Category category)
        {
            _context.Categories.Add(category);

            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // =========================
        // FORM SỬA
        // =========================
        public IActionResult Edit(int id)
        {
            var category = _context.Categories.Find(id);

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
        public IActionResult Edit(Category category)
        {
            _context.Categories.Update(category);

            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // =========================
        // XÓA
        // =========================
        public IActionResult Delete(int id)
        {
            var category = _context.Categories.Find(id);

            if (category == null)
            {
                return NotFound();
            }

            _context.Categories.Remove(category);

            _context.SaveChanges();

            return RedirectToAction("Index");
        }
    }
}