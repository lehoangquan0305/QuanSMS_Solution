using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // DANH SÁCH
        // =========================
        public IActionResult Index()
        {
            var customers = _context.Customers.ToList();

            return View(customers);
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
        public IActionResult Create(Customer customer)
        {
            if (ModelState.IsValid)
            {
                _context.Customers.Add(customer);

                _context.SaveChanges();

                return RedirectToAction("Index");
            }

            return View(customer);
        }

        // =========================
        // FORM SỬA
        // =========================
        public IActionResult Edit(int id)
        {
            var customer = _context.Customers.Find(id);

            if (customer == null)
            {
                return NotFound();
            }

            return View(customer);
        }

        // =========================
        // XỬ LÝ SỬA
        // =========================
        [HttpPost]
        public IActionResult Edit(Customer customer)
        {
            if (ModelState.IsValid)
            {
                _context.Customers.Update(customer);

                _context.SaveChanges();

                return RedirectToAction("Index");
            }

            return View(customer);
        }

        // =========================
        // XÓA
        // =========================
        public IActionResult Delete(int id)
        {
            var customer = _context.Customers.Find(id);

            if (customer == null)
            {
                return NotFound();
            }

            _context.Customers.Remove(customer);

            _context.SaveChanges();

            return RedirectToAction("Index");
        }
    }
}