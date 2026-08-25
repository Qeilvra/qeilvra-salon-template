namespace Salon.Api.Infrastructure;

public sealed class ApiException : Exception
{
    public ApiException(int statusCode, string title, string detail, string? code = null)
        : base(detail)
    {
        StatusCode = statusCode;
        Title = title;
        Code = code;
    }

    public int StatusCode { get; }
    public string Title { get; }
    public string? Code { get; }

    public static ApiException BadRequest(string detail, string? code = null) =>
        new(StatusCodes.Status400BadRequest, "Request validation failed", detail, code);

    public static ApiException NotFound(string detail, string? code = null) =>
        new(StatusCodes.Status404NotFound, "Resource not found", detail, code);

    public static ApiException Conflict(string detail, string? code = null) =>
        new(StatusCodes.Status409Conflict, "Request conflict", detail, code);
}
