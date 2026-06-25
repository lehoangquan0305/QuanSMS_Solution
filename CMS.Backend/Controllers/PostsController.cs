using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ====================================
        // GET: api/posts
        // ====================================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var posts = await _context.Posts
                .OrderByDescending(p => p.Id)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate,

                    p.CategoryId,

                    CategoryName = p.Category.Name
                })
                .ToListAsync();

            return Ok(posts);
        }

        // ====================================
        // GET: api/posts/category/1
        // ====================================
        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            var posts = await _context.Posts
                .Where(p => p.CategoryId == categoryId)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate
                })
                .ToListAsync();

            return Ok(posts);
        }

        // ====================================
        // GET: api/posts/1
        // ====================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var post = await _context.Posts
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (post == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy bài viết"
                });
            }

            return Ok(new
            {
                post.Id,
                post.Title,
                post.Content,
                post.ImageUrl,
                post.CreatedDate,
                CategoryName = post.Category.Name
            });
        }

        // ====================================
        // POST: api/posts
        // ====================================
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Post model)
        {
            if (model == null)
            {
                return BadRequest(new
                {
                    message = "Dữ liệu không hợp lệ"
                });
            }

            model.CreatedDate = DateTime.Now;

            await _context.Posts.AddAsync(model);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Thêm bài viết thành công",
                data = model
            });
        }

    }
}