using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // DANH SÁCH
        // =========================
        public IActionResult Index()
        {
            var posts = _context.Posts
    .Include(p => p.Category)
    .OrderByDescending(p => p.CreatedDate)
    .ToList();

            return View(posts);
        }

        // =========================
        // CHI TIẾT
        // =========================
        public IActionResult Details(int id)
        {
            var post = _context.Posts
    .Include(p => p.Category)
    .FirstOrDefault(p => p.Id == id);

            if (post == null)
            {
                return NotFound();
            }

            return View(post);
        }

        // =========================
        // FORM THÊM
        // =========================
        public IActionResult Create()
        {
            ViewBag.CategoryList = _context.Categories.ToList();

            return View();
        }

        // =========================
        // XỬ LÝ THÊM
        // =========================
        [HttpPost]
        public IActionResult Create(Post post)
        {
            post.CreatedDate = DateTime.Now;

            _context.Posts.Add(post);

            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // =========================
        // FORM SỬA
        // =========================
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.Find(id);

            if (post == null)
            {
                return NotFound();
            }

            ViewBag.CategoryList = _context.Categories.ToList();

            return View(post);
        }

        // =========================
        // XỬ LÝ SỬA
        // =========================
        [HttpPost]
        public IActionResult Edit(Post post)
        {
            _context.Posts.Update(post);

            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // =========================
        // XÓA
        // =========================
        public IActionResult Delete(int id)
        {
            var post = _context.Posts.Find(id);

            if (post == null)
            {
                return NotFound();
            }

            _context.Posts.Remove(post);

            _context.SaveChanges();

            return RedirectToAction("Index");
        }
    }
}