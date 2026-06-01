using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using vote.Data;
using vote.Models;

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

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult VoteResult(int? party)
        {
            var userEmail = User.Identity?.Name;
            var registeredUser = _db.Users?.FirstOrDefault(u => u.Email == userEmail);

            if (registeredUser is null || party is null)
            {
                return NotFound();
            }

            if (registeredUser.HasVoted)
            {
                return Conflict("The user has voted");
            }

            var newVote = new Vote
            {
                ApplicationUserId = registeredUser.Id,
                PartyId = party.Value
            };

            _db.Votes.Add(newVote);
            registeredUser.HasVoted = true;
            _db.SaveChanges();

            return View();
        }
    }
}
