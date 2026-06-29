namespace Tabibi.Extensions
{
    public static class CookieExtensions
    {
        private const string RefreshTokenCookieName = "X-Refresh-Token";

        public static void SetRefreshTokenCookie(this IResponseCookies cookies, string token, int days = 7)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddDays(days)
            };

            cookies.Append(RefreshTokenCookieName, token, cookieOptions);
        }

        public static void DeleteRefreshTokenCookie(this IResponseCookies cookies)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddDays(-1) // Expire immediately
            };

            cookies.Append(RefreshTokenCookieName, "", cookieOptions);
        }
    }
}
