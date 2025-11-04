using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using vote.Data;

namespace vote.Controllers
{
    public class VotingController : Controller
    {
        private readonly ApplicationDbContext _db;
    private readonly ILogger<HomeController> _logger;

        public VotingController(ApplicationDbContext context, ILogger<HomeController> logger)
        {
            _db = context;
            _logger = logger;
        }

        [Authorize]
        public IActionResult Index()
        {
            var parties = _db.Parties.ToList();

            return View(parties);
        }

        // TODO: Implement a method that saves your vote & then redirects to a confirmation screen
    }
}
