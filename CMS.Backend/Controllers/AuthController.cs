using CMS.Backend.Models;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =====================
        // REGISTER
        // =====================
        [HttpPost("register")]
        public IActionResult Register(AuthRegisterDTO model)
        {
            var exists = _context.Customers.Any(x => x.Email == model.Email);

            if (exists)
            {
                return BadRequest(new { message = "Email đã tồn tại" });
            }

            // Đồng bộ thêm trường nếu DTO của bồ có hỗ trợ nhận Phone/Address lúc đăng ký
            var user = new Customer
            {
                FullName = model.FullName,
                Email = model.Email,
                Password = model.Password
                // Phone = model.Phone,     // Bỏ comment nếu DTO của bồ có trường này
                // Address = model.Address  // Bỏ comment nếu DTO của bồ có trường này
            };

            _context.Customers.Add(user);
            _context.SaveChanges();

            return Ok(new
            {
                success = true,
                message = "Đăng ký thành công",
                // Trả về full bộ đồ lòng sau khi đăng ký thành công luôn
                user = new { user.Id, user.FullName, user.Email, user.Phone, user.Address }
            });
        }

        // =====================
        // LOGIN
        // =====================
        [HttpPost("login")]
        public IActionResult Login(AuthLoginDTO model)
        {
            var user = _context.Customers.FirstOrDefault(x =>
                x.Email == model.Email &&
                x.Password == model.Password);

            if (user == null)
            {
                return BadRequest(new { message = "Sai email hoặc mật khẩu" });
            }

            // ✅ GOM MỘT LÚC TẤT CẢ THÔNG TIN SANG CHO REACT LUÔN!
            return Ok(new
            {
                success = true,
                message = "Đăng nhập thành công",
                user = new
                {
                    user.Id,
                    user.FullName,
                    user.Email,
                    phone = user.Phone,      // Thêm Số điện thoại găm sang Frontend
                    address = user.Address   // Thêm Địa chỉ găm sang Frontend
                }
            });
        }
        // =====================
        // UPDATE PROFILE
        // =====================
        [HttpPut("update-profile")]
        public IActionResult UpdateProfile([FromBody] Customer model)
        {
            // 1. Tìm xem ông customer này có trong DB không dựa vào Id
            var user = _context.Customers.FirstOrDefault(x => x.Id == model.Id);

            if (user == null)
            {
                return NotFound(new { message = "Không tìm thấy người dùng" });
            }

            // 2. Tiến hành cập nhật các trường cho phép sửa
            user.FullName = model.FullName;
            user.Phone = model.Phone;
            user.Address = model.Address;

            // 3. Lưu chặt vào SQL Server
            _context.SaveChanges();

            return Ok(new
            {
                success = true,
                message = "Cập nhật hồ sơ thành công dữ liệu vào database!",
                user = new { user.Id, user.FullName, user.Email, user.Phone, user.Address }
            });
        }
    }
}