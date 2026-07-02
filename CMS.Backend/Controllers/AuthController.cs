using BCrypt.Net;
using CMS.Backend.Models;
using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services;
using Microsoft.AspNetCore.Mvc;
using MimeKit;
using System.Security.Cryptography;
using MailKit.Net.Smtp;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService;

        public AuthController(ApplicationDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;

        }

        // =====================
        // REGISTER
        // =====================
        [HttpPost("register")]
        public IActionResult Register(AuthRegisterDTO model)
        {
            var exists = _context.Customers.Any(x => x.Email == model.Email);
            if (exists) return BadRequest(new { message = "Email đã tồn tại" });

            // Mã hóa mật khẩu
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);

            var user = new Customer
            {
                FullName = model.FullName,
                Email = model.Email,
                Password = passwordHash, // Lưu chuỗi đã băm
                Phone = model.Phone,     // BỔ SUNG LẠI
                Address = model.Address  // BỔ SUNG LẠI
            };

            _context.Customers.Add(user);
            _context.SaveChanges();

            return Ok(new
            {
                success = true,
                message = "Đăng ký thành công",
                user = new { user.Id, user.FullName, user.Email, user.Phone, user.Address }
            });
        }
        [HttpPost("login")]
        public IActionResult Login(AuthLoginDTO model)
        {
            var user = _context.Customers.FirstOrDefault(x => x.Email == model.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(model.Password, user.Password))
            {
                return BadRequest(new { message = "Sai email hoặc mật khẩu" });
            }

            // Bổ sung đầy đủ thông tin vào đây
            return Ok(new
            {
                success = true,
                message = "Đăng nhập thành công",
                user = new
                {
                    user.Id,
                    user.FullName,
                    user.Email,
                    user.Phone,   // BỔ SUNG LẠI
                    user.Address  // BỔ SUNG LẠI
                }
            });
        }
        [HttpPost("change-password")]
        public IActionResult ChangePassword([FromBody] ChangePasswordDTO model)
        {
            var user = _context.Customers.FirstOrDefault(x => x.Id == model.UserId);
            if (user == null) return NotFound("Không tìm thấy người dùng");

            // Kiểm tra mật khẩu cũ có khớp không
            if (!BCrypt.Net.BCrypt.Verify(model.OldPassword, user.Password))
            {
                return BadRequest(new { message = "Mật khẩu cũ không chính xác" });
            }

            // Băm mật khẩu mới
            user.Password = BCrypt.Net.BCrypt.HashPassword(model.NewPassword);
            _context.SaveChanges();

            return Ok(new { success = true, message = "Đổi mật khẩu thành công" });
        }
        // =====================
        // FORGOT PASSWORD (Tiêu chí 46)
        // =====================
        // =====================
        // FORGOT PASSWORD (Tối ưu theo Tiêu chí 46)
        // =====================
        [HttpPost("forgot-password")]
        public IActionResult ForgotPassword([FromBody] ForgotPasswordDTO model)
        {
            var user = _context.Customers.FirstOrDefault(x => x.Email == model.Email);
            if (user == null)
            {
                return BadRequest(new { message = "Email không tồn tại trong hệ thống!" });
            }

            // 1. Tạo Token cứu hộ bằng Guid (Đơn giản, không lo lỗi phiên bản .NET)
            user.PasswordResetToken = Guid.NewGuid().ToString();
            user.ResetTokenExpires = DateTime.UtcNow.AddMinutes(15); // Hết hạn sau 15 phút
            _context.SaveChanges();

            // 2. Tạo nội dung giao diện Email HTML xịn xò
            string resetLink = $"http://localhost:3000/reset-password?token={user.PasswordResetToken}";
            string htmlBody = $@"
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>
            <h2 style='color: #6a11cb; text-align: center;'>Khôi Phục Mật Khẩu Tài Khoản</h2>
            <p>Xin chào <strong>{user.FullName}</strong>,</p>
            <p>Chúng tôi nhận được yêu cầu thay đổi mật khẩu từ bạn. Vui lòng bấm vào nút bảo mật bên dưới để tiến hành thiết lập mật khẩu mới (Liên kết có hiệu lực trong 15 phút):</p>
            <div style='text-align: center; margin: 30px 0;'>
                <a href='{resetLink}' style='background: linear-gradient(to right, #6a11cb, #2575fc); color: white; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;'>⚡ ĐẶT LẠI MẬT KHẨU</a>
            </div>
            <p style='color: #666; font-size: 0.85rem;'>Nếu bạn không đưa ra yêu cầu này, vui lòng bỏ qua email này để bảo mật tài khoản.</p>
        </div>";

            // 3. 🚀 GỌI SERVICE CỦA BỒ ĐỂ GỬI MAIL: Siêu gọn đúng không nào!
            _emailService.SendEmail(user.Email, "🔒 [STORE] YÊU CẦU KHÔI PHỤC MẬT KHẨU", htmlBody);

            return Ok(new { success = true, message = "Gửi mail khôi phục thành công!" });
        }
        // =====================
        // RESET PASSWORD (Tiếp nhận mật khẩu mới)
        // =====================
        [HttpPost("reset-password")]
        public IActionResult ResetPassword([FromBody] ResetPasswordDTO model)
        {
            // 1. Tìm tài khoản có mã Token trùng khớp và mã đó phải còn trong thời hạn 15 phút
            var user = _context.Customers.FirstOrDefault(x => x.PasswordResetToken == model.Token && x.ResetTokenExpires > DateTime.UtcNow);

            if (user == null)
            {
                return BadRequest(new { message = "Mã xác thực không hợp lệ hoặc liên kết đã hết hạn!" });
            }

            // 2. Tiến hành băm (Hash) mật khẩu mới bằng BCrypt giống y chang lúc Đăng ký/Đổi mật khẩu
            user.Password = BCrypt.Net.BCrypt.HashPassword(model.NewPassword);

            // 3. Xóa Token cũ đi để không ai có thể dùng lại đường link này lần thứ 2 (Bảo mật tuyệt đối)
            user.PasswordResetToken = null;
            user.ResetTokenExpires = null;

            // 4. Lưu cập nhật xuống SQL Server
            _context.SaveChanges();

            return Ok(new { success = true, message = "Thay đổi mật khẩu thành công!" });
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