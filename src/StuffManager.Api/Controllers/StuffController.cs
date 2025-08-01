using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StuffManager.Api.Data;

namespace StuffManager.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class StuffController : ControllerBase
{
    private readonly StuffDbContext _context;
    private readonly ILogger<StuffController> _logger;

    public StuffController(StuffDbContext context, ILogger<StuffController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Stuff>>> GetStuff(int page = 1)
    {
        const int pageSize = 10;
        
        if (page < 1)
        {
            return BadRequest("Page number must be greater than 0");
        }

        var skip = (page - 1) * pageSize;
        
        var stuffItems = await _context.Stuffs
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync();

        return Ok(stuffItems);
    }
}
