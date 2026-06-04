using Hobdex.Api.Data;
using Hobdex.Api.DTOs;
using Hobdex.Api.Constants;
using Microsoft.EntityFrameworkCore;

namespace Hobdex.Api.Endpoints;

public static class HobbyEndpoints
{
    public static void MapHobbyEndpoints(this WebApplication app)
    {
        app.MapGet("/hobbies", async (HobdexDbContext db) =>
        {
            var hobbies = await db.Hobbies
                .Select(h => new HobbyDto
                {
                    Id = h.Id,
                    Name = h.Name,
                    ImageUrl = h.ImageUrl,
                    Description = h.Description,
                    IconName = h.IconName,
                    TotalEntries = h.Entries.Count(),
                    CompletedEntries = h.Entries.Count(e => e.EntryStatus.Name == EntryStatusNames.Completed),
                    InProgressEntries = h.Entries.Count(e => e.EntryStatus.Name == EntryStatusNames.InProgress),
                })
                .ToListAsync();

            return Results.Ok(hobbies);
        });

        app.MapGet("/hobbies/{id}", async (int id, HobdexDbContext db) =>
        {
            var hobby = await db.Hobbies
                .Where(h => h.Id == id)
                .Select(h => new HobbyDto
                {
                    Id = h.Id,
                    Name = h.Name,
                    ImageUrl = h.ImageUrl,
                    Description = h.Description,
                    IconName = h.IconName,
                    TotalEntries = h.Entries.Count(),
                    CompletedEntries = h.Entries.Count(e => e.EntryStatus.Name == EntryStatusNames.Completed),
                    InProgressEntries = h.Entries.Count(e => e.EntryStatus.Name == EntryStatusNames.InProgress),
                })
                .FirstOrDefaultAsync();

            return hobby is null ? Results.NotFound() : Results.Ok(hobby);
        });
    }
}