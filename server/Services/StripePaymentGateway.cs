using System.Globalization;
using System.Net.Http.Headers;
using System.Text.Json;
using Microsoft.Extensions.Options;
using Salon.Api.Infrastructure;

namespace Salon.Api.Services;

public sealed class StripePaymentGateway : IPaymentGateway
{
    private readonly HttpClient _httpClient;
    private readonly StripeOptions _options;
    private readonly ILogger<StripePaymentGateway> _logger;

    public StripePaymentGateway(
        HttpClient httpClient,
        IOptions<StripeOptions> options,
        ILogger<StripePaymentGateway> logger)
    {
        _httpClient = httpClient;
        _options = options.Value;
        _logger = logger;
    }

    public async Task<PaymentIntentResult> CreateIntentAsync(
        decimal amount,
        string description,
        string? paymentMethodId,
        IReadOnlyDictionary<string, string> metadata,
        CancellationToken cancellationToken)
    {
        if (amount <= 0)
        {
            return new PaymentIntentResult(null, true, false, null);
        }

        if (string.IsNullOrWhiteSpace(_options.SecretKey))
        {
            _logger.LogInformation(
                "Stripe is not configured. Payment for {Description} remains pending.",
                description);
            return new PaymentIntentResult(null, false, false, null);
        }

        var minorUnits = checked((long)Math.Round(amount * 100m, MidpointRounding.AwayFromZero));
        var fields = new List<KeyValuePair<string, string>>
        {
            new("amount", minorUnits.ToString(CultureInfo.InvariantCulture)),
            new("currency", _options.Currency),
            new("description", description),
            new("automatic_payment_methods[enabled]", "true")
        };
        fields.AddRange(metadata.Select(item =>
            new KeyValuePair<string, string>($"metadata[{item.Key}]", item.Value)));

        if (!string.IsNullOrWhiteSpace(paymentMethodId))
        {
            fields.Add(new KeyValuePair<string, string>("payment_method", paymentMethodId));
        }

        using var request = new HttpRequestMessage(HttpMethod.Post, "v1/payment_intents")
        {
            Content = new FormUrlEncodedContent(fields)
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.SecretKey);

        using var response = await _httpClient.SendAsync(request, cancellationToken);
        var payload = await response.Content.ReadAsStringAsync(cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            _logger.LogWarning("Stripe rejected a payment intent: {StatusCode} {Response}", response.StatusCode, payload);
            throw new ApiException(
                StatusCodes.Status502BadGateway,
                "Payment provider error",
                "The payment provider could not initialize this payment. No booking or order was charged.",
                "payment_provider_error");
        }

        using var json = JsonDocument.Parse(payload);
        var root = json.RootElement;
        var id = root.GetProperty("id").GetString();
        var status = root.GetProperty("status").GetString();
        var clientSecret = root.TryGetProperty("client_secret", out var clientSecretElement)
            ? clientSecretElement.GetString()
            : null;

        return new PaymentIntentResult(
            id,
            status == "succeeded",
            status is "requires_action" or "requires_confirmation" or "requires_payment_method",
            clientSecret);
    }
}
