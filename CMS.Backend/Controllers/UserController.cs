using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Administrator")]
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================
        // DANH SÁCH USER
        // ==========================
        public IActionResult Index()
        {
            var users = _context.Users.ToList();

            return View(users);
        }

        // ==========================
        // FORM THÊM
        // ==========================
        public IActionResult Create()
        {
            return View();
        }

        // ==========================
        // XỬ LÝ THÊM
        // ==========================
        [HttpPost]
        public IActionResult Create(User user)
        {
            if (ModelState.IsValid)
            {
                _context.Users.Add(user);

                _context.SaveChanges();

                return RedirectToAction("Index");
            }

            return View(user);
        }

        // ==========================
        // FORM SỬA
        // ==========================
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);

            if (user == null)
            {
                return NotFound();
            }

            return View(user);
        }

        // ==========================
        // XỬ LÝ SỬA
        // ==========================
        [HttpPost]
        public IActionResult Edit(User user)
        {
            if (ModelState.IsValid)
            {
                _context.Users.Update(user);

                _context.SaveChanges();

                return RedirectToAction("Index");
            }

            return View(user);
        }

        // ==========================
        // XÓA
        // ==========================
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);

            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);

            _context.SaveChanges();

            return RedirectToAction("Index");
        }
    }
}