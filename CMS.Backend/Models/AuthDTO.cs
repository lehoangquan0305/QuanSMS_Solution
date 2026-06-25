namespace CMS.Backend.Models
{
    public class AuthRegisterDTO
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class AuthLoginDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}