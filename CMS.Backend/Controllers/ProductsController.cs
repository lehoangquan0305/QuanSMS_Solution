using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================
        // GET: api/products
        // ==========================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _context.Products
                .OrderByDescending(p => p.Id)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity
                })
                .ToListAsync();

            return Ok(products);
        }

        // ==========================
        // GET: api/products/categoryproduct/1
        // ==========================
        [HttpGet("categoryproduct/{categoryProductId}")]
        public async Task<IActionResult> GetByCategoryProduct(int categoryProductId)
        {
            var products = await _context.Products
                .Where(p => p.CategoryProductId == categoryProductId)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity
                })
                .ToListAsync();

            return Ok(products);
        }

        // ==========================
        // GET: api/products/1
        // ==========================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var product = await _context.Products
                .Include(p => p.CategoryProduct)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy sản phẩm"
                });
            }

            return Ok(new
            {
                product.Id,
                product.Name,
                product.Description,
                product.Price,
                product.StockQuantity,
                product.ImageUrl,
                CategoryName = product.CategoryProduct != null
                    ? product.CategoryProduct.Name
                    : ""
            });
        }
        // ==========================
        // GET: api/products/search/{keyword}
        // ==========================
        [HttpGet("search/{keyword}")]
        public async Task<IActionResult> Search(string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
            {
                return BadRequest("Từ khóa tìm kiếm không được để trống.");
            }

            // Tìm sản phẩm theo tên (không phân biệt hoa thường)
            var products = await _context.Products
                .Where(p => p.Name.ToLower().Contains(keyword.ToLower()))
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity
                })
                .ToListAsync();

            return Ok(products);
        }
    }
}