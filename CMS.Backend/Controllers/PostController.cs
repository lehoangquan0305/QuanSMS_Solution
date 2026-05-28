using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // DANH SÁCH + LỌC DANH MỤC
        // =========================
        public IActionResult Index(int? id)
        {
            var query = _context.Posts
                .Include(p => p.Category)
                .OrderByDescending(p => p.CreatedDate)
                .AsQueryable();

            // Lọc theo danh mục
            if (id != null)
            {
                query = query.Where(p => p.CategoryId == id);
            }

            var posts = query.ToList();

            ViewBag.CategoryId = id;

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
        public IActionResult Create(Post post, IFormFile uploadImage)
        {
            if (ModelState.IsValid)
            {
                // Upload ảnh
                if (uploadImage != null && uploadImage.Length > 0)
                {
                    string folder = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot/uploads"
                    );

                    // Nếu chưa có folder uploads
                    if (!Directory.Exists(folder))
                    {
                        Directory.CreateDirectory(folder);
                    }

                    // Tạo tên file random
                    string fileName =
                        Guid.NewGuid().ToString()
                        + Path.GetExtension(uploadImage.FileName);

                    string filePath = Path.Combine(folder, fileName);

                    // Copy file
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        uploadImage.CopyTo(stream);
                    }

                    // Lưu đường dẫn DB
                    post.ImageUrl = "/uploads/" + fileName;
                }

                post.CreatedDate = DateTime.Now;

                _context.Posts.Add(post);

                _context.SaveChanges();

                return RedirectToAction("Index");
            }

            ViewBag.CategoryList = _context.Categories.ToList();

            return View(post);
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
        public IActionResult Edit(Post post, IFormFile uploadImage)
        {
            if (ModelState.IsValid)
            {
                // Nếu upload ảnh mới
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

                    post.ImageUrl = "/uploads/" + fileName;
                }
                else
                {
                    // Giữ ảnh cũ
                    var oldPost = _context.Posts
                        .AsNoTracking()
                        .FirstOrDefault(p => p.Id == post.Id);

                    if (oldPost != null)
                    {
                        post.ImageUrl = oldPost.ImageUrl;
                    }
                }

                _context.Posts.Update(post);

                _context.SaveChanges();

                return RedirectToAction("Index");
            }

            ViewBag.CategoryList = _context.Categories.ToList();

            return View(post);
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