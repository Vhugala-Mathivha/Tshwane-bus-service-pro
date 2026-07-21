using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SignupApi.Data;

namespace SignupApi.Controllers
{
    [ApiController]
    [Route("api/test")]
    public class TestController : ControllerBase
    {
        private readonly TshwaneDbContext _tshwane;

        public TestController(TshwaneDbContext tshwane)
        {
            _tshwane = tshwane;
        }


        [HttpGet]
        public async Task<IActionResult> Test()
        {
            var cards = await _tshwane.CardHolders.ToListAsync();

            return Ok(cards);
        }
    }
}