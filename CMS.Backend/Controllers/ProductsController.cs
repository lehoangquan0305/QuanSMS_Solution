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
        // ==========================
        // GET: api/products/latest
        // ==========================
        [HttpGet("latest")]
        public async Task<IActionResult> GetLatestProducts()
        {
            // Lấy 3 sản phẩm mới nhất, tối ưu các trường trả về giống GetAll
            var products = await _context.Products
                .OrderByDescending(p => p.Id)
                .Take(3)
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

        [HttpGet("hot")]
        public async Task<IActionResult> GetHotProducts()
        {
            // 1. Tìm 3 ProductId có tổng số lượng bán (Quantity) cao nhất trong bảng OrderDetails
            var topProductIds = await _context.OrderDetails
                .GroupBy(od => od.ProductId)
                .OrderByDescending(g => g.Sum(od => od.Quantity)) // Thằng nào bán nhiều nhất xếp lên đầu
                .Take(3)
                .Select(g => g.Key)
                .ToListAsync();

            // 2. Lấy thông tin chi tiết của 3 sản phẩm đó
            var products = await _context.Products
                .Where(p => topProductIds.Contains(p.Id))
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity
                })
                .ToListAsync();

            // Trường hợp DB mới tinh chưa có ai mua gì (bảng OrderDetails trống), 
            // thì mình fallback quay về lấy đỡ 3 sản phẩm có Id lớn nhất để trang web không bị trống
            if (products.Count == 0)
            {
                products = await _context.Products
                    .OrderByDescending(p => p.Id)
                    .Take(3)
                    .Select(p => new { p.Id, p.Name, p.Price, p.ImageUrl, p.StockQuantity })
                    .ToListAsync();
            }

            return Ok(products);
        }
    }
}