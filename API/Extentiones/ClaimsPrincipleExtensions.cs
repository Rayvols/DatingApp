using System.Security.Claims;

namespace API.Extentiones
{
    public static class ClaimsPrincipleExtensions
    {
        public static string GetUsername (this ClaimsPrincipal user)
        {
           return user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        }
    }
}