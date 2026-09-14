using System;
using System.Threading.Tasks;
using System.Web;
using PhoneStore.Orders;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace PhoneStore.Payments
{
    public class PaymentAppService : ApplicationService
    {
        private readonly IRepository<Order, Guid> _orderRepository;

        // Cấu hình tài khoản nhận tiền (Thay bằng STK thật của bạn để test)
        private const string BankId = "MB"; // Mã ngân hàng: MB, VCB, TCB, ACB, VPB, ICB...
        private const string AccountNo = "0859040056"; 
        private const string AccountName = "NGUYEN NHAT BAO";

        public PaymentAppService(IRepository<Order, Guid> orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<string> GetVietQrUrlAsync(Guid orderId)
        {
            var order = await _orderRepository.GetAsync(orderId);
            
            // Rút gọn ID hoặc lấy mã ngắn gọn làm nội dung chuyển khoản (VD: DH 123456)
            string shortCode = order.Id.ToString().Substring(0, 8).ToUpper();
            string description = HttpUtility.UrlEncode($"DH {shortCode}");
            string accountNameEncoded = HttpUtility.UrlEncode(AccountName);

            // Sinh link ảnh VietQR tự động điền số tiền và nội dung
            string qrUrl = $"https://img.vietqr.io/image/{BankId}-{AccountNo}-compact2.jpg?amount={(long)order.TotalPrice}&addInfo={description}&accountName={accountNameEncoded}";

            return qrUrl;
        }
    }
}