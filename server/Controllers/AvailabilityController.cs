using Microsoft.AspNetCore.Mvc;
using Salon.Api.DTOs;
using Salon.Api.Services;

namespace Salon.Api.Controllers;

[ApiController]
[Route("api/v1/availability")]
public sealed class AvailabilityController : ControllerBase
{
    private readonly IAvailabilityService _availability;

    public AvailabilityController(IAvailabilityService availability)
    {
        _availability = availability;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<AvailabilitySlotDto>>> Get(
        [FromQuery] Guid serviceId,
        [FromQuery] DateOnly date,
        [FromQuery] Guid? staffId,
        CancellationToken cancellationToken)
    {
        var slots = await _availability.GetSlotsAsync(serviceId, date, staffId, cancellationToken);
        return Ok(slots);
    }
}
