namespace CMS.Backend.Models
{
    public class AuthRegisterDTO
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        // Thêm 2 dòng này vào
        public string Phone { get; set; }
        public string Address { get; set; }
    }

    public class AuthLoginDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
    public class ChangePasswordDTO
    {
        public int UserId { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
    public class ForgotPasswordDTO
    {
        public string Email { get; set; }

    }
    public class ResetPasswordDTO
    {
        public string Token { get; set; }
        public string NewPassword { get; set; }
    }
}