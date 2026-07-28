using backend.Models;
using backend.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public static class DatabaseSeeder
    {
        public static void SeedParties(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Party>().HasData(
                new Party { Id = 1, PartyName = "African Christian Democratic Party", PartyAbbreviation = Parties.ACDP, PartyUrl = "https://www.acdp.org.za" },
                new Party { Id = 2, PartyName = "Economic Freedom Fighters", PartyAbbreviation = Parties.EFF, PartyUrl = "https://www.effonline.org" },
                new Party { Id = 3, PartyName = "ActionSA", PartyAbbreviation = Parties.ACTION_SA, PartyUrl = "https://www.actionsa.org.za" },
                new Party { Id = 4, PartyName = "Al Jama-ah", PartyAbbreviation = Parties.ALJAMA, PartyUrl = "https://www.aljama-ah.org.za" },
                new Party { Id = 5, PartyName = "African National Congress", PartyAbbreviation = Parties.ANC, PartyUrl = "https://www.anc1912.org.za" },
                new Party { Id = 6, PartyName = "African Transformation Movement", PartyAbbreviation = Parties.ATM, PartyUrl = "https://www.atm.org.za" },
                new Party { Id = 7, PartyName = "Build One South Africa", PartyAbbreviation = Parties.BOSA, PartyUrl = "https://www.buildsa.org.za" },
                new Party { Id = 8, PartyName = "Democratic Alliance", PartyAbbreviation = Parties.DA, PartyUrl = "https://www.da.org.za" },
                new Party { Id = 9, PartyName = "Freedom Front Plus", PartyAbbreviation = Parties.FFP, PartyUrl = "https://www.vfplus.org.za" },
                new Party { Id = 10, PartyName = "GOOD", PartyAbbreviation = Parties.GOOD, PartyUrl = "https://www.good.org.za" },
                new Party { Id = 11, PartyName = "Inkatha Freedom Party", PartyAbbreviation = Parties.IFP, PartyUrl = "https://www.ifp.org.za" },
                new Party { Id = 12, PartyName = "National Coloured Congress", PartyAbbreviation = Parties.NCC, PartyUrl = "https://www.nccsa.org.za" },
                new Party { Id = 13, PartyName = "Patriotic Alliance", PartyAbbreviation = Parties.PA, PartyUrl = "https://www.pa.org.za" },
                new Party { Id = 14, PartyName = "Pan Africanist Congress", PartyAbbreviation = Parties.PAC, PartyUrl = "https://www.pac.org.za" },
                new Party { Id = 15, PartyName = "Rise Mzansi", PartyAbbreviation = Parties.RISE, PartyUrl = "https://www.risemzansi.org.za" },
                new Party { Id = 16, PartyName = "Umkhonto We Sizwe", PartyAbbreviation = Parties.MK, PartyUrl = "https://www.umkhontowesizwe.org.za" },
                new Party { Id = 17, PartyName = "United African Transformation", PartyAbbreviation = Parties.UAT, PartyUrl = "https://www.uat.org.za" },
                new Party { Id = 18, PartyName = "United Democratic Movement", PartyAbbreviation = Parties.UDM, PartyUrl = "https://www.udm.org.za" }
            );
        }
    }
}
