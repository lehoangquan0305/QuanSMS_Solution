using MailKit.Net.Smtp;
using MimeKit;

namespace CMS.Backend.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public void SendEmail(string toEmail, string subject, string body)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("CMS Store Support", _config["EmailSettings:FromEmail"]));
            message.To.Add(new MailboxAddress("Khách hàng", toEmail));
            message.Subject = subject;
            message.Body = new TextPart("html") { Text = body };

            using (var client = new SmtpClient())
            {
                client.Connect("smtp.gmail.com", 587, false);
                // Dùng mật khẩu ứng dụng (App Password)
                client.Authenticate(_config["EmailSettings:FromEmail"], _config["EmailSettings:AppPassword"]);
                client.Send(message);
                client.Disconnect(true);
            }
        }
    }
}