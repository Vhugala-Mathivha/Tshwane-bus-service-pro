using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/map")]
public class MapController : ControllerBase
{
    [HttpGet("bus-stations")]
    public IActionResult GetStations()
    {
        var stations = new[]
        {
            new { id = 1, name = "Pretoria Station", lat = -25.7500, lng = 28.1870 },
            new { id = 2, name = "Hatfield", lat = -25.7479, lng = 28.2293 },
            new { id = 3, name = "Centurion", lat = -25.8589, lng = 28.1868 },
            new { id = 4, name = "Menlyn", lat = -25.7850, lng = 28.2790 },
            new { id = 5, name = "Brooklyn", lat = -25.7720, lng = 28.2310 },
            new { id = 6, name = "Sunnyside", lat = -25.7580, lng = 28.2060 },
            new { id = 7, name = "Arcadia", lat = -25.7440, lng = 28.2080 },
            new { id = 8, name = "Mamelodi", lat = -25.7100, lng = 28.3610 },
            new { id = 9, name = "Atteridgeville", lat = -25.7660, lng = 28.0780 },
            new { id = 10, name = "Soshanguve", lat = -25.5480, lng = 28.1070 },
        };
        
        return Ok(stations);
    }
}